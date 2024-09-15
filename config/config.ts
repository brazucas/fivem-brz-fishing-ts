import { Fish } from "@common/types";

export const DEFAULT_LANG = "pt-br";

const MAXIMUM_LINE_TENSION = 100;
const LINE_TENSION_INCREASE_RATE = 5;
const TENSION_RECOVER_RATE = 1;
const PULL_DISTANCE_RATE_PER_TICK = 10;
const ROD_CAST_CHALLENGE_VELOCITY = 1;
const ROD_CAST_CHALLENGE_INTERVAL = 1;
const ROD_CAST_CHALLENGE_ACCELERATION = 0.0001;
const BAIT_HOLD_CHALLENGE_TIME = 500;

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

export const fishes: Fish = {
  fish: {
    itemName: "fish",
    type: "common",
    hash: 802685111,
  },
  dolphin: {
    itemName: "dolphin",
    type: "uncommon",
    hash: -1950698411,
  },
  hammerShark: {
    itemName: "hammershark",
    type: "uncommon",
    hash: 1015224100,
  },
  tigerShark: {
    itemName: "tigershark",
    type: "rare",
    hash: 113504370,
  },
  killerWhale: {
    itemName: "killerwhale",
    type: "epic",
    hash: -1920284487,
  },
  humpBack: {
    itemName: "humpback",
    type: "legendary",
    hash: 1193010354,
  },
  stingray: {
    itemName: "stingray",
    type: "rare",
    hash: "a_c_stingray",
  },
};
