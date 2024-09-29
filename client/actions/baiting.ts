import { getFishingParam, setFishingParam, setState } from "@/state";
import { EmitFishingAction } from "@common/types";
import { t } from "@config/locales";
import { notify } from "@core/notification";

let baitingTickInterval: NodeJS.Timeout | undefined;
let baitingOpportunityTickInterval: NodeJS.Timeout | undefined;
let detectBaitCatchTick: number | undefined;
let detectFishPullTick: number | undefined;

export const startBaiting = () => {
  baitingTickInterval = setInterval(baitingTick, 20);

  detectFishPullTick = setTick(async () => {
    if (IsControlJustPressed(0, 46)) {
      notify(t("fish_pull_too_soon"), "error");
      setState("not-fishing");
    }
  });
};

export const stopBaiting = () => {
  stopBaitCatchTick();

  clearDetectFishPullTick();

  clearInterval(baitingTickInterval);
  clearInterval(baitingOpportunityTickInterval);
};

const clearDetectFishPullTick = () => {
  if (detectFishPullTick) {
    clearTick(detectFishPullTick);
  }
};

const baitingTick = async () => {
  const baitingTime = getFishingParam<"baitingTime">("baitingTime");
  setFishingParam<"baitingTime">("baitingTime", baitingTime + 1);

  if (baitingTime >= 100) {
    clearInterval(baitingTickInterval);
    notify(t("fish_bite_bait"), "success");
    startBaitingOpportunity();
  }
};

const startBaitingOpportunity = () => {
  clearDetectFishPullTick();

  SendNUIMessage({
    action: "show-baiting-tooltips",
  } as EmitFishingAction);

  baitingOpportunityTickInterval = setInterval(baitingOpportunityTick, 10);

  detectBaitCatchTick = setTick(async () => {
    if (IsControlJustPressed(0, 46)) {
      SendNUIMessage({
        action: "hide-baiting-tooltips",
      } as EmitFishingAction);

      clearInterval(baitingOpportunityTickInterval);
      stopBaitCatchTick();
      notify(t("fish_pull_hint"), "success");
      setState("reeling");
      return;
    }
  });
};

const baitingOpportunityTick = async () => {
  const catchOpportunityWindow = getFishingParam("catchOpportunityWindow");
  setFishingParam<"catchOpportunityWindow">(
    "catchOpportunityWindow",
    catchOpportunityWindow + 1
  );

  if (catchOpportunityWindow >= 100) {
    clearInterval(baitingOpportunityTickInterval);
    setState("not-fishing");
    notify(t("fish_ran_away"), "error");
  }
};

const stopBaitCatchTick = () => {
  if (detectBaitCatchTick) {
    clearTick(detectBaitCatchTick);
  }
};
