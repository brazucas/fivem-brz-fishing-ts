import {
  getUseItemHookHandler,
  getUseItemHookName,
} from "@brz-fivem-sdk/client/inventory";
import { Fish } from "@common/types";
import { t } from "@config/locales";
import { startFishing } from "./fishing";
import { startFishingState } from "./state";

import "./commands";
import "./bootstrap";

TriggerEvent(
  "chat:addSuggestion",
  "/" + t("fish_command"),
  t("fish_command_description"),
  []
);

onNet("brz-fishing:startFishing", (fishId: keyof Fish) =>
  startFishing(GetPlayerServerId(PlayerId()), fishId)
);

onNet(getUseItemHookName(), (...params: any) => {
  const { itemName, itemType } = getUseItemHookHandler()(params);

  if (itemType === "use" && itemName === "fishingrod1") {
    startFishingState();
  }
});
