import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IAssignInput,
  IReassignInput,
  IUnassignInput,
} from './interfaces/assignment.interfaces';
import { AssignmentRepository } from './repositories/assignment.repository';

function isTerminalShipmentStatus(status?: string | null) {
  return status === 'COMPLETED' || status === 'CANCELED';
}

function ensureOrgScopeOrThrow(
  reqOrgId: string | undefined,
  dataOrgId: string | null,
) {
  if (!reqOrgId || !dataOrgId || reqOrgId !== dataOrgId) {
    throw new ForbiddenException('Shipment is outside your organization scope');
  }
}

@Injectable()
export class AssignmentService {
  constructor(private readonly repo: AssignmentRepository) {}

  async getAssignmentByShipment(orgId: string | undefined, shipmentId: string) {
    const sOrg = await this.repo.getShipmentOrgId(shipmentId);
    if (sOrg == null) throw new NotFoundException('Shipment not found');
    ensureOrgScopeOrThrow(orgId, sOrg);

    const a = await this.repo.getAssignmentByShipment(shipmentId);
    return a ?? null;
  }

  async assign(
    orgId: string | undefined,
    byUserId: string | null,
    input: IAssignInput,
  ) {
    const sh = await this.repo.getShipment(input.shipmentId);
    if (!sh) throw new NotFoundException('Shipment not found');

    const sOrg = await this.repo.getShipmentOrgId(input.shipmentId);
    ensureOrgScopeOrThrow(orgId, sOrg);

    if (isTerminalShipmentStatus(sh.status)) {
      throw new BadRequestException(
        `Cannot assign on terminal shipment status: ${sh.status}`,
      );
    }

    if (input.driverId) {
      const drv = await this.repo.getDriver(input.driverId);
      if (!drv) throw new NotFoundException('Driver not found');
      if (drv.status !== 'AVAILABLE') {
        throw new BadRequestException(
          `Driver must be AVAILABLE (current: ${drv.status})`,
        );
      }
      const hasActive = await this.repo.driverHasActiveAssignment(
        input.driverId,
      );
      if (hasActive)
        throw new BadRequestException('Driver has active assignment');
    }

    if (input.vehicleId) {
      const veh = await this.repo.getVehicle(input.vehicleId);
      if (!veh) throw new NotFoundException('Vehicle not found');
      if (!['AVAILABLE', 'IN_SERVICE'].includes(veh.status)) {
        throw new BadRequestException(
          `Vehicle must be AVAILABLE/IN_SERVICE (current: ${veh.status})`,
        );
      }
      const hasActive = await this.repo.vehicleHasActiveAssignment(
        input.vehicleId,
      );
      if (hasActive)
        throw new BadRequestException('Vehicle has active assignment');
    }

    const va = await this.repo.assignShipment({
      shipmentId: input.shipmentId,
      driverId: input.driverId,
      vehicleId: input.vehicleId,
      byUserId,
      note: input.note,
    });

    return va;
  }

  async reassign(
    orgId: string | undefined,
    byUserId: string | null,
    input: IReassignInput,
  ) {
    return this.assign(orgId, byUserId, input);
  }

  async unassign(
    orgId: string | undefined,
    _byUserId: string | null,
    input: IUnassignInput,
  ) {
    const sh = await this.repo.getShipment(input.shipmentId);
    if (!sh) throw new NotFoundException('Shipment not found');

    const sOrg = await this.repo.getShipmentOrgId(input.shipmentId);
    ensureOrgScopeOrThrow(orgId, sOrg);

    if (isTerminalShipmentStatus(sh.status)) {
      throw new BadRequestException(
        `Cannot unassign on terminal shipment status: ${sh.status}`,
      );
    }

    const last = await this.repo.unassignShipment(input.shipmentId);
    return { removed: !!last, previous: last };
  }
}
