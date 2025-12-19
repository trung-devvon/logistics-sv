/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { PrismaService } from '@/core/prisma/prisma.service';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  QUEUE_DRIVER_EVENTS,
  DriverEventJob,
} from './driver-executive.queue.token';

@Processor(QUEUE_DRIVER_EVENTS, { concurrency: 8 })
export class DriverEventsProcessor extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case DriverEventJob.StopArrived:
        // có thể cập nhật báo cáo realtime, materialized view phụ
        return { ok: true };
      case DriverEventJob.StopDone:
        // cập nhật số liệu SLA thực tế, KPI tuyến
        return { ok: true };
      case DriverEventJob.StopFailed:
        // tạo exception auto theo rule nếu cần
        return { ok: true };
      default:
        return { ignored: true };
    }
  }
}
