global.on = jest.fn();
global.onNet = jest.fn();
global.emitNet = jest.fn();
global.GetCurrentResourceName = jest.fn().mockReturnValue("brz-fishing");

import { t } from "@config/locales";
import {
  getPlayerAssignedFish,
  onResourceStart,
  processCatchFishEvent,
  processRequestStartFishing,
  processUseBaitEvent,
} from "../server";
import {
  addItem,
  getItem,
  notify,
  removeItem,
} from "@core/thirdparties.service";

jest.mock("@config/locales", () => ({
  t: jest.fn().mockReturnValue("translated message"),
}));

jest.mock("@core/thirdparties.service", () => ({
  addItem: jest.fn(),
  getItem: jest.fn().mockReturnValue({ label: "item label" }),
  removeItem: jest.fn(),
  notify: jest.fn(),
}));

describe("brz-fishing server-side script", () => {
  describe("Register events", () => {
    it("should register to onResourceStart event", () => {
      expect(on).toHaveBeenCalledWith("onResourceStart", onResourceStart);
    });

    it("should register to brz-fishing:requestStartFishing event", () => {
      expect(onNet).toHaveBeenCalledWith(
        "brz-fishing:requestStartFishing",
        processRequestStartFishing
      );
    });

    it("should register to brz-fishing:useBait event", () => {
      expect(onNet).toHaveBeenCalledWith(
        "brz-fishing:useBait",
        processUseBaitEvent
      );
    });

    it("should register to brz-fishing:catchFish event", () => {
      expect(onNet).toHaveBeenCalledWith(
        "brz-fishing:catchFish",
        processCatchFishEvent
      );
    });
  });

  describe("onResourceStart", () => {
    const consoleLog = jest.spyOn(global.console, "log");

    beforeEach(() => {
      consoleLog.mockClear();
    });

    it("should log a translated message when the resource starting is brz-fishing", () => {
      (t as jest.Mock).mockReturnValueOnce("initialising script");

      onResourceStart("brz-fishing");

      expect(consoleLog).toHaveBeenCalledWith("initialising script");
      expect(GetCurrentResourceName).toHaveBeenCalled();
    });

    it("should not log a message when the resource starting is not brz-fishing", () => {
      onResourceStart("brz-core");

      expect(consoleLog).not.toHaveBeenCalled();
    });
  });

  describe("processCatchFishEvent", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should not add item when player does not have a fish assigned", () => {
      processRequestStartFishing(1);

      processCatchFishEvent(2);

      expect(addItem).not.toHaveBeenCalled();
    });

    it("should send no_fish_assigned notify error to player when player does not have a fish assigned", () => {
      processRequestStartFishing(1);

      processCatchFishEvent(2);

      expect(t).toHaveBeenCalledWith("no_fish_assigned", {
        PLAYER_ID: "2",
      });
      expect(notify).toHaveBeenCalledWith(2, expect.any(String), "error");
    });

    it("should add item when player does have a fish assigned", () => {
      processRequestStartFishing(1);

      processCatchFishEvent(1);

      expect(addItem).toHaveBeenCalledWith(1, expect.any(String));
    });

    it("should send message with item label when player does have a fish assigned", () => {
      (getItem as jest.Mock).mockReturnValueOnce({ label: "added item label" });
      (t as jest.Mock).mockImplementationOnce((key, data) => {
        if (key === "catching_success") {
          return `catching_success ${data.ITEM_LABEL}`;
        }

        return undefined;
      });

      processRequestStartFishing(1);
      processCatchFishEvent(1);

      expect(getItem).toHaveBeenCalledWith(expect.any(String));
      expect(t).toHaveBeenCalledWith("catching_success", {
        ITEM_LABEL: "added item label",
      });
      expect(notify).toHaveBeenCalledWith(
        1,
        "catching_success added item label",
        "success"
      );
    });

    it("should log an error message when item is not found", () => {
      const consoleError = jest.spyOn(global.console, "error");

      (getItem as jest.Mock).mockReturnValueOnce(null);

      processRequestStartFishing(1);

      processCatchFishEvent(1);

      expect(consoleError).toHaveBeenCalledWith(
        expect.stringMatching(
          /ERROR: Item (.*?) does not exist. Please be sure you added all fishing items to your inventory system./
        )
      );
    });
  });

  describe("processUseBaitEvent", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should send notify error to player when player does not have commonbait item", () => {
      (removeItem as jest.Mock).mockReturnValueOnce(false);

      processUseBaitEvent(1);

      expect(t).toHaveBeenCalledWith("has_bait_error");
      expect(notify).toHaveBeenCalledWith(1, "translated message", "error");
    });

    it("should not send notify error to player when player has commonbait item", () => {
      (removeItem as jest.Mock).mockReturnValueOnce(true);

      processUseBaitEvent(1);

      expect(notify).not.toHaveBeenCalled();
    });
  });

  describe("processRequestStartFishing", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should assign a fish to player", () => {
      processRequestStartFishing(5);

      expect(getPlayerAssignedFish(5)).toBeDefined();
    });

    it("should emit brz-fishing:startFishing event with player's assigned fish", () => {
      processRequestStartFishing(6);

      expect(emitNet).toHaveBeenCalledWith(
        "brz-fishing:startFishing",
        6,
        getPlayerAssignedFish(6)
      );
    });
  });
});
