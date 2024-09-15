import { Fish } from "@common/types";
import { requestStartFishing, startFishing } from "./fishing";
import { getState, setState } from "./state";
import { t } from "@config/locales";

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

onNet("inventory:client:ItemBox", (itemData: any, type: "use" | string) => {
  if (type === "use" && itemData.name === "fishingrod1") {
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
