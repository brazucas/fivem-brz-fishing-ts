import { Fish } from "@common/types";
import { requestStartFishing, startFishing } from "./fishing";
import { getState, setState } from "./state";
import { t } from "@config/locales";
import {
  getUseItemHookName,
  getUseItemHookHandler,
} from "@core/thirdparties.service";

RegisterCommand(
  t("fish_command"),
  (source: number, args: string[]) => {
    changeFishingState();
  },
  false
);

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
    changeFishingState();
  }
});

const changeFishingState = () => {
  if (getState() === "not-fishing") {
    requestStartFishing();
  } else {
    setState("not-fishing");
  }
};
