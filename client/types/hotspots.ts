export type FishingHotspot = {
  coords: {
    x: number;
    y: number;
    z: number;
  };
  radius: number;
  fishes: string[];
  bait: string[];
  waterType: "freshwater" | "saltwater";
};

export type FishingHotspots = Record<string, FishingHotspot>;
