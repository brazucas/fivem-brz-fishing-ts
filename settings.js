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
  blips: {
    fishing_spot: {
      sprite: 68,
      scale: 0.7,
      color: 2,
      name: "Fishing Spot",
      display: 4,
    },
  },
  hotspots: {
    vinewood_hills_pier1: {
      coords: {
        x: -202.26690673828125,
        y: 771.5943603515625,
        z: 196.0670776367187,
      },
      radius: 25,
      fishes: ["fish", "dolphin", "hammerShark"],
      bait: ["commonbait"],
      waterType: "freshwater",
    },
    vinewood_hills_pier2: {
      coords: {
        x: 52.54157638549805,
        y: 838.1432495117188,
        z: 196.04396057128906,
      },
      radius: 25,
      fishes: ["fish", "dolphin", "hammerShark"],
      bait: ["commonbait"],
      waterType: "freshwater",
    },
    vinewood_racetrack: {
      coords: {
        x: 1214.0972900390625,
        y: 217.0813751220703,
        z: 78.80705261230469,
      },
      radius: 25,
      fishes: ["fish", "dolphin", "hammerShark"],
      bait: ["commonbait"],
      waterType: "freshwater",
    },
    land_act_reservoir: {
      coords: {
        x: 1926.6541748046875,
        y: 232.1569061279297,
        z: 160.08026123046875,
      },
      radius: 25,
      fishes: ["fish", "dolphin", "hammerShark"],
      bait: ["commonbait"],
      waterType: "freshwater",
    },
    del_perro_beach_pier: {
      coords: {
        x: -1882.2113037109375,
        y: -1285.4139404296875,
        z: -0.1267852783203125,
      },
      radius: 25,
      fishes: ["fish", "dolphin", "hammerShark"],
      bait: ["commonbait"],
      waterType: "saltwater",
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
