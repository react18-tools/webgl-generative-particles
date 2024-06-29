import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, test } from "vitest";
import { Particles } from "./particles";

describe.concurrent("particles", () => {
	afterEach(cleanup);

	test("Dummy test - test if renders without errors", ({ expect }) => {
		const clx = "my-class";
		render(<Particles className={clx} />);
		expect(screen.getByTestId("particles").classList).toContain(clx);
	});
});
