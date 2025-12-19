import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import {
  QUEUE_DRIVER_EVENTS,
  QUEUE_POD,
  QUEUE_COD,
  QUEUE_NOTIFY,
  QUEUE_WEBHOOK,
  DriverEventJob,
  NotifyJob,
  WebhookJob,
  PodJob,
  CodJob,
} from './driver-executive.queue.token';

@Injectable()
export class DriverExecutiveProducer {
  constructor(
    @InjectQueue(QUEUE_DRIVER_EVENTS) private readonly driverEventsQ: Queue,
    @InjectQueue(QUEUE_POD) private readonly podQ: Queue,
    @InjectQueue(QUEUE_COD) private readonly codQ: Queue,
    @InjectQueue(QUEUE_NOTIFY) private readonly notifyQ: Queue,
    @InjectQueue(QUEUE_WEBHOOK) private readonly webhookQ: Queue,
  ) {}

  async emitArrived(payload: Record<string, unknown>) {
    await this.driverEventsQ.add(DriverEventJob.StopArrived, payload, {
      attempts: 5,
      backoff: { type: 'exponential', delay: 1500 },
    });
    await this.notifyQ.add(NotifyJob.StopUpdated, payload, {
      removeOnComplete: 500,
    });
    await this.webhookQ.add(
      WebhookJob.StopEvent,
      { ...payload, type: 'arrived' },
      { attempts: 3 },
    );
  }

  async emitDone(payload: Record<string, unknown>) {
    await this.driverEventsQ.add(DriverEventJob.StopDone, payload, {
      attempts: 5,
      backoff: { type: 'exponential', delay: 1500 },
    });
    await this.notifyQ.add(NotifyJob.StopUpdated, payload, {
      removeOnComplete: 500,
    });
    await this.webhookQ.add(
      WebhookJob.OrderStatus,
      { ...payload, status: 'DELIVERED' },
      { attempts: 3 },
    );
  }

  async emitFailed(payload: Record<string, unknown>) {
    await this.driverEventsQ.add(DriverEventJob.StopFailed, payload, {
      attempts: 5,
      backoff: { type: 'exponential', delay: 1500 },
    });
    await this.notifyQ.add(NotifyJob.StopUpdated, payload);
    await this.webhookQ.add(
      WebhookJob.OrderStatus,
      { ...payload, status: 'FAILED' },
      { attempts: 3 },
    );
  }

  async enqueuePodTasks(payload: {
    routeStopId: string;
    photoUrls: string[];
    signature?: string;
  }) {
    await this.podQ.add(PodJob.ValidateMedia, payload, { attempts: 3 });
    await this.podQ.add(PodJob.VirusScan, payload, { attempts: 3 });
    await this.podQ.add(PodJob.GenerateThumb, payload, {
      attempts: 3,
      removeOnComplete: 1000,
    });
  }

  async enqueueCodRegister(payload: {
    routeStopId: string;
    orderId: string;
    driverId?: string | null;
    amount: number;
  }) {
    await this.codQ.add(CodJob.Register, payload, {
      attempts: 5,
      backoff: { type: 'fixed', delay: 1000 },
    });
    await this.codQ.add(
      CodJob.Aggregate,
      { driverId: payload.driverId },
      { delay: 30_000, removeOnComplete: 100 },
    );
  }
}
