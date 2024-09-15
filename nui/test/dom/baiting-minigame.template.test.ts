import { baitingMinigameTemplate } from "../../dom/baiting-minigame.template";

describe("baiting minigame template", () => {
  it("should match the snapshot", () => {
    expect(baitingMinigameTemplate).toMatchSnapshot();
  });
});
