declare const SETTINGS: any;

const adapters: {
  [key in string]: {
    hasItem: (itemName: string) => boolean;
    notify: (message: string, type: "success" | "error") => void;
    useItemHookName: string;
    useItemHookHandler: (...params: any) => {
      itemName: string;
      itemType: string;
    };
  };
} = {
  qbCore: {
    hasItem: (itemName: string) =>
      !!exports["qb-core"].GetCoreObject?.().Functions.HasItem(itemName),
    notify: (message: string, type: "success" | "error") => {
      exports["qb-core"].GetCoreObject?.().Functions.Notify(message, type);
    },
    useItemHookName: "inventory:client:ItemBox",
    useItemHookHandler: (itemData: any, type: "use" | string) => ({
      itemName: itemData.name,
      itemType: type,
    }),
  },
  ox_inventory: {
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
  },
};

export const hasItem = (itemName: string) => getAdapter().hasItem(itemName);

export const notify = (message: string, type: "success" | "error") =>
  getAdapter().notify(message, type);

export const getUseItemHookName = (): string => getAdapter().useItemHookName;

export const getUseItemHookHandler = () => getAdapter().useItemHookHandler;

const getAdapter = () => {
  const enabledAdapterName = SETTINGS.INVENTORY_SYSTEM || "ox_inventory";

  if (!adapters[enabledAdapterName])
    throw new Error(
      `FATAL: ${enabledAdapterName} is not supported, please check the documentation for supported inventory systems`
    );

  return adapters[enabledAdapterName];
};
