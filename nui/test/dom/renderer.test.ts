const bodyAppend = jest.fn();

(globalThis as any).$ = jest.fn().mockImplementation((container: string) => {
  if (container === "body") {
    return {
      append: bodyAppend,
    };
  }
});

jest.mock("../../dom/containers", () => ({
  containers: {
    container1: {
      template: "container1",
    },
    container2: {
      template: "container2",
    },
    container3: {
      template: "container3",
    },
  },
}));

import "../../dom/renderer";

describe("renderer", () => {
  it("should append all templates to the body", () => {
    expect(bodyAppend).toHaveBeenCalledTimes(3);
    expect(bodyAppend).toHaveBeenNthCalledWith(1, "container1");
    expect(bodyAppend).toHaveBeenNthCalledWith(2, "container2");
    expect(bodyAppend).toHaveBeenNthCalledWith(3, "container3");
  });
});
