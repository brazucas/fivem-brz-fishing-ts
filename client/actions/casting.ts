import { performCastingAnimations } from "@/animations";
import { useBait } from "@/fishing";
import { getFishingSpot } from "@/helpers/fishing.helper";
import { setFishingParam, setState } from "@/state";
import { t } from "@config/locales";
import { notify } from "@core/notification";
import { Delay } from "@helpers";

const castingIndicatorTickTimerInterval = 10;

let castingIndicatorTickTimer: NodeJS.Timeout | undefined;
let castingTimeout: NodeJS.Timeout | undefined;

let currentIndicatorPercentage = 0;
let indicatorDirection = 1;

let lockIndicatorTick: number | undefined;

export const startCasting = () => {
  castingIndicatorTickTimer = setInterval(
    indicatorPercentageTick,
    castingIndicatorTickTimerInterval
  );

  castingTimeout = setTimeout(() => {
    notify(t("rod_cast_took_too_long"), "error");
    setState("not-fishing");
  }, 5000);

  lockIndicatorTick = setTick(async () => {
    // https://docs.fivem.net/docs/game-references/controls/#controls
    if (IsControlJustPressed(0, 46)) {
      await castRodLine();
    }
  });
};

export const stopCasting = () => {
  if (castingIndicatorTickTimer) {
    clearInterval(castingIndicatorTickTimer);
  }

  if (lockIndicatorTick) {
    clearTick(lockIndicatorTick);
  }
};

const castRodLine = async () => {
  clearTimeout(castingTimeout);
  const fishingSpot = await getFishingSpot(PlayerPedId());

  if (!fishingSpot) {
    notify(t("fishing_spot_not_found"), "error");
    return;
  }

  const fishDistance = GetDistanceBetweenCoords(
    fishingSpot[0],
    fishingSpot[1],
    fishingSpot[2],
    GetEntityCoords(PlayerPedId(), true)[0],
    GetEntityCoords(PlayerPedId(), true)[1],
    GetEntityCoords(PlayerPedId(), true)[2],
    true
  );

  useBait();
  stopCasting();
  await performCastingAnimations();

  setFishingParam<"rodCastPercentage">(
    "rodCastPercentage",
    currentIndicatorPercentage
  );
  setFishingParam<"fishDistance">("fishDistance", fishDistance);
  setFishingParam<"initialFishDistance">("initialFishDistance", fishDistance);

  await Delay(2000);

  setState("baiting");
};

const indicatorPercentageTick = () => {
  currentIndicatorPercentage += indicatorDirection;

  if (currentIndicatorPercentage >= 100) {
    indicatorDirection = -1;
  }

  if (currentIndicatorPercentage <= 0) {
    indicatorDirection = 1;
  }

  setFishingParam<"rodCastPercentage">(
    "rodCastPercentage",
    currentIndicatorPercentage
  );
};
