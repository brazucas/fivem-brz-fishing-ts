export type InventoryClientAdapter = {
  hasItem: (itemName: string) => boolean;
  useItemHookName: string;
  useItemHookHandler: (...params: any) => {
    itemName: string;
    itemType: string;
  };
};

export type InventoryServerAdapter = {
  removeItem: (source: number, itemName: string) => boolean;
  addItem: (source: number, itemName: string) => boolean;
  getItem: (itemName: string) => InventoryItem | null;
};

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
