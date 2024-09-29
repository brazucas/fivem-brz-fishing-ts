import { getAdapter } from "../shared/thirdparties";
import {
  qbCoreAdapter as qbCoreClientAdapter,
  oxLibAdapter as oxLibAClientdapter,
} from "../client/adapters/notification.adapter";
import { NotificationClientAdapter } from "../shared/notification";

declare const SETTINGS: any;

type AdapterName = "qbCore" | "oxLib";

const enabledAdapter: AdapterName = SETTINGS.NOTIFICATION_SYSTEM || "oxLib";

type NotificationAdapters = {
  [key in AdapterName]: NotificationClientAdapter;
};

const getClientAdapter = () =>
  getAdapter<NotificationAdapters, NotificationClientAdapter>(
    {
      qbCore: qbCoreClientAdapter,
      oxLib: oxLibAClientdapter,
    },
    enabledAdapter
  );

export const notify = (message: string, type: "success" | "error") =>
  getClientAdapter().notify(message, type);
