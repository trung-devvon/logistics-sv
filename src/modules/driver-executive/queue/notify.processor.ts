/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/require-await */
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUE_NOTIFY, NotifyJob } from './driver-executive.queue.token';

@Processor(QUEUE_NOTIFY, { concurrency: 10 })
export class NotifyProcessor extends WorkerHost {
  async process(job: Job) {
    switch (job.name) {
      case NotifyJob.StopUpdated:
        // push in-app / WebSocket / email tùy kênh
        return { ok: true };
      case NotifyJob.OrderUpdated:
        // notify khách hàng/đối tác
        return { ok: true };
      default:
        return { ignored: true };
    }
  }
}
