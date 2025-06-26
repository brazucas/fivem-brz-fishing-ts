import { FishingHotspot, FishingHotspots } from "@/types/hotspots";
import { createPed } from "@brz-fivem-sdk/client/helpers/streaming";
import { notify } from "@brz-fivem-sdk/client/notification";
import { createCircleZone } from "@brz-fivem-sdk/client/polyzones";
import { createBlip } from "@brz-fivem-sdk/client/services/blips";
import { t } from "@config/locales";

declare let SETTINGS: any;

const BLIP_DEFAULT_SPRITE = 68;
const BLIP_DEFAULT_COLOR = 2;
const BLIP_DEFAULT_SCALE = 0.7;
const BLIP_DEFAULT_DISPLAY = 4;
const BLIP_DEFAULT_SHORT_RANGE = true;

const NUMBER_OF_SPLAHES = 4;
const NUMBER_OF_FISHES = 15;

const FISH_SPAWN_REFRESH_TIME_IN_SECONDS = 30;

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

const createFishingHotspotZone = (
  id: string,
  hotspot: FishingHotspot
): void => {
  const zone = createCircleZone({
    coords: hotspot.coords,
    id,
    radius: hotspot.radius,
    minZ: hotspot.coords.z - 3,
    maxZ: hotspot.coords.z + 2,
    onPlayerInOut: (inside: boolean) => {
      if (inside) {
        notify("Entered fishing hotspot area", "success");
      } else {
        notify("Exited fishing hotspot area", "success");
      }
    },
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

const cycleActiveHotspotAnimation = (hotspot: FishingHotspot) => {
  if (isPlayerNearHotspot(GetEntityCoords(PlayerPedId(), true), hotspot)) {
    for (let i = 0; i < NUMBER_OF_FISHES; i++) {
      spawnFishPed([hotspot.coords.x, hotspot.coords.y, hotspot.coords.z]);
    }
  }

  setTimeout(() => {
    cycleActiveHotspotAnimation(hotspot);
  }, FISH_SPAWN_REFRESH_TIME_IN_SECONDS * 1000);
};

const spawnFishPed = async (coords: number[]) => {
  const randomSpot = randomSpotInsideCircleFromCoord(50, coords);

  const peds = [802685111, -1950698411, 1015224100, 113504370, "a_c_stingray"];

  const randomPedIndex = Math.floor(Math.random() * peds.length);

  const ped = await createPed(
    0,
    peds[randomPedIndex],
    randomSpot[0],
    randomSpot[1],
    coords[2] + 5,
    0,
    true,
    true
  );

  SetPedDiesWhenInjured(ped, false);
  SetEntityInvincible(ped, true);
  SetEntityVisible(ped, false, false);
  SetEntityCollision(ped, false, false);

  setTimeout(() => {
    DeletePed(ped);
  }, FISH_SPAWN_REFRESH_TIME_IN_SECONDS * 1000);
};

const randomSpotInsideCircleFromCoord = (
  radius: number,
  coords: number[]
): number[] => {
  const angle = Math.random() * 2 * Math.PI;
  const r = Math.sqrt(Math.random()) * radius;
  const x = coords[0] + r * Math.cos(angle);
  const y = coords[1] + r * Math.sin(angle);
  return [x, y];
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
    createFishingHotspotZone(id, hotspot);
    cycleWaterSplashEffects(hotspot);
    cycleActiveHotspotAnimation(hotspot);
  }
}
