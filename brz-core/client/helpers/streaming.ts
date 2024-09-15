import { Delay } from "../../nodejs";

export const createPed: (
  ...args: Parameters<typeof CreatePed>
) => Promise<number> = async (...args: Parameters<typeof CreatePed>) => {
  await requestModel(args[1]);
  return CreatePed(...args);
};

const requestModel = async (hash: number | string) => {
  if (typeof hash === "string") {
    hash = GetHashKey(hash);
  }

  RequestModel(hash);

  while (!HasModelLoaded(hash)) {
    await Delay(10);
  }
};

export const playAnim = async (dict: string, name: string, duration = 1000) => {
  RequestAnimDict(dict);

  while (!HasAnimDictLoaded(dict)) {
    await Delay(100);
  }

  TaskPlayAnim(PlayerPedId(), dict, name, 1, 1, -1, 1, 0, false, false, false);

  setTimeout(() => {
    StopAnimTask(PlayerPedId(), dict, name, 1.0);
  }, duration);
};
