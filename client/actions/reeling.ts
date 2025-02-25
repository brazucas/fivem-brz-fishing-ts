import { catchFish } from "@/fishing";
import { getFishingParam, setFishingParam, setState } from "@/state";
import { EmitFish2DPositionAction, EmitFishingAction } from "@common/types";
import { notify } from "@core/notification";
import { t } from "@config/locales";
import { getFishPed, getFishRope } from "@/animations";
import { fishingLimits } from "@config/config";

let detectFishPullTick: number | undefined;
let reelingReleaseTick: NodeJS.Timeout | undefined;
let ropeCheckInterval: NodeJS.Timeout | undefined;
let shouldWindRope = true;

let lastPullTime: Date | undefined;
let isWinding = false;

declare const SETTINGS: any;

export const startReeling = () => {
  pullFish(2);

  detectFishPullTick = setTick(async () => {
    // https://docs.fivem.net/docs/game-references/controls/#controls
    if (IsControlJustPressed(0, 46)) {
      SendNUIMessage({
        action: "reeling-key-pressed",
      } as EmitFishingAction);
      lastPullTime = new Date();
      pullFish(2);
      return;
    }
  });

  reelingReleaseTick = setInterval(() => {
    releaseLineTension();
    releaseFishTick();
  }, 20);

  ropeCheckInterval = setInterval(() => {
    const rope = getFishRope();
    const fishPed = getFishPed();

    if (!rope || !fishPed) {
      return;
    }

    const shouldStopWinding =
      lastPullTime && new Date().getTime() - lastPullTime.getTime() > 1000;

    const isFishInWater = IsEntityInWater(fishPed);

    if (!isFishInWater) {
      shouldWindRope = false;
    }

    if (shouldStopWinding || !isFishInWater || !shouldWindRope) {
      isWinding = false;
      StopRopeWinding(rope[0]);
      StartRopeUnwindingFront(rope[0]);
    } else if (!isWinding) {
      isWinding = true;
      StopRopeUnwindingFront(rope[0]);
      StartRopeWinding(rope[0]);
    }

    if (shouldWindRope) {
      RopeForceLength(rope[0], getFishingParam("fishDistance"));
    }
  }, 300);
};

export const stopReeling = () => {
  if (detectFishPullTick) {
    clearTick(detectFishPullTick);
  }

  if (reelingReleaseTick) {
    clearInterval(reelingReleaseTick);
  }

  if (ropeCheckInterval) {
    clearInterval(ropeCheckInterval);
  }

  shouldWindRope = true;
};

const pullFish = (units: number) => {
  const tension = 80 / fishingLimits.lineTensionIncreaseRate;

  const lineTension =
    getFishingParam("baseLineTension") +
    getFishingParam("lineTension") +
    tension;

  setLineTension(lineTension);
  dragFish(units);
};

const dragFish = (unitsMoved: number) => {
  const newFishDistance = Math.max(
    0,
    getFishingParam("fishDistance") - unitsMoved
  );
  setFishDistance(newFishDistance);
};

const setFishDistance = (distance: number) => {
  setFishingParam<"fishDistance">("fishDistance", distance);

  const fishPed = getFishPed();

  if (fishPed) {
    const fishCoords = GetEntityCoords(fishPed, false);

    const screenPosition = GetScreenCoordFromWorldCoord(
      fishCoords[0],
      fishCoords[1],
      fishCoords[2]
    );

    const dynamicMinigamePosition = SETTINGS.DYNAMIC_MINIGAME_POSITION ?? true;

    const isCenter = !dynamicMinigamePosition || !screenPosition[0];

    if (isCenter) {
      SendNUIMessage({
        action: "fish-2d-position",
        center: true,
      } as EmitFish2DPositionAction);

      return;
    }

    const screenResolution = GetActiveScreenResolution();

    const posX = screenResolution[0] * screenPosition[1];
    const posY = screenResolution[1] * screenPosition[2];

    SendNUIMessage({
      action: "fish-2d-position",
      center: false,
      posX,
      posY,
    } as EmitFish2DPositionAction);
  }

  if (distance <= 0) {
    catchFish();
    setState("not-fishing");
  }
};

const setLineTension = (tension: number) => {
  const newTension = Math.min(fishingLimits.maximumLineTension, tension);
  setFishingParam<"lineTension">("lineTension", newTension);

  if (newTension >= 80) {
    ShakeGameplayCam("LARGE_EXPLOSION_SHAKE", 0.05);
  }

  if (newTension >= fishingLimits.maximumLineTension) {
    notify(t("pull_too_hard"), "error");
    setState("not-fishing");
  }
};

const releaseFishTick = () => {
  if (
    getFishingParam("fishDistance") <= 0 ||
    getFishingParam("lineTension") >= fishingLimits.maximumLineTension ||
    getFishingParam("fishDistance") === getFishingParam("initialFishDistance")
  ) {
    return false;
  }

  const newFishDistance = Math.min(
    getFishingParam("initialFishDistance"),
    getFishingParam("fishDistance") + 0.05
  );

  setFishDistance(newFishDistance);

  if (newFishDistance === getFishingParam("initialFishDistance")) {
    notify(t("fish_ran_away"), "error");
    setState("not-fishing");
  }
};

const releaseLineTension = () => {
  if (
    getFishingParam("lineTension") > 0 &&
    getFishingParam("fishDistance") > 0
  ) {
    const newTension = Math.max(
      0,
      getFishingParam("lineTension") - fishingLimits.tensionRecoverRate
    );

    setLineTension(newTension);
  }
};
