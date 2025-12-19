/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUE_WEBHOOK, WebhookJob } from './driver-executive.queue.token';

@Processor(QUEUE_WEBHOOK, { concurrency: 4 })
export class WebhookProcessor extends WorkerHost {
  async process(job: Job) {
    switch (job.name) {
      case WebhookJob.StopEvent:
      case WebhookJob.OrderStatus:
        // gọi outbound webhook có retry/backoff; ký HMAC
        return { ok: true };
      default:
        return { ignored: true };
    }
  }
}
