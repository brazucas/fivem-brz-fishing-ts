import { startBaiting, stopBaiting } from "@/actions/baiting";
import { startCasting, stopCasting } from "@/actions/casting";
import { startReeling, stopReeling } from "@/actions/reeling";
import { stopFishing } from "@/fishing";
import {
  getFishingParam,
  getState,
  resetFishingParams,
  setFishingParam,
  setState,
} from "@/state";
import { FishingState } from "@common/types";

global.SendNUIMessage = jest.fn();

jest.mock("./actions/baiting", () => ({
  startBaiting: jest.fn(),
  stopBaiting: jest.fn(),
}));

jest.mock("./actions/casting", () => ({
  startCasting: jest.fn(),
  stopCasting: jest.fn(),
}));

jest.mock("./actions/reeling", () => ({
  startReeling: jest.fn(),
  stopReeling: jest.fn(),
}));

jest.mock("./fishing", () => ({
  stopFishing: jest.fn(),
}));

describe("state", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("resetFishingParams", () => {
    it("should reset the fishing parameters to their default values", () => {
      setFishingParam("fishId", "fish");
      setFishingParam("rodCastPercentage", 50);
      setFishingParam("lineTension", 50);
      setFishingParam("fishDistance", 50);
      setFishingParam("initialFishDistance", 50);
      setFishingParam("baseLineTension", 50);
      setFishingParam("baitingTime", 50);
      setFishingParam("catchOpportunityWindow", 50);

      resetFishingParams();

      expect(getFishingParam("fishId")).not.toEqual("fish");
      expect(getFishingParam("rodCastPercentage")).not.toEqual(50);
      expect(getFishingParam("lineTension")).not.toEqual(50);
      expect(getFishingParam("fishDistance")).not.toEqual(50);
      expect(getFishingParam("initialFishDistance")).not.toEqual(50);
      expect(getFishingParam("baseLineTension")).not.toEqual(50);
      expect(getFishingParam("baitingTime")).not.toEqual(50);
      expect(getFishingParam("catchOpportunityWindow")).not.toEqual(50);
    });
  });

  describe("setState", () => {
    describe.each([
      {
        state: "casting",
        events: {
          onEnter: startCasting as jest.Mock,
          onLeave: stopCasting as jest.Mock,
        },
      },
      {
        state: "baiting",
        events: {
          onEnter: startBaiting as jest.Mock,
          onLeave: stopBaiting as jest.Mock,
        },
      },
      {
        state: "reeling",
        events: {
          onEnter: startReeling as jest.Mock,
          onLeave: stopReeling as jest.Mock,
        },
      },
      {
        state: "not-fishing",
        events: {
          onEnter: stopFishing as jest.Mock,
        },
      },
    ])("hooks for $state", ({ state, events }) => {
      it("should call the onLeave hook when switching state from $state", () => {
        setState(state as FishingState);
        setState("not-fishing");

        if (events.onLeave) {
          expect(events.onLeave).toHaveBeenCalledTimes(1);
        }
      });

      it("should call the onEnter hook when switching to $state", () => {
        setState(state as FishingState);

        expect(events.onEnter).toHaveBeenCalledTimes(1);
      });
    });

    it("should send the new state to the NUI", () => {
      setState("casting");

      expect(SendNUIMessage).toHaveBeenCalledTimes(1);
      expect(SendNUIMessage).toHaveBeenCalledWith({
        action: "set-state",
        state: "casting",
      });
    });
  });

  describe("getState", () => {
    it("should get the current state", () => {
      setState("not-fishing");
      expect(getState()).toEqual("not-fishing");

      setState("casting");
      expect(getState()).toEqual("casting");

      setState("reeling");
      expect(getState()).toEqual("reeling");
    });
  });
});
