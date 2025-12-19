/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/require-await */
import { PrismaService } from '@/core/prisma/prisma.service';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUE_COD, CodJob } from './driver-executive.queue.token';

@Processor(QUEUE_COD, { concurrency: 6 })
export class CodProcessor extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case CodJob.Register:
        // đã ghi vào DB ngay trong repository → ở đây có thể gửi sang kế toán/ETL
        return { ok: true };
      case CodJob.Aggregate:
        // gom theo driver/ngày → viết ra bảng tổng hợp nếu bạn có
        return { ok: true };
      default:
        return { ignored: true };
    }
  }
}
