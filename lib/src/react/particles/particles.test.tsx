import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, test } from "vitest";
import { Particles } from "./particles";

describe("particles", () => {
  afterEach(cleanup);

  test("Test if renders without errors", ({ expect }) => {
    const clx = "my-class";
    render(<Particles className={clx} />);
    expect(screen.getByTestId("particles").classList).toContain(clx);
  });

  test("Test fullScreen overlay mode", ({ expect }) => {
    render(<Particles fullScreenOverlay />);
    expect(screen.getByTestId("particles").style.width).toBe("100vw");
  });
});
