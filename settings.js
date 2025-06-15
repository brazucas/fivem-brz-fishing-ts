const SETTINGS = {
  INVENTORY_SYSTEM: "qbCore", // ox_inventory or qbCore
  NOTIFICATION_SYSTEM: "qbCore", // oxLib or qbCore
  DEFAULT_LANG: "en-us",
  MAXIMUM_LINE_TENSION: 100,
  LINE_TENSION_INCREASE_RATE: 5,
  TENSION_RECOVER_RATE: 1,
  PULL_DISTANCE_RATE_PER_TICK: 10,
  ROD_CAST_CHALLENGE_VELOCITY: 1,
  ROD_CAST_CHALLENGE_INTERVAL: 1,
  ROD_CAST_CHALLENGE_ACCELERATION: 0.0001,
  BAIT_HOLD_CHALLENGE_TIME: 500,
  DYNAMIC_MINIGAME_POSITION: true,
  FISHES: {
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
  },
};

const LOCALE_OVERRIDES = {
  // "en-us": {
  //   fish_pull_hint: "My custom hint",
  // },
};

if (typeof exports !== "undefined") {
  exports("SETTINGS", SETTINGS);
  exports("LOCALE_OVERRIDES", LOCALE_OVERRIDES);
}

if (typeof window !== "undefined") {
  window.SETTINGS = SETTINGS;
  window.LOCALE_OVERRIDES = LOCALE_OVERRIDES;
}
