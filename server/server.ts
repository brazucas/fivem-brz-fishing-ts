import { emitNetTyped, onNetTyped } from "@brz-fivem-sdk/server/helpers/cfx";
import { addItem, getItem, removeItem } from "@brz-fivem-sdk/server/inventory";
import { notify } from "@brz-fivem-sdk/server/notification";
import {
  Fish,
  InternalClientEvents,
  InternalServerEvents,
  PlayerId,
} from "@common/types";
import { fishes } from "@config/config";
import { t } from "@config/locales";

const playerAssignedFishes: Record<number, keyof Fish> = {};

export const getPlayerAssignedFish = (playerId: PlayerId) =>
  playerAssignedFishes[playerId];

export const processCatchFishEvent = (playerId: PlayerId) => {
  const assignedFishId = playerAssignedFishes[playerId];

  if (!assignedFishId) {
    notify(
      playerId,
      t("no_fish_assigned", {
        PLAYER_ID: playerId.toString(),
      }),
      "error"
    );
    return;
  }

  const fish = fishes[assignedFishId];

  const itemInfo = getItem(fish.itemName);

  if (!itemInfo) {
    console.error(
      `ERROR: Item ${fish.itemName} does not exist. Please be sure you added all fishing items to your inventory system.`
    );
    return;
  }

  addItem(playerId, fish.itemName);
  notify(
    playerId,
    t("catching_success", {
      ITEM_LABEL: itemInfo.label,
    }),
    "success"
  );
};

export const processUseBaitEvent = (playerId: PlayerId) => {
  if (!removeItem(playerId, "commonbait")) {
    notify(playerId, t("has_bait_error"), "error");
  }
};

export const processRequestStartFishing = (playerId: PlayerId) => {
  const randomNumber = Math.round(
    Math.random() * (Object.values(fishes).length - 1)
  );

  const randomFish = Object.keys(fishes)[randomNumber] as keyof Fish;

  playerAssignedFishes[playerId] = randomFish;

  emitNetTyped<InternalServerEvents, "brz-fishing:startFishing">(
    "brz-fishing:startFishing",
    playerId,
    randomFish
  );
};

export const onResourceStart = (resName: string) => {
  if (resName === GetCurrentResourceName()) {
    console.log(t("initialise_script"));
  }
};

on("onResourceStart", onResourceStart);

onNetTyped<InternalClientEvents, "brz-fishing:requestStartFishing">(
  "brz-fishing:requestStartFishing",
  processRequestStartFishing
);

onNetTyped<InternalClientEvents, "brz-fishing:useBait">(
  "brz-fishing:useBait",
  processUseBaitEvent
);

onNetTyped<InternalClientEvents, "brz-fishing:catchFish">(
  "brz-fishing:catchFish",
  processCatchFishEvent
);
