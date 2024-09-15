export type UnableToFishReason = [string];
type Opaque<T, K> = T & { __opaque__: K };

export type FishingAction =
  | "start-fishing"
  | "stop-fishing"
  | "set-state"
  | "set-param"
  | "show-baiting-tooltips"
  | "hide-baiting-tooltips"
  | "reeling-key-pressed"
  | "fish-2d-position";

export type FishingState = "not-fishing" | "casting" | "baiting" | "reeling";

export type FishingParam = {
  fishId: keyof Fish | null;
  rodCastPercentage: number;
  lineTension: number;
  fishDistance: number;
  initialFishDistance: number;
  baseLineTension: number;
  baitingTime: number;
  catchOpportunityWindow: number;
};

type FishData = { itemName: string; type: FishTypes; hash: number | string };

export type Fish = {
  fish: FishData;
  dolphin: FishData;
  hammerShark: FishData;
  tigerShark: FishData;
  killerWhale: FishData;
  humpBack: FishData;
  stingray: FishData;
};

export type FishTypes = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type EmitFishingAction = {
  action: FishingAction;
};

export interface EmitFishingSetParamAction extends EmitFishingAction {
  action: "set-param";
  param: keyof FishingParam;
  value: number;
}

export interface EmitFishingStateAction extends EmitFishingAction {
  action: "set-state";
  state: FishingState;
}

export interface EmitFish2DPositionAction extends EmitFishingAction {
  action: "fish-2d-position";
  center: boolean;
  posX?: number;
  posY?: number;
}

export type PlayerId = Opaque<number, "PlayerId"> | number;
export type FishId = keyof Fish;

export type InternalClientEvents = {
  "brz-fishing:requestStartFishing": [PlayerId];
  "brz-fishing:useBait": [PlayerId];
  "brz-fishing:catchFish": [PlayerId];
};

export type InternalServerEvents = {
  "brz-fishing:startFishing": [FishId];
};
