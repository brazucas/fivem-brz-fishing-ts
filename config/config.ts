import { Fish } from "@common/types";

declare let SETTINGS: any;

const {
  MAXIMUM_LINE_TENSION,
  LINE_TENSION_INCREASE_RATE,
  TENSION_RECOVER_RATE,
  PULL_DISTANCE_RATE_PER_TICK,
  ROD_CAST_CHALLENGE_VELOCITY,
  ROD_CAST_CHALLENGE_INTERVAL,
  ROD_CAST_CHALLENGE_ACCELERATION,
  BAIT_HOLD_CHALLENGE_TIME,
  FISHES,
} = SETTINGS;

export const fishingLimits = {
  maximumLineTension: Number(MAXIMUM_LINE_TENSION) || 100,
  lineTensionIncreaseRate: Number(LINE_TENSION_INCREASE_RATE) || 5,
  tensionRecoverRate: Number(TENSION_RECOVER_RATE) || 5,
  pullDistanceRatePerTick: Number(PULL_DISTANCE_RATE_PER_TICK) || 10,
  rodCastChallengeVelocity: Number(ROD_CAST_CHALLENGE_VELOCITY) || 1,
  rodCastChallengeInterval: Number(ROD_CAST_CHALLENGE_INTERVAL) || 1,
  rodCastChallengeAcceleration:
    Number(ROD_CAST_CHALLENGE_ACCELERATION) || 0.0001,
  baitHoldChallengeTime: Number(BAIT_HOLD_CHALLENGE_TIME) || 500,
} as const;

export const fishes: Fish = FISHES as any;
