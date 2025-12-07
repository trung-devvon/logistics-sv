import { Module } from '@nestjs/common';
import { LoggerModule } from './logging/logger.module';
import { MetricsModule } from './metrics/metrics.module';
import { TracingModule } from './tracing/tracing.module';
import { HealthModule } from './health/health.module';
@Module({
  controllers: [],
  providers: [],
  imports: [LoggerModule, MetricsModule, TracingModule, HealthModule],
})
export class ObservabilityModule {}
