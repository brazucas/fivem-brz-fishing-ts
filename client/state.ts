import {
  FishingParam,
  EmitFishingSetParamAction,
  EmitFishingStateAction,
  FishingState,
} from "@common/types";
import { startReeling, stopReeling } from "./actions/reeling";
import { startCasting, stopCasting } from "./actions/casting";
import { startBaiting, stopBaiting } from "./actions/baiting";
import { stopFishing } from "./fishing";

let fishingState: FishingState = "not-fishing";

const fishingParameters: FishingParam = {
  fishId: null,
  rodCastPercentage: 0,
  lineTension: 0,
  fishDistance: 100,
  initialFishDistance: -1,
  baseLineTension: 0,
  baitingTime: 0,
  catchOpportunityWindow: 0,
};

const defaultValues: FishingParam = Object.assign({}, fishingParameters);

const stateHandlers: {
  [key in FishingState]: { onEnter: () => void; onLeave: () => void };
} = {
  casting: {
    onEnter: startCasting,
    onLeave: stopCasting,
  },
  baiting: {
    onEnter: startBaiting,
    onLeave: stopBaiting,
  },
  reeling: {
    onEnter: startReeling,
    onLeave: stopReeling,
  },
  "not-fishing": {
    onEnter: () => stopFishing(),
    onLeave: () => {},
  },
};

export const resetFishingParams = () => {
  for (const key in fishingParameters) {
    setFishingParam(
      key as keyof FishingParam,
      defaultValues[
        key as keyof FishingParam
      ] as FishingParam[keyof FishingParam]
    );
  }
};

export const setState = (state: FishingState) => {
  stateHandlers[fishingState].onLeave();

  fishingState = state;
  SendNUIMessage({ action: "set-state", state } as EmitFishingStateAction);

  stateHandlers[state].onEnter();
};

export const getState = () => fishingState;

export const setFishingParam = <T extends keyof FishingParam>(
  parameter: T,
  value: FishingParam[typeof parameter]
) => {
  fishingParameters[parameter] = value;
  SendNUIMessage({
    action: "set-param",
    param: parameter,
    value,
  } as EmitFishingSetParamAction);
};

export const getFishingParam = <T extends keyof FishingParam>(
  parameter: T
): FishingParam[T] => fishingParameters[parameter];
