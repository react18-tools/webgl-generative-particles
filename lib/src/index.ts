/** module scoped global variables/constants */
const origin = { x: 0, y: 0 };

interface Options {
  maxParticles?: number;
  generationRate?: number;
  overlay?: boolean;
  mouseOff?: boolean;
  /** todo */
  /** min and max age of particles */
  ageRange?: [number, number];
  /** [minSpeed, maxSpeed] */
  speedRange?: [number, number];
  /** min and max Angles in radians: -Math.PI to Math.PI */
  angleRage?: [number, number];
  /** todo: WIP constant force [fx, fy, fz] or a force field texture */
  forceField?: [number, number, number] | number[][] | string;
}

const defaultOptions: Options = {
  maxParticles: 100_000,
  generationRate: 1000,
};

const simulate = (gl: WebGL2RenderingContext, options = defaultOptions) => {
  // Simulate particles here
};

/**
 * Creates and renders webgl generative particle system based simulations.
 *
 * Please handle canvas size as required by your application.
 * @param canvas
 * @returns
 */
export const renderParticles = (canvas: HTMLCanvasElement, options?: Options) => {
  const gl = canvas.getContext("webgl2");
  if (!gl) return undefined;

  simulate(gl, options);

  /** Set up observer to observe size changes */
  const observer = new ResizeObserver(entries => {
    const { width, height } = entries[0].contentRect;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  });
  observer.observe(canvas);

  const target = options?.overlay ? window : canvas;
  const onMouseMove = (e: MouseEvent) => {
    origin.x = ((e.clientX - e.offsetX) / canvas.width) * 2 - 1;
    origin.y = ((e.clientY - e.offsetY) / canvas.height) * 2 - 1;
  };

  // @ts-expect-error -- strange type-error
  !options?.mouseOff && target.addEventListener("mousemove", onMouseMove);
  /** Clean up function */
  return () => {
    observer.disconnect();
    // @ts-expect-error -- strange type-error
    !options?.mouseOff && target.removeEventListener("mousemove", onMouseMove);
  };
};

/**
 * Should allow users to set origin manually?
 */

/** Extra functions */
export const setOrigin = (x: number, y: number) => {
  origin.x = x;
  origin.y = y;
};
