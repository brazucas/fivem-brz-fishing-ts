export const oxInventoryAdapter = {
  hasItem: (itemName: string) =>
    exports["ox_inventory"].GetItemCount(itemName) > 0,
  notify: (message: string, type: "success" | "error") =>
    TriggerEvent("ox_lib:notify", {
      title: "Fishing",
      description: message,
      type,
    }),
  useItemHookName: "ox_inventory:usedItem",
  useItemHookHandler: (item: string[], slotId: number, metadata: any) => ({
    itemName: item[0],
    itemType: "use",
  }),
};

export const qbCoreAdapter = {
  hasItem: (itemName: string) =>
    !!exports["qb-core"].GetCoreObject?.().Functions.HasItem(itemName),
  notify: (message: string, type: "success" | "error") => {
    exports["qb-core"].GetCoreObject?.().Functions.Notify(message, type);
  },
  useItemHookName: "inventory:client:ItemBox",
  useItemHookHandler: (params: [any, "use" | string]) => {
    const [itemData, type] = params;

    return {
      itemName: itemData.name,
      itemType: type,
    };
  },
};
