import { IAssignmentScore, IScoreContext } from './types';

export class DispatcherScoring {
  /**
   * Scoring đơn giản:
   * - capacityOk: +50
   * - driver available: +30
   * - distance (km): -2 * distance
   * - etaPenaltySec: -0.01 * sec (nếu trễ)
   */
  static scoreCandidate(
    driverId: string,
    vehicleId: string | undefined,
    ctx: IScoreContext,
  ): IAssignmentScore {
    let score = 0;
    const reason: string[] = [];

    if (ctx.capacityOk) {
      score += 50;
      reason.push('capacityOk');
    }
    if ((ctx.driverStatusWeight ?? 0) > 0) {
      score += ctx.driverStatusWeight ?? 0;
      reason.push('driverAvailable');
    }
    if (ctx.distanceKm && ctx.distanceKm > 0) {
      score -= 2 * ctx.distanceKm;
      reason.push(`dist-${ctx.distanceKm.toFixed(1)}km`);
    }
    if (ctx.etaPenaltySec && ctx.etaPenaltySec > 0) {
      score -= 0.01 * ctx.etaPenaltySec;
      reason.push(`etaPenalty-${ctx.etaPenaltySec}s`);
    }

    return {
      driverId,
      vehicleId,
      score,
      reason: reason.join(','),
    };
  }
}
