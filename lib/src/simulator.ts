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

/** Particles simulator */
const simulate = (gl: WebGL2RenderingContext, options = defaultOptions) => {
  /** Create shader */
  const createShader = (type: number, source: string): WebGLShader => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("Failed to create shader");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      /* v8 ignore next */
      const info = gl.getShaderInfoLog(shader);
      /* v8 ignore next */
      gl.deleteShader(shader);
      /* v8 ignore next */
      throw new Error("Could not compile WebGL shader. \n\n" + info); // skipcq: JS-0246
      /* v8 ignore next */
    }
    return shader;
  };
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
