import { Delay } from "@helpers";

export const getFishingSpot = async (
  playerPed: number,
  factor = 10
): Promise<number[] | null> => {
  FreezeEntityPosition(playerPed, true);
  const initialCoords = GetEntityCoords(playerPed, false);
  const forwar = GetEntityForwardVector(playerPed);
  let hit = false;
  let place: number[];

  const coords = addVectorFactor(factor, initialCoords, forwar);

  const finalFactor = factor + 50;

  return new Promise((resolve) => {
    setImmediate(async () => {
      while (factor < finalFactor && !hit) {
        await Delay(1);
        factor += 0.05;
        const f2 = addVectorFactor(factor, coords, forwar);
        const tz = f2[2] - factor;
        const [a1, a2] = TestProbeAgainstWater(
          coords[0],
          coords[1],
          coords[2],
          f2[0],
          f2[1],
          tz
        );
        hit = a1;
        place = a2;
      }

      FreezeEntityPosition(playerPed, false);

      if (hit && place) {
        return resolve(place);
      }

      return resolve(null);
    });
  });
};

const addVectorFactor = (factor: number, vec1: number[], vec2: number[]) => {
  return [
    vec1[0] + vec2[0] * factor,
    vec1[1] + vec2[1] * factor,
    vec1[2] + vec2[2] * factor,
  ];
};
