import {
  qbCoreAdapter as qbCoreClientAdapter,
  oxInventoryAdapter as oxInventoryClientAdapter,
} from "../client/adapters/inventory.adapter";
import { getAdapter } from "../shared/thirdparties";
import { InventoryClientAdapter } from "../shared/inventory";

declare const SETTINGS: any;

type AdapterName = "qbCore" | "ox_inventory";

const enabledAdapter: AdapterName = SETTINGS.INVENTORY_SYSTEM || "ox_inventory";

type InventoryAdapters = {
  [key in AdapterName]: InventoryClientAdapter;
};

const getClientAdapter = () =>
  getAdapter<InventoryAdapters, InventoryClientAdapter>(
    {
      qbCore: qbCoreClientAdapter,
      ox_inventory: oxInventoryClientAdapter,
    },
    enabledAdapter
  );

export const hasItem = (itemName: string) =>
  getClientAdapter().hasItem(itemName);

export const getUseItemHookName = (): string =>
  getClientAdapter().useItemHookName;

export const getUseItemHookHandler = () =>
  getClientAdapter().useItemHookHandler;
