import { castMinigameTemplate } from "../../dom/cast-minigame.template";

describe("cast minigame template", () => {
  it("should match the snapshot", () => {
    expect(castMinigameTemplate).toMatchSnapshot();
  });
});
