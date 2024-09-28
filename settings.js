const SETTINGS = {
  INVENTORY_SYSTEM: "ox_inventory", // ox_inventory or qbCore
  DEFAULT_LANG: "en-us",
  MAXIMUM_LINE_TENSION: 100,
  LINE_TENSION_INCREASE_RATE: 5,
  TENSION_RECOVER_RATE: 1,
  PULL_DISTANCE_RATE_PER_TICK: 10,
  ROD_CAST_CHALLENGE_VELOCITY: 1,
  ROD_CAST_CHALLENGE_INTERVAL: 1,
  ROD_CAST_CHALLENGE_ACCELERATION: 0.0001,
  BAIT_HOLD_CHALLENGE_TIME: 500,
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

if (typeof exports !== "undefined") {
  exports("SETTINGS", SETTINGS);
}

if (typeof window !== "undefined") {
  window.SETTINGS = SETTINGS;
}
