import { FishingHotspots } from "@/types/hotspots";
import { createBlip } from "@brz-fivem-sdk/client/services/blips";
import { t } from "@config/locales";

declare let SETTINGS: any;

const BLIP_DEFAULT_SPRITE = 68;
const BLIP_DEFAULT_COLOR = 2;
const BLIP_DEFAULT_SCALE = 0.7;
const BLIP_DEFAULT_DISPLAY = 4;
const BLIP_DEFAULT_SHORT_RANGE = true;

const createBlipsFromSettings = (
  hotspots: FishingHotspots,
  blipSettings: any = {}
) => {
  validateSettings(blipSettings);
  const blipLabel = t("fishing_hotspot_blip_label");

  for (const [id, hotspot] of Object.entries(hotspots)) {
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
  }
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
  createBlipsFromSettings(SETTINGS.hotspots, SETTINGS.blipSettings);
}
