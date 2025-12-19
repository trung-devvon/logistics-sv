import { BadRequestException, Injectable } from '@nestjs/common';
import { AssignmentService } from '../assignment/assignment.service';
import { DispatcherScoring } from './dispatcher.scoring';
import { DispatcherGateway } from './dispatcher.gateway';
import {
  IBoardQuery,
  IDispatchManualInput,
  IDispatchAutoInput,
  IDispatchBulkInput,
} from './interfaces/board.interface';
import { IDispatchResult } from './interfaces/dispatcher.interface';
import { DispatcherRepository } from './repositories/dispatcher.repository';
import { GeoService } from '../geo-distance/geo-distance.service';

@Injectable()
export class DispatcherService {
  constructor(
    private readonly repo: DispatcherRepository,
    private readonly assignment: AssignmentService,
    private readonly gateway: DispatcherGateway,
    private geo: GeoService,
  ) {}

  async getBoard(orgId: string, q: IBoardQuery) {
    const since = q.since ? new Date(q.since) : undefined;
    const until = q.until ? new Date(q.until) : undefined;

    const [shipments, drivers, vehicles] = await Promise.all([
      this.repo.findUnassignedShipments(
        orgId,
        q.hubId,
        since,
        until,
        q.limit,
        q.offset,
      ),
      this.repo.findAvailableDrivers(orgId, q.hubId),
      this.repo.findAvailableVehicles(orgId, q.hubId),
    ]);

    return {
      shipments,
      drivers,
      vehicles,
      limit: q.limit ?? 50,
      offset: q.offset ?? 0,
    };
  }

  async dispatchManual(
    orgId: string,
    userId: string | null,
    input: IDispatchManualInput,
  ): Promise<IDispatchResult> {
    // Giao cho AssignmentService (đã có rule & audit)
    const a = await this.assignment.assign(orgId, userId, {
      shipmentId: input.shipmentId,
      driverId: input.driverId,
      vehicleId: input.vehicleId,
      note: input.note,
    });

    const res: IDispatchResult = {
      shipmentId: a.shipmentId,
      driverId: a.driverId ?? null,
      vehicleId: a.vehicleId ?? null,
      assigned: true,
    };
    this.gateway.broadcastAssigned(res);
    return res;
  }

  async dispatchAuto(
    orgId: string,
    userId: string | null,
    input: IDispatchAutoInput,
  ): Promise<IDispatchResult> {
    const board = await this.getBoard(orgId, { limit: 200, offset: 0 });
    const target = board.shipments.find((s: any) => s.id === input.shipmentId);
    if (!target)
      throw new BadRequestException('Shipment not found in unassigned list');

    const needKg = Number(target.totalWeightKg ?? 0);
    const needM3 = Number(target.totalVolumeM3 ?? 0);

    const startLat =
      typeof target.startLat === 'number' ? target.startLat : null;
    const startLng =
      typeof target.startLng === 'number' ? target.startLng : null;

    const candidates = [];
    for (const d of board.drivers) {
      if (d.activeAssignmentCount > 0) continue;

      const v = board.vehicles.find((vh: any) => {
        if (vh.activeAssignmentCount > 0) return false;
        const okKg = vh.capacityKg ? Number(vh.capacityKg) >= needKg : true;
        const okM3 = vh.capacityM3 ? Number(vh.capacityM3) >= needM3 : true;
        return okKg && okM3;
      });

      const capacityOk = v
        ? (v.capacityKg ? Number(v.capacityKg) >= needKg : true) &&
          (v.capacityM3 ? Number(v.capacityM3) >= needM3 : true)
        : true;

      // ====== TÍNH DISTANCE/ETA THẬT ======
      // From = last location (ưu tiên), else bỏ qua (điểm 0)
      let distanceKm = 0;
      let etaPenaltySec = 0;

      if (
        d.lastLat != null &&
        d.lastLng != null &&
        startLat != null &&
        startLng != null
      ) {
        const m = await this.geo.drivingOneToOne(
          { lat: d.lastLat, lng: d.lastLng },
          { lat: startLat, lng: startLng },
        );
        distanceKm = m.distanceMeters / 1000;

        if (target.promisedAtMax) {
          const now = Date.now();
          const slackSec =
            (new Date(target.promisedAtMax).getTime() - now) / 1000; // còn lại
          // Hình phạt nếu thời lượng lái > thời gian còn lại tới promise
          etaPenaltySec = m.durationSeconds - Math.max(slackSec, 0);
          if (etaPenaltySec < 0) etaPenaltySec = 0;
        }
      }

      const score = DispatcherScoring.scoreCandidate(d.id, v?.id, {
        capacityOk,
        driverStatusWeight: 30,
        distanceKm,
        etaPenaltySec,
      });
      candidates.push(score);
    }

    if (candidates.length === 0) {
      return {
        shipmentId: input.shipmentId,
        assigned: false,
        reason: 'No candidate (driver/vehicle) available',
      };
    }

    candidates.sort((a, b) => b.score - a.score);
    const best = candidates[0];

    const a = await this.assignment.assign(orgId, userId, {
      shipmentId: input.shipmentId,
      driverId: best.driverId,
      vehicleId: best.vehicleId,
      note: input.note,
    });

    const res: IDispatchResult = {
      shipmentId: a.shipmentId,
      driverId: a.driverId ?? null,
      vehicleId: a.vehicleId ?? null,
      assigned: true,
    };
    this.gateway.broadcastAssigned(res);
    return res;
  }

  async dispatchBulk(
    orgId: string,
    userId: string | null,
    input: IDispatchBulkInput,
  ) {
    const results: IDispatchResult[] = [];
    for (const item of input.items) {
      try {
        if (item.driverId || item.vehicleId) {
          results.push(
            await this.dispatchManual(orgId, userId, {
              shipmentId: item.shipmentId,
              driverId: item.driverId, // nếu truyền thủ công
              vehicleId: item.vehicleId,
              note: item.note,
            }),
          );
        } else {
          results.push(
            await this.dispatchAuto(orgId, userId, {
              shipmentId: item.shipmentId,
              note: item.note,
            }),
          );
        }
      } catch (e: any) {
        results.push({
          shipmentId: item.shipmentId,
          assigned: false,
          reason: e?.message ?? 'error',
        });
      }
    }
    return results;
  }
}
