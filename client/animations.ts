import { Fish } from "@common/types";
import { createPed, playAnim } from "@brz-fivem-sdk/client/helpers/streaming";
import { fishes } from "@config/config";
import { Delay } from "@brz-fivem-sdk/common/helpers";
import { getFishingSpot } from "./helpers/fishing.helper";

let fishPed: number | null = null;
let fishRope: number[] | null = null;
let fishingSpot: number[] | null = null;

export const getFishPed = () => fishPed;

export const getFishRope = () => fishRope;

export const runCaughtFishAnimation = (fishKey: keyof Fish) => {
  return getFishingSpot(PlayerPedId(), 20).then(async (spot) => {
    if (!spot) {
      return;
    }

    const fishCaught = fishes[fishKey];

    const ped = await createPed(
      0,
      fishCaught.hash,
      spot[0],
      spot[1],
      spot[2] + 1,
      -GetEntityHeading(PlayerPedId()),
      true,
      true
    );

    SetPedDiesWhenInjured(ped, false);
    SetEntityInvincible(ped, true);

    const fishPos = GetEntityCoords(ped, false);

    ModifyWater(fishPos[0], fishPos[1], 50.0, 200.0);

    const playerPos = GetOffsetFromEntityInWorldCoords(
      PlayerPedId(),
      0,
      -10,
      8
    );

    const fishPosPlayerPosDiff = [
      playerPos[0] - fishPos[0],
      playerPos[1] - fishPos[1],
      playerPos[2] - fishPos[2],
    ];

    ApplyForceToEntity(
      ped,
      3,
      fishPosPlayerPosDiff[0],
      fishPosPlayerPosDiff[1],
      fishPosPlayerPosDiff[2],
      0,
      0,
      0,
      0,
      false,
      false,
      true,
      false,
      false
    );

    if (fishCaught.type === "legendary") {
      playAnim("anim@mp_player_intcelebrationfemale@freakout", "freakout");
    } else if (fishCaught.type !== "common") {
      playAnim("amb@world_human_cheering@female_a", "base");
    }

    setTimeout(() => {
      DeletePed(ped);
    }, 2000);
  });
};

export const stopFishingAnimation = () => {
  ClearPedTasks(PlayerPedId());
  deleteRod();
};

export const performCastingAnimations = async () => {
  await Delay(100);

  fishingSpot = (await getFishingSpot(PlayerPedId())) as number[];

  if (!fishingSpot) {
    return;
  }

  ModifyWater(fishingSpot[0], fishingSpot[1], 50.0, 200.0);

  const playerPosition = GetEntityCoords(PlayerPedId(), true);

  fishPed = await createPed(
    0,
    fishes.fish.hash,
    fishingSpot[0],
    fishingSpot[1],
    fishingSpot[2],
    -GetEntityHeading(PlayerPedId()),
    true,
    true
  );

  if (!fishPed) {
    return;
  }

  SetEntityVisible(fishPed, false, false);
  SetEntityInvincible(fishPed, true);
  SetEntityCollision(fishPed, false, false);

  const fishDistance = GetDistanceBetweenCoords(
    playerPosition[0],
    playerPosition[1],
    playerPosition[2],
    fishingSpot[0],
    fishingSpot[1],
    fishingSpot[2],
    true
  );

  RopeLoadTextures();

  fishRope = AddRope(
    playerPosition[0],
    playerPosition[1],
    playerPosition[2],
    0,
    0,
    0,
    fishDistance * 4,
    5,
    fishDistance,
    15,
    0.7,
    false,
    false,
    false,
    0,
    false,
    0
  );

  attachRodRopeToPed(fishPed);
};

const attachRodRopeToPed = (ped: number) => {
  if (!fishRope || !fishingSpot) {
    return;
  }

  const playerPosition = GetEntityCoords(PlayerPedId(), true);

  const rod = GetClosestObjectOfType(
    playerPosition[0],
    playerPosition[1],
    playerPosition[2],
    10.0,
    GetHashKey("prop_fishing_rod_01"),
    false,
    false,
    false
  );

  const ropeAttachPosition = GetOffsetFromEntityInWorldCoords(rod, 0, 0, 2.5);
  const fishPos = GetEntityCoords(ped, false);

  const fishDistance = GetDistanceBetweenCoords(
    playerPosition[0],
    playerPosition[1],
    playerPosition[2],
    fishingSpot[0],
    fishingSpot[1],
    fishingSpot[2],
    true
  );

  AttachEntitiesToRope(
    fishRope[0],
    rod,
    ped,
    ropeAttachPosition[0],
    ropeAttachPosition[1],
    ropeAttachPosition[2],
    fishPos[0],
    fishPos[1],
    fishPos[2],
    fishDistance,
    false,
    false,
    0 as unknown as string,
    0 as unknown as string
  );
};

export const stopCastingAnimations = () => {
  if (fishRope) {
    RopeUnloadTextures();
    DeleteRope(fishRope[0]);
  }

  if (fishPed) {
    DeletePed(fishPed);
  }
};

const deleteRod = () => {
  const coords = GetEntityCoords(PlayerPedId(), false);
  const rod = GetClosestObjectOfType(
    coords[0],
    coords[1],
    coords[2],
    10.0,
    GetHashKey("prop_fishing_rod_01"),
    false,
    false,
    false
  );

  if (rod) {
    SetEntityAsMissionEntity(rod, true, true);
    DeleteEntity(rod);
  }
};
