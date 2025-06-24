import { FishingHotspot, FishingHotspots } from "@/types/hotspots";
import { createBlip } from "@brz-fivem-sdk/client/services/blips";
import { t } from "@config/locales";

declare let SETTINGS: any;

const BLIP_DEFAULT_SPRITE = 68;
const BLIP_DEFAULT_COLOR = 2;
const BLIP_DEFAULT_SCALE = 0.7;
const BLIP_DEFAULT_DISPLAY = 4;
const BLIP_DEFAULT_SHORT_RANGE = true;

const NUMBER_OF_SPLAHES = 4;

const createBlipsFromSettings = (
  id: string,
  hotspot: FishingHotspot,
  blipSettings: any = {}
) => {
  const blipLabel = t("fishing_hotspot_blip_label");

  createBlip({
    id,
    radius: hotspot.radius || 50.0,
    label: blipLabel,
    coords: [hotspot.coords.x, hotspot.coords.y, hotspot.coords.z],
    sprite: blipSettings.sprite || BLIP_DEFAULT_SPRITE,
    scale: blipSettings.scale || BLIP_DEFAULT_SCALE,
    display: blipSettings.display || BLIP_DEFAULT_DISPLAY,
    color: blipSettings.color || BLIP_DEFAULT_COLOR,
    shortRange: blipSettings.shortRange || BLIP_DEFAULT_SHORT_RANGE,
  });
};

const cycleWaterSplashEffects = (hotspot: FishingHotspot) => {
  if (isPlayerNearHotspot(GetEntityCoords(PlayerPedId(), true), hotspot)) {
    for (let i = 0; i < NUMBER_OF_SPLAHES; i++) {
      modifyWaterWithCoordsFuzziness([hotspot.coords.x, hotspot.coords.y]);
    }
  }

  const timerWithFuzziness = 300 + Math.random() * 100;

  setTimeout(() => {
    cycleWaterSplashEffects(hotspot);
  }, timerWithFuzziness);
};

const modifyWaterWithCoordsFuzziness = (coords: number[]) => {
  const fuzziness = Math.random() * 5 + 0.05;
  const heightWithFuzziness = 1.0;

  ModifyWater(
    coords[0] + fuzziness,
    coords[1] + fuzziness,
    heightWithFuzziness,
    20.0
  );
};

const isPlayerNearHotspot = (
  coords: number[],
  hotspot: FishingHotspot
): boolean => {
  const playerFieldOfView = GetGameplayCamFov();
  const distance = GetDistanceBetweenCoords(
    coords[0],
    coords[1],
    coords[2],
    hotspot.coords.x,
    hotspot.coords.y,
    hotspot.coords.z,
    true
  );
  return distance <= hotspot.radius + playerFieldOfView * 2;
};

const validateSettings = (settings?: FishingHotspots | undefined): boolean => {
  if (!settings || typeof settings !== "object" || Array.isArray(settings)) {
    console.error(
      "Invalid hotspots settings provided. Check your configuration against the documentation."
    );
    return false;
  }

  const numberOfHotspots = Object.keys(settings).length;

  if (numberOfHotspots === 0) {
    console.warn("No fishing hotspots found in the settings.");
    return false;
  }

  return true;
};

if (validateSettings(SETTINGS.hotspots)) {
  for (const [id, hotspot] of Object.entries(
    SETTINGS.hotspots as FishingHotspots
  )) {
    createBlipsFromSettings(id, hotspot, SETTINGS.blipSettings);
    cycleWaterSplashEffects(hotspot);
  }
}
