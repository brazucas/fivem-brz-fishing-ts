declare const SETTINGS: any;

const qbCoreGetPlayer = (source: number) => {
  const getPlayer =
    SETTINGS.INVENTORY_SYSTEM === "qbCore" &&
    exports["qb-core"]?.GetCoreObject?.()?.Functions?.GetPlayer;

  const player = getPlayer(source);

  if (!player) {
    console.error("Player not found ", source);
    return false;
  }

  return player;
};

export const oxInventoryAdapter = {
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
};

export const qbCoreAdapter = {
  removeItem: (source: number, itemName: string) => {
    const player = qbCoreGetPlayer(source);

    if (!player) {
      return false;
    }

    player.Functions.RemoveItem(itemName, 1);
    return true;
  },
  addItem: (source: number, itemName: string) => {
    const player = qbCoreGetPlayer(source);

    if (!player) {
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
    const player = qbCoreGetPlayer(source);

    if (!player) {
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
};
