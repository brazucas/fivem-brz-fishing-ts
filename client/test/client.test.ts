let registerCommandCallback = jest.fn();
let oneNetEventCallback = {} as any;

global.RegisterCommand = jest
  .fn()
  .mockImplementation((commandName, callback) => {
    registerCommandCallback = callback;
  });
global.TriggerEvent = jest.fn();
global.GetPlayerServerId = jest.fn(() => 1);
global.onNet = jest.fn().mockImplementation((eventName, callback) => {
  oneNetEventCallback[eventName] = callback;
});
global.PlayerId = jest.fn(() => 1);

import { requestStartFishing, startFishing } from "@/fishing";
import { getState, setState } from "@/state";
import { getUseItemHookName } from "@core/inventory";

jest.mock("@config/locales", () => ({
  t: jest.fn().mockImplementation((phase: string) => {
    if (phase === "fish_command") return "fish";
    return "";
  }),
}));

jest.mock("../fishing", () => ({
  requestStartFishing: jest.fn(),
  startFishing: jest.fn(),
}));

jest.mock("../state", () => ({
  getState: jest.fn(),
  setState: jest.fn(),
}));

jest.mock("@core/inventory", () => ({
  getUseItemHookName: jest.fn().mockReturnValue("inventory:client:ItemBox"),
  getUseItemHookHandler: jest.fn().mockReturnValue(() => ({
    itemName: "fishingrod1",
    itemType: "use",
  })),
}));

describe("client", () => {
  beforeAll(() => {
    require("../client");
  });

  describe("Fishing command", () => {
    it("should register only one fishing command", () => {
      expect(global.RegisterCommand).toBeCalledTimes(1);
    });

    it("should register the fishing command with localised keyword passing unrestricted flag as false", () => {
      expect(global.RegisterCommand as jest.Mock).toBeCalledWith(
        "fish",
        expect.any(Function),
        false
      );
    });

    it("should toggle fishing state to not fishing when fishing command is invoked and player is already fishing", () => {
      (getState as jest.Mock).mockReturnValue("fishing");
      registerCommandCallback(1, []);
      expect(setState).toBeCalledWith("not-fishing");
    });

    it("should request to start fishing when fishing command is invoked and player is not fishing", () => {
      (getState as jest.Mock).mockReturnValue("not-fishing");
      registerCommandCallback(1, []);
      expect(requestStartFishing).toBeCalledTimes(1);
    });

    it("should trigger chat suggestion for localised fishing command", () => {
      expect(global.TriggerEvent).toBeCalledWith(
        "chat:addSuggestion",
        "/fish",
        "",
        []
      );
    });
  });

  describe("Request fishing when using the Rod item", () => {
    beforeAll(() => {
      (setState as jest.Mock).mockReset();
      (requestStartFishing as jest.Mock).mockReset();
    });
    it("should register an onNet event for the third party adapter", () => {
      (getUseItemHookName as jest.Mock).mockReturnValue(
        "inventory:client:ItemBox"
      );

      expect(global.onNet).toBeCalledWith(
        "inventory:client:ItemBox",
        expect.any(Function)
      );
    });

    it("should toggle fishing state to not fishing when fishingrod1 item is used and player is already fishing", () => {
      (getState as jest.Mock).mockReturnValue("fishing");
      oneNetEventCallback["inventory:client:ItemBox"](
        { name: "fishingrod1" },
        "use"
      );
      expect(setState).toBeCalledWith("not-fishing");
    });

    it("should request to request fishing when fishingrod1 item is used and player is not fishing", () => {
      (getState as jest.Mock).mockReturnValue("not-fishing");
      oneNetEventCallback["inventory:client:ItemBox"](
        { name: "fishingrod1" },
        "use"
      );
      expect(requestStartFishing).toBeCalledTimes(1);
    });
  });

  describe("On brz-fishing:startFishing event", () => {
    it("should start fishing when brz-fishing:startFishing event is triggered", () => {
      oneNetEventCallback["brz-fishing:startFishing"]("fishId");
      expect(startFishing).toBeCalledTimes(1);
      expect(startFishing).toBeCalledWith(1, "fishId");
    });
  });
});
