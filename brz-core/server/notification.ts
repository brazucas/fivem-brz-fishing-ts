import {
  oxLibAdapter as oxLibAServerdapter,
  qbCoreAdapter as qbCoreServerAdapter,
} from "../server/adapters/notification.adapter";
import { NotificationServerAdapter } from "../shared/notification";
import { getAdapter } from "../shared/thirdparties";

declare const SETTINGS: any;

type AdapterName = "qbCore" | "oxLib";

const enabledAdapter: AdapterName = SETTINGS.NOTIFICATION_SYSTEM || "oxLib";

type NotificationAdapters = {
  [key in AdapterName]: NotificationServerAdapter;
};

const getServerAdapter = () =>
  getAdapter<NotificationAdapters, NotificationServerAdapter>(
    {
      qbCore: qbCoreServerAdapter,
      oxLib: oxLibAServerdapter,
    },
    enabledAdapter
  );

export const notify = (
  source: number,
  message: string,
  type: "success" | "error"
) => getServerAdapter().notify(source, message, type);
