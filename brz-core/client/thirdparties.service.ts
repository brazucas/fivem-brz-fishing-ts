const adapters: {
  [key in string]: {
    isEnabled: boolean;
    hasItem: (itemName: string) => boolean;
    notify: (message: string, type: "success" | "error") => void;
  };
} = {
  qbCore: {
    isEnabled: !!exports["qb-core"]?.GetCoreObject()?.Functions?.HasItem,
    hasItem: (itemName: string) =>
      !!exports["qb-core"].GetCoreObject().Functions.HasItem(itemName),
    notify: (message: string, type: "success" | "error") => {
      exports["qb-core"].GetCoreObject().Functions.Notify(message, type);
    },
  },
};

export const hasItem = (itemName: string) => getAdapter().hasItem(itemName);

export const notify = (message: string, type: "success" | "error") =>
  getAdapter().notify(message, type);

const getAdapter = () => {
  const enabledAdapterName = Object.keys(adapters).find(
    (adapterName) => adapters[adapterName].isEnabled
  );

  if (!enabledAdapterName) throw new Error("No enabled adapter found");

  return adapters[enabledAdapterName];
};
