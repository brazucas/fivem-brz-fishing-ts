declare const SETTINGS: any;

const qbCoreGetPlayer = () =>
  SETTINGS.INVENTORY_SYSTEM === "qbCore" &&
  exports["qb-core"]?.GetCoreObject?.()?.Functions?.GetPlayer;

export const oxLibAdapter = {
  notify: (source: number, message: string, type: "success" | "error") =>
    TriggerClientEvent("ox_lib:notify", source, {
      title: "Fishing",
      description: message,
      type,
    }),
};

export const qbCoreAdapter = {
  notify: (source: number, message: string, type: "success" | "error") => {
    const player = qbCoreGetPlayer()(source);

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
};
