import { notify } from "@brz-fivem-sdk/client/notification";
import { createBlip } from "@brz-fivem-sdk/client/services/blips";
import { t } from "@config/locales";
import { startFishingState } from "./state";

let fishingHotspots: {
  [key: string]: {
    blipId: number;
    radius: number;
  };
} = {};

const createFishingHotspotCommand = async (source: number, args: string[]) => {
  if (source !== 0) {
    notify("This command is not available", "error");
    return;
  }

  const radius = args[0] ? parseFloat(args[0]) : 100.0;

  if (isNaN(radius) || radius <= 0) {
    notify("Invalid radius provided", "error");
    return;
  }

  const hotspotId = args[1];

  if (!hotspotId) {
    notify("Please provide a name for the fishing hotspot", "error");
    return;
  }

  const playerCoords = GetEntityCoords(PlayerPedId(), true);

  const blip = createBlip({
    id: hotspotId,
    coords: [playerCoords[0], playerCoords[1], playerCoords[2]],
    radius: radius,
    label: "Fishing Hotspot",
    color: 2,
    sprite: 68,
    scale: 0.7,
    display: 4,
    shortRange: true,
  });

  fishingHotspots[hotspotId] = {
    blipId: blip.blipEntityId,
    radius: radius,
  };

  notify(
    `Fishing hotspot parameters printed in console, press F8 to copy them`,
    "success"
  );

  console.log({
    [hotspotId]: {
      coords: {
        x: playerCoords[0],
        y: playerCoords[1],
        z: playerCoords[2],
      },
      radius,
      fishes: ["fish", "dolphin", "hammerShark"],
      bait: ["commonbait"],
      waterType: "saltwater",
    },
  });
};

const removeFishingHotspotCommand = (source: number, args: string[]) => {
  if (source !== 0) {
    notify("This command is not available", "error");
    return;
  }

  if (args.length < 1) {
    notify("Please provide a fishing hotspot ID to remove", "error");
    return;
  }

  const hotspotId = args[0];

  const hotspot = fishingHotspots[hotspotId];

  if (!hotspot) {
    notify("No fishing hotspot to remove", "error");
    return;
  }

  if (!DoesBlipExist(hotspot.blipId)) {
    notify("No fishing hotspot found with the provided ID", "error");
    return;
  }

  RemoveBlip(hotspot.blipId);
  delete fishingHotspots[hotspotId];
  notify("Fishing hotspot removed", "success");
};

const isPlayerInsideFishingHotspotCommand = (
  source: number,
  args: string[]
) => {
  if (source !== 0) {
    notify("This command is not available", "error");
    return;
  }

  const hotspotName = args[0];

  if (!hotspotName) {
    notify("Please provide a fishing hotspot name", "error");
    return false;
  }

  if (!fishingHotspots[hotspotName]) {
    notify(`No fishing hotspot found with name ${hotspotName}`, "error");
    return false;
  }

  const hotspot = fishingHotspots[hotspotName];

  if (!DoesBlipExist(hotspot.blipId)) {
    notify("No fishing hotspot found with the provided ID", "error");
    return;
  }

  const inside = isPlayerInsideHotspot(hotspot.blipId, hotspot.radius);

  notify(
    `You are ${inside ? "" : "not "}inside the fishing hotspot area`,
    inside ? "success" : "error"
  );
};

const isPlayerInsideHotspot = (blipId: number, radius: number): boolean => {
  const playerCoords = GetEntityCoords(PlayerPedId(), true);
  const blipCoords = GetBlipInfoIdCoord(blipId);

  const distance = Vdist(
    playerCoords[0],
    playerCoords[1],
    playerCoords[2],
    blipCoords[0],
    blipCoords[1],
    blipCoords[2]
  );

  notify(
    `Distance to fishing hotspot: ${distance.toFixed(2)} | Radius: ${radius}`,
    "success"
  );

  return distance < radius;
};

RegisterCommand("createfishinghotspot", createFishingHotspotCommand, false);
RegisterCommand("removefishinghotspot", removeFishingHotspotCommand, false);
RegisterCommand(
  "isPlayerInsideFishingHotspot",
  isPlayerInsideFishingHotspotCommand,
  false
);

RegisterCommand(
  t("fish_command"),
  (source: number, args: string[]) => {
    startFishingState();
  },
  false
);
