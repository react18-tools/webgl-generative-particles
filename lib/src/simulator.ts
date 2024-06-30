import updateVertexShaderSource from "./shaders/update-vert.glsl?raw";
import updateFragmentShaderSource from "./shaders/update-frag.glsl?raw";
import renderVertexShaderSource from "./shaders/render-vert.glsl?raw";
import renderFragmentShaderSource from "./shaders/render-frag.glsl?raw";

/** shader names */
// Uniforms
const U_DT = "dt";
const U_RANDOM_RG = "rg";
const U_FORCE_FIELD = "g"; /** gravity */
const U_ORIGIN = "o";

// inputs
const IN_POSITION = "p";
const IN_AGE = "a";
const IN_VELOCITY = "v";

// outputs
const OUT_POSITION = "oP";
const OUT_AGE = "oA";
const OUT_VELOCITY = "oV";

/** module scoped global variables/constants */
let mouseX = 0,
  mouseY = 0;

export interface ParticlesOptions {
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

const defaultOptions: ParticlesOptions = {
  maxParticles: 100_000,
  generationRate: 0.5,
};

const getInitialData = (maxParticles: number) => {
  const data = [];
  for (let i = 0; i < maxParticles; i++) data.push(0, 0, 1, 0, 0);
  return data;
};

const randomRGData = (sizeX: number, sizeY: number): Uint8Array => {
  const data = [];
  for (let i = 0; i < sizeX * sizeY; ++i) data.push(Math.random() * sizeX, Math.random() * sizeX);
  return new Uint8Array(data);
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
      throw new Error("Could not compile WebGL shader. -->" + info); // skipcq: JS-0246
      /* v8 ignore next */
    }
    return shader;
  };

  const createProgram = (
    vertexShaderSource: string,
    fragmentShaderSource: string,
    transformFeedbackVaryings?: string[],
  ): WebGLProgram => {
    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = gl.createProgram();
    if (!program) throw new Error("Failed to create program");
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // link transform feedback
    transformFeedbackVaryings &&
      gl.transformFeedbackVaryings(program, transformFeedbackVaryings, gl.INTERLEAVED_ATTRIBS);

    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      /* v8 ignore next */
      // eslint-disable-next-line no-console -- error handling
      console.error(gl.getProgramInfoLog(program));
      /* v8 ignore next */
      throw new Error("Failed to link program");
      /* v8 ignore next */
    }
    return program;
  };

  const updateProgram = createProgram(updateVertexShaderSource, updateFragmentShaderSource, [
    OUT_POSITION,
    OUT_AGE,
    OUT_VELOCITY,
  ]);

  const renderProgram = createProgram(renderVertexShaderSource, renderFragmentShaderSource);

  // skipcq: JS-0339 --> It is never undefined
  const initialData = new Float32Array(getInitialData(options.maxParticles!));
  /** create buffer */
  const createBuffer = (): WebGLBuffer | null => {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, initialData, gl.STREAM_DRAW);
    return buffer;
  };

  const buffers = [createBuffer(), createBuffer()];

  const updateAttribLocations = [
    {
      location: gl.getAttribLocation(updateProgram, IN_POSITION),
      nVect: 2,
    },
    {
      location: gl.getAttribLocation(updateProgram, IN_AGE),
      nVect: 1,
    },
    {
      location: gl.getAttribLocation(updateProgram, IN_VELOCITY),
      nVect: 2,
    },
  ];
  const renderAttribLocations = [
    {
      location: gl.getAttribLocation(renderProgram, IN_POSITION),
      nVect: 2,
    },
  ];

  const vertexArrayObjects = [
    gl.createVertexArray(),
    gl.createVertexArray(),
    gl.createVertexArray(),
    gl.createVertexArray(),
  ];

  [
    updateAttribLocations,
    updateAttribLocations,
    renderAttribLocations,
    renderAttribLocations,
  ].forEach((attributes, index) => {
    gl.bindVertexArray(vertexArrayObjects[index]);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[index % 2]);
    let offset = 0;
    for (const attribute of attributes) {
      gl.enableVertexAttribArray(attribute.location);
      gl.vertexAttribPointer(attribute.location, attribute.nVect, gl.FLOAT, false, 4 * 5, offset);
      offset += 4 * attribute.nVect;
    }
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  });

  gl.clearColor(0, 0, 0, 0);

  const rgNoiseTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, rgNoiseTexture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RG8,
    512,
    512,
    0,
    gl.RG,
    gl.UNSIGNED_BYTE,
    randomRGData(512, 512),
  );

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const setUniform = (name: string, x: number, y?: number): void => {
    const location = gl.getUniformLocation(updateProgram, name);
    y ? gl.uniform2f(location, x, y) : gl.uniform1f(location, x);
  };
  let bornParticles = 0;
  let prevT = 0;
  let readIndex = 0;
  let writeIndex = 1;

  /** The render loop */
  const render = (timeStamp: number): void => {
    let dt = timeStamp - prevT;
    prevT = timeStamp;
    if (dt > 500) dt = 0;

    // eslint-disable-next-line no-bitwise -- required
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(updateProgram);

    setUniform(U_DT, dt / 1000);
    setUniform(U_FORCE_FIELD, 0, -0.1);
    setUniform(U_ORIGIN, mouseX, mouseY);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, rgNoiseTexture);
    setUniform(U_RANDOM_RG, 0);

    gl.bindVertexArray(vertexArrayObjects[readIndex]);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers[writeIndex]);

    gl.enable(gl.RASTERIZER_DISCARD);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, bornParticles);
    gl.endTransformFeedback();
    gl.disable(gl.RASTERIZER_DISCARD);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
    gl.bindVertexArray(vertexArrayObjects[readIndex + 2]);
    gl.useProgram(renderProgram);
    gl.drawArrays(gl.POINTS, 0, bornParticles);
    [readIndex, writeIndex] = [writeIndex, readIndex];

    bornParticles = Math.min(
      // skipcq: JS-0339
      options.maxParticles!,
      // skipcq: JS-0339
      Math.floor(bornParticles + options.maxParticles! * options.generationRate!),
    );

    requestAnimationFrame(ts => {
      render(ts);
    });
  };

  requestAnimationFrame(ts => {
    render(ts);
  });
};

/**
 * Creates and renders webgl generative particle system based simulations.
 *
 * Please handle canvas size as required by your application.
 * @param canvas
 * @returns
 */
export const renderParticles = (canvas: HTMLCanvasElement, options?: ParticlesOptions) => {
  const gl = canvas.getContext("webgl2");
  if (!gl) return undefined;

  simulate(gl, { ...defaultOptions, ...options });

  /** Set up observer to observe size changes */
  const observer = new ResizeObserver(entries => {
    const { width, height } = entries[0].contentRect;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  });
  observer.observe(canvas);

  const target = options?.overlay ? window : canvas;
  const onMouseMove = (e: MouseEvent) => {
    mouseX = (e.clientX / canvas.width) * 2 - 1;
    mouseY = 1 - (e.clientY / canvas.height) * 2;
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
  mouseX = x;
  mouseY = y;
};
