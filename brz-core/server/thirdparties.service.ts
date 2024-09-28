import { Adapter } from "../types/thirdparties.types";

declare const SETTINGS: any;

const qbCoreGetPlayer = () =>
  SETTINGS.INVENTORY_SYSTEM === "qb-core" &&
  exports["qb-core"]?.GetCoreObject?.()?.Functions?.GetPlayer;

const adapters: {
  [key in string]: Adapter;
} = {
  qbCore: {
    removeItem: (source: number, itemName: string) => {
      const player = qbCoreGetPlayer()(source);

      if (!player) {
        console.error("Player not found ", source, itemName);
        return false;
      }

      player.Functions.RemoveItem(itemName, 1);
      return true;
    },
    addItem: (source: number, itemName: string) => {
      const player = qbCoreGetPlayer()(source);

      if (!player) {
        console.error("Player not found ", source, itemName);
        return false;
      }

      player.Functions.AddItem(itemName, 1);
      return true;
    },
    getItem: (itemName: string) => {
      const item =
        exports["qb-core"]?.GetCoreObject?.()?.Shared?.Items?.[itemName];

      return item;
    },
    notify: (source: number, message: string, type: "success" | "error") => {
      const player = qbCoreGetPlayer()(source);

      if (!player) {
        console.error("Player not found");
        return false;
      }

      TriggerClientEvent(
        "QBCore:Notify",
        player.PlayerData.source,
        message,
        type
      );
      return true;
    },
  },
  ox_inventory: {
    removeItem: (source: number, itemName: string) => {
      exports["ox_inventory"].RemoveItem(source, itemName, 1);
      return true;
    },
    addItem: (source: number, itemName: string) => {
      exports["ox_inventory"].AddItem(source, itemName, 1);
      return true;
    },
    getItem: (itemName: string) => {
      const item = exports["ox_inventory"].Items(itemName);

      if (!item) return null;

      const { name, weight, label, stack, consume, client = null } = item;

      return {
        weight,
        unique: false,
        name,
        type: "item",
        description: name,
        label,
        combinable: stack,
        useable: consume,
        shouldClose: false,
        image: client?.image,
      };
    },
    notify: (source: number, message: string, type: "success" | "error") =>
      TriggerClientEvent("ox_lib:notify", source, {
        title: "Fishing",
        description: message,
        type,
      }),
  },
};

export const addItem = (source: number, itemName: string) =>
  getAdapter().addItem(source, itemName);

export const removeItem = (source: number, itemName: string) =>
  getAdapter().removeItem(source, itemName);

export const getItem = (itemName: string) => getAdapter().getItem(itemName);

export const notify = (
  source: number,
  message: string,
  type: "success" | "error"
) => getAdapter().notify(source, message, type);

const getAdapter = () => {
  const enabledAdapterName = SETTINGS.INVENTORY_SYSTEM || "ox_inventory";

  if (!adapters[enabledAdapterName])
    throw new Error(
      `FATAL: ${enabledAdapterName} is not supported, please check the documentation for supported inventory systems`
    );

  return adapters[enabledAdapterName];
};
