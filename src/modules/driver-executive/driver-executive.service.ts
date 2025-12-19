import { BadRequestException, Injectable } from '@nestjs/common';
import { ArriveStopDto } from './dto/arrive-stop.dto';
import { CodCollectDto } from './dto/cod-collect.dto';
import { DoneStopDto } from './dto/done-stop.dto';
import { FailStopDto } from './dto/fail-stop.dto';
import { PodUploadDto } from './dto/pod-upload.dto';
import { QueryTodayDto } from './dto/query-today.dto';
import { DriverExecutiveRepository } from './repositories/driver-executive.repository';
import { DriverExecutiveProducer } from './queue/driver-executive.producer';

@Injectable()
export class DriverExecutiveService {
  constructor(
    private readonly repo: DriverExecutiveRepository,
    private readonly producer: DriverExecutiveProducer,
  ) {}

  async listToday(orgId: string | null, userId: string, q: QueryTodayDto) {
    const driver = await this.repo.findDriverByUserId(userId);
    if (!driver)
      throw new BadRequestException(
        'Driver profile not found for current user',
      );

    const shipments = await this.repo.findTodayShipmentsForDriver(
      driver.id,
      q.date,
    );
    return shipments.map((s) => ({
      id: s.id,
      type: s.type,
      plannedStart: s.plannedStart,
      plannedEnd: s.plannedEnd,
      status: s.status,
      stops: s.routeStops.map((st) => ({
        id: st.id,
        sequenceNo: st.sequenceNo,
        stopType: st.stopType,
        status: st.status,
        eta: st.eta,
        ata: st.ata,
        address: st.address,
        orderId: st.orderId,
      })),
    }));
  }

  async arriveStop(
    orgId: string | null,
    userId: string,
    stopId: string,
    body: ArriveStopDto,
  ) {
    // Validate ownership có thể bổ sung: stop thuộc shipment đã assign cho driver hiện tại
    const rs = this.repo.setStopArrived(
      stopId,
      userId,
      body.note,
      body.lat,
      body.lng,
    );
    await this.producer.emitArrived({
      stopId,
      userId,
      orgId,
      note: body.note,
      lat: body.lat,
      lng: body.lng,
    });
    return rs;
  }

  async doneStop(
    orgId: string | null,
    userId: string,
    stopId: string,
    body: DoneStopDto,
  ) {
    const rs = await this.repo.getRouteStopById(stopId);
    if (!rs) throw new BadRequestException('Route stop not found');

    // Nếu là DELIVERY và yêu cầu POD thì phải có POD trước
    if ((body.requirePod ?? true) && rs.stopType === 'DELIVERY') {
      const pod = await this.repo.ensurePod(stopId);
      if (!pod)
        throw new BadRequestException(
          'POD required before marking delivery DONE',
        );
    }

    // Nếu có COD → tạo giao dịch COD (ngay trước khi DONE)
    if (body.codReceived && body.codReceived > 0) {
      const driver = await this.repo.findDriverByUserId(userId);
      const cod = await this.repo.collectCOD(
        stopId,
        driver?.id ?? null,
        body.codReceived,
        userId,
      );
      await this.producer.enqueueCodRegister({
        routeStopId: stopId,
        orderId: cod.orderId,
        driverId: driver?.id ?? null,
        amount: body.codReceived,
      });
    }

    return this.repo.setStopDone(stopId, userId, body.note);
  }

  async failStop(
    orgId: string | null,
    userId: string,
    stopId: string,
    body: FailStopDto,
  ) {
    const updated = await this.repo.setStopFailed(
      stopId,
      userId,
      body.reason,
      body.note,
    );
    await this.producer.emitFailed({
      stopId,
      userId,
      orgId,
      reason: body.reason,
      note: body.note,
    });
    return updated;
  }

  async uploadPod(
    orgId: string | null,
    userId: string,
    stopId: string,
    body: PodUploadDto,
  ) {
    const pod = await this.repo.upsertPod(
      stopId,
      body.photoUrls,
      body.signatureBase64,
      body.note,
    );
    await this.producer.enqueuePodTasks({
      routeStopId: stopId,
      photoUrls: body.photoUrls,
      signature: body.signatureBase64,
    });
    return pod;
  }

  async collectCod(
    orgId: string | null,
    userId: string,
    stopId: string,
    body: CodCollectDto,
  ) {
    const driver = await this.repo.findDriverByUserId(userId);
    return this.repo.collectCOD(
      stopId,
      driver?.id ?? null,
      body.amount,
      userId,
    );
  }
}
