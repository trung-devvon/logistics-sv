export const QUEUE_DRIVER_EVENTS = 'driver-events';
export const QUEUE_POD = 'pod-processing';
export const QUEUE_COD = 'cod-settlement';
export const QUEUE_NOTIFY = 'notify';
export const QUEUE_WEBHOOK = 'webhook';

export enum DriverEventJob {
  StopArrived = 'driver.stop.arrived',
  StopDone = 'driver.stop.done',
  StopFailed = 'driver.stop.failed',
}

export enum PodJob {
  ValidateMedia = 'pod.validate.media',
  VirusScan = 'pod.virus.scan',
  GenerateThumb = 'pod.generate.thumb',
}

export enum CodJob {
  Register = 'cod.register',
  Aggregate = 'cod.aggregate', // gom theo driver/ngày
}

export enum NotifyJob {
  StopUpdated = 'notify.stop.updated',
  OrderUpdated = 'notify.order.updated',
}

export enum WebhookJob {
  StopEvent = 'webhook.stop.event',
  OrderStatus = 'webhook.order.status',
}
