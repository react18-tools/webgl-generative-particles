import updateVertexShaderSource from "./shaders/update-vert.glsl?raw";
import updateFragmentShaderSource from "./shaders/update-frag.glsl?raw";
import renderVertexShaderSource from "./shaders/render-vert.glsl?raw";
import renderFragmentShaderSource from "./shaders/render-frag.glsl?raw";

// constnats
const PI = Math.PI;
const random = Math.random;
/** shader names */
// Uniforms
const U_DT = "dt";
const U_RANDOM_RG = "rg";
const U_FORCE_FIELD = "g"; /** gravity */
const U_ORIGIN = "o";
const U_ANGLE_RANGE = "aR";
const U_SPEED_RANGE = "sR";
const U_LIFE_RANGE = "lR";
const U_PARTICLE_COLOR = "c";

// inputs
const IN_POSITION = "p";
const IN_LIFE = "l";
const IN_VELOCITY = "v";

// outputs
const OUT_POSITION = "oP";
const OUT_LIFE = "oL";
const OUT_VELOCITY = "oV";

type Vector2D = [number, number];

export interface ParticlesOptions {
  /** Particle Color @defaultValue [1, 0, 0, 1] -> red */
  rgba?: [number, number, number, number];
  /** Maximum number of particles @defaultValue 100_000 */
  maxParticles?: number;
  /** Particle generation rate @defaultValue 0.5 */
  generationRate?: number;
  /** Overlay mode @defaultValue false */
  overlay?: boolean;
  /** Disable mouse interaction @defaultValue false */
  mouseOff?: boolean;
  /** Min and max angles in radians @defaultValue [-Math.PI, Math.PI] */
  angleRange?: [number, number];
  /** Min and max age of particles in seconds */
  ageRange?: [number, number];
  /** Speed range [minSpeed, maxSpeed] */
  speedRange?: [number, number];
  /** Initial origin, will update as per mouse position if mouseOff is not set @defaultValue [0, 0] */
  origin?: [number, number];
  /** Constant force [fx, fy] or a force field texture (Work In Progress) */
  forceField?: Vector2D; //| Vector[][] | string;
}

const defaultOptions: ParticlesOptions = {
  rgba: [1, 0, 0, 0.5],
  maxParticles: 1000,
  generationRate: 0.25,
  // setting range from -PI to PI craetes some patches because of overflows
  angleRange: [-2 * PI, 2 * PI],
  origin: [-1, -1],
  speedRange: [0.01, 0.1],
  ageRange: [0.01, 0.5],
  forceField: [0, 0.1],
};

/** generate initial data for the simulation */
const getInitialData = (maxParticles: number) => {
  const data = [];
  for (let i = 0; i < maxParticles; i++) data.push(0, 0, 0, 0, 0);
  return data;
};

/** generate random RG data for source of randomness within the simulation */
const randomRGData = (sizeX: number, sizeY: number): Uint8Array => {
  const data = [];
  for (let i = 0; i < sizeX * sizeY; i++) data.push(random() * 255.0, random() * 255.0);
  return new Uint8Array(data);
};

/** Particles simulator */
const simulate = (
  _canvas: HTMLCanvasElement,
  gl: WebGL2RenderingContext,
  options: ParticlesOptions,
) => {
  /** todo Normalize options
   * canvas positions are between -1 to 1 on all axes
   */
  // skipcq: JS-0339 -- defined in default options
  const angleRange = options.angleRange! as [number, number];
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

  /** Create program */
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
    OUT_LIFE,
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
      location: gl.getAttribLocation(updateProgram, IN_LIFE),
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

  /** set uniform value for updateProgram */
  const setUpdateUniform = (name: string, x: number, y?: number): void => {
    const location = gl.getUniformLocation(updateProgram, name);
    y ? gl.uniform2f(location, x, y) : gl.uniform1f(location, x);
  };
  let prevT = 0;
  let bornParticles = 0;
  let readIndex = 0;
  let writeIndex = 1;
  let mouseX = 0;
  let mouseY = 0;

  /** Set origin - from where all particles are generateds */
  const setOrigin = (x: number, y: number): void => {
    mouseX = x;
    mouseY = y;
  };
  /** The render loop */
  const render = (timeStamp: number): void => {
    let dt = timeStamp - prevT;
    prevT = timeStamp;
    if (dt > 500) dt = 0;

    // eslint-disable-next-line no-bitwise -- required
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(updateProgram);

    setUpdateUniform(U_DT, dt / 1000);
    // skipcq: JS-0339 -- forcefield is always set by the default options
    setUpdateUniform(U_FORCE_FIELD, ...options.forceField!);
    setUpdateUniform(U_ORIGIN, mouseX, mouseY);
    setUpdateUniform(U_ANGLE_RANGE, ...angleRange);
    // skipcq: JS-0339 -- set in default options
    setUpdateUniform(U_LIFE_RANGE, ...options.ageRange!);
    // skipcq: JS-0339 -- set in default options
    const speedRange = options.speedRange!;
    setUpdateUniform(U_SPEED_RANGE, speedRange[0], speedRange[1]);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, rgNoiseTexture);
    setUpdateUniform(U_RANDOM_RG, 0);

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
    // skipcq: JS-0339 -- set in default options
    gl.uniform4f(gl.getUniformLocation(renderProgram, U_PARTICLE_COLOR), ...options.rgba!);
    gl.drawArrays(gl.POINTS, 0, bornParticles);
    [readIndex, writeIndex] = [writeIndex, readIndex];

    bornParticles = Math.min(
      // skipcq: JS-0339
      options.maxParticles!,
      // skipcq: JS-0339
      Math.floor(bornParticles + dt * options.generationRate!),
    );

    requestAnimationFrame(ts => {
      render(ts);
    });
  };

  requestAnimationFrame(ts => {
    render(ts);
  });
  return setOrigin;
};

/**
 * Creates and renders webgl generative particle system based simulations.
 *
 * Please handle canvas size as required by your application.
 * @param canvas
 * @returns (()=>void)
 */
export const renderParticles = (canvas: HTMLCanvasElement, options?: ParticlesOptions) => {
  const gl = canvas.getContext("webgl2");
  if (!gl) return undefined;

  const setOrigin = simulate(canvas, gl, { ...defaultOptions, ...options });
  options?.origin && setOrigin(...options.origin);

  /** Set up observer to observe size changes */
  const observer = new ResizeObserver(entries => {
    const { width, height } = entries[0].contentRect;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, canvas.width, canvas.height);
  });
  observer.observe(canvas);

  const target = options?.overlay ? window : canvas;
  /** update mouse position */
  const onMouseMove = (e: MouseEvent) => {
    setOrigin((e.clientX / canvas.width) * 2 - 1, 1 - (e.clientY / canvas.height) * 2);
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
