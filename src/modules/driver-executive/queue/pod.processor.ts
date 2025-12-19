/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/require-await */
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUE_POD, PodJob } from './driver-executive.queue.token';

@Processor(QUEUE_POD, { concurrency: 4 })
export class PodProcessor extends WorkerHost {
  async process(job: Job) {
    switch (job.name) {
      case PodJob.ValidateMedia:
        // kiểm tra kích thước/định dạng URL (hoặc gọi service media)
        return { ok: true };
      case PodJob.VirusScan:
        // gọi AV gateway nếu có
        return { ok: true };
      case PodJob.GenerateThumb:
        // tạo thumbnail async
        return { ok: true };
      default:
        return { ignored: true };
    }
  }
}
