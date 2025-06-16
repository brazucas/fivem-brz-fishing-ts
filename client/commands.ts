import { notify } from "@brz-fivem-sdk/client/notification";
import { createBlip } from "@brz-fivem-sdk/client/services/blips";
import { t } from "@config/locales";
import { startFishingState } from "./state";

let blips: {
  [key: string]: {
    blipId: number;
    radius: number;
  };
} = {};

const createBlipCommand = async (source: number, args: string[]) => {
  if (source !== 0) {
    notify("This command is not available", "error");
    return;
  }

  const radius = args[0] ? parseFloat(args[0]) : 100.0;

  if (isNaN(radius) || radius <= 0) {
    notify("Invalid radius provided", "error");
    return;
  }

  const blipId = args[1];

  if (!blipId) {
    notify("Please provide a name for the blip", "error");
    return;
  }

  const blipLabel = args[2];

  if (!blipLabel) {
    notify("Please provide a label for the blip", "error");
    return;
  }

  if (blipLabel.length > 50) {
    notify("Blip label cannot exceed 50 characters", "error");
    return;
  }

  const overrideBlip = args[3] === "1";

  if (!overrideBlip && blips[blipId]) {
    notify(
      `Blip with name ${blipId} already exists. Use 'override' to replace it.`,
      "error"
    );
    return;
  }

  const playerCoords = GetEntityCoords(PlayerPedId(), true);

  const blip = createBlip({
    id: blipId,
    coords: [playerCoords[0], playerCoords[1], playerCoords[2]],
    radius: radius,
    label: blipLabel,
    color: 2,
    sprite: 68,
    scale: 0.7,
    display: 4,
    shortRange: true,
  });

  blips[blipId] = {
    blipId: blip.blipEntityId,
    radius: radius,
  };

  notify(`Fishing area blip created, id: ${blip.blipEntityId}`, "success");
  console.log(
    `Blip created with ID: ${blip.blipEntityId}, Radius: ${radius}, Name: ${blipId}`
  );
  console.log(`Blip Label: ${blipLabel}, Override: ${overrideBlip}`);
  console.log(
    `Coords: ${playerCoords[0]}, ${playerCoords[1]}, ${playerCoords[2]}`
  );
};

const removeBlipCommand = (source: number, args: string[]) => {
  if (source !== 0) {
    notify("This command is not available", "error");
    return;
  }

  if (args.length < 1) {
    notify("Please provide a blip ID to remove", "error");
    return;
  }

  const blipId = parseInt(args[0]);

  const blip = blips[blipId];

  if (!blip) {
    notify("No blip to remove", "error");
    return;
  }

  if (!DoesBlipExist(blip.blipId)) {
    notify("No blip found with the provided ID", "error");
    return;
  }

  RemoveBlip(blip.blipId);
  notify("Fishing area blip removed", "success");
};

const isPlayerInsideBlipCommand = (source: number, args: string[]) => {
  if (source !== 0) {
    notify("This command is not available", "error");
    return;
  }

  if (source !== 0) {
    notify("This command is not available", "error");
    return false;
  }

  const blipName = args[0];

  if (!blipName) {
    notify("Please provide a blip name", "error");
    return false;
  }

  if (!blips[blipName]) {
    notify(`No blip found with name ${blipName}`, "error");
    return false;
  }

  const blip = blips[blipName];

  if (!DoesBlipExist(blip.blipId)) {
    notify("No blip found with the provided ID", "error");
    return;
  }

  const inside = isPlayerInsideBlip(blip.blipId, blip.radius);

  notify(
    `You are ${inside ? "" : "not "}inside the blip area`,
    inside ? "success" : "error"
  );
};

const isPlayerInsideBlip = (blipId: number, radius: number): boolean => {
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
    `Distance to blip: ${distance.toFixed(2)} | Radius: ${radius}`,
    "success"
  );

  return distance < radius;
};

RegisterCommand("createblip", createBlipCommand, false);
RegisterCommand("removeblip", removeBlipCommand, false);
RegisterCommand("isPlayerInsideBlip", isPlayerInsideBlipCommand, false);

RegisterCommand(
  t("fish_command"),
  (source: number, args: string[]) => {
    startFishingState();
  },
  false
);
