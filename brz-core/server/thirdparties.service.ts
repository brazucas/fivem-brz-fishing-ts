type InventoryItem = {
  weight: number;
  unique: boolean;
  name: string;
  type: string;
  description: string;
  label: string;
  combinable: boolean;
  useable: boolean;
  shouldClose: boolean;
  image: string;
};

const adapters: {
  [key in string]: {
    isEnabled: boolean;
    removeItem: (source: number, itemName: string) => boolean;
    addItem: (source: number, itemName: string) => boolean;
    getItem: (itemName: string) => InventoryItem;
    notify: (
      source: number,
      message: string,
      type: "success" | "error"
    ) => void;
  };
} = {
  qbCore: {
    isEnabled: !!exports["qb-core"]?.GetCoreObject()?.Functions?.RemoveItem,
    removeItem: (source: number, itemName: string) => {
      const player = qbCoreGetPlayer(source);

      if (!player) {
        console.error("Player not found ", source, itemName);
        return false;
      }

      player.Functions.RemoveItem(itemName, 1);
      return true;
    },
    addItem: (source: number, itemName: string) => {
      const player = qbCoreGetPlayer(source);

      if (!player) {
        console.error("Player not found ", source, itemName);
        return false;
      }

      player.Functions.AddItem(itemName, 1);
      return true;
    },
    getItem: (itemName: string) => {
      const item =
        exports["qb-core"]?.GetCoreObject()?.Shared?.Items?.[itemName];

      return item;
    },
    notify: (source: number, message: string, type: "success" | "error") => {
      const player = qbCoreGetPlayer(source);

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
};

const qbCoreGetPlayer =
  exports["qb-core"]?.GetCoreObject()?.Functions?.GetPlayer;

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
  const enabledAdapterName = Object.keys(adapters).find(
    (adapterName) => adapters[adapterName].isEnabled
  );

  if (!enabledAdapterName) throw new Error("No enabled adapter found");

  return adapters[enabledAdapterName];
};
