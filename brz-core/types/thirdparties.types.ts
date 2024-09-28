export type Adapter = {
  removeItem: (source: number, itemName: string) => boolean;
  addItem: (source: number, itemName: string) => boolean;
  getItem: (itemName: string) => InventoryItem | null;
  notify: (source: number, message: string, type: "success" | "error") => void;
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
