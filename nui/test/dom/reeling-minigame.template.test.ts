import { reelingMinigameTemplate } from "../../dom/reeling-minigame.template";

describe("reeling minigame template", () => {
  it("should match the snapshot", () => {
    expect(reelingMinigameTemplate).toMatchSnapshot();
  });
});
