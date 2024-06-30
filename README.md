# WebGL Generative Particles <img src="https://github.com/react18-tools/webgl-generative-particles/blob/main/popper.png?raw=true" style="height: 40px"/>

> This library is a Work In Progress. Feel free to request features, report bugs, or contribute. We aim to keep the APIs stable, though some changes may occur.

[![test](https://github.com/react18-tools/webgl-generative-particles/actions/workflows/test.yml/badge.svg)](https://github.com/react18-tools/webgl-generative-particles/actions/workflows/test.yml) [![Maintainability](https://api.codeclimate.com/v1/badges/17e43ef7ca4593a18757/maintainability)](https://codeclimate.com/github/react18-tools/webgl-generative-particles/maintainability) [![codecov](https://codecov.io/gh/react18-tools/webgl-generative-particles/graph/badge.svg)](https://codecov.io/gh/react18-tools/webgl-generative-particles) [![Version](https://img.shields.io/npm/v/webgl-generative-particles.svg?colorB=green)](https://www.npmjs.com/package/webgl-generative-particles) [![Downloads](https://img.jsdelivr.com/img.shields.io/npm/d18m/webgl-generative-particles.svg)](https://www.npmjs.com/package/webgl-generative-particles) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/webgl-generative-particles) [![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/from-referrer/)

"webgl-generative-particles" is an efficient WebGL-based generative particle system simulator designed for both React and vanilla JS applications. This system follows the mouse pointer, providing interactive and dynamic visual effects. It offers seamless integration with React (including React 18 and beyond) and Next.js, making it an ideal choice for modern frontend development. The simulator is customizable, compatible with various frameworks, and delivers high performance and real-time rendering for progressive web development.

> Check out the live demo at - https://webgl-generative-particles.vercel.app/

## Features

✅ Fully Treeshakable (import from `webgl-generative-particles/react`)

✅ Fully TypeScript Supported

✅ Leverages the power of React 18 Server components

✅ Compatible with all React 18 build systems/tools/frameworks

✅ Documented with [Typedoc](https://react18-tools.github.io/webgl-generative-particles) ([Docs](https://react18-tools.github.io/webgl-generative-particles))

✅ Examples for Next.js, Vite, and Remix

> <img src="https://github.com/react18-tools/webgl-generative-particles/blob/main/popper.png?raw=true" style="height: 20px"/> Please consider starring [this repository](https://github.com/react18-tools/webgl-generative-particles) and sharing it with your friends.

## Getting Started

### Installation

Using pnpm:

```bash
$ pnpm add webgl-generative-particles
```

Using npm:

```bash
$ npm install webgl-generative-particles
```

Using yarn:

```bash
$ yarn add webgl-generative-particles
```

## Usage

```ts
import { Particles } from "webgl-generative-particles/react";

<Particles
  fullScreenOverlay
  options={{
    rgba: [0, 1, 0, 0.5],
  }}
/>
```

### Simulator Options

```ts
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
```

## Credits

The concepts in this library were learned from the following blogs and tutorials:

- https://experiments.withgoogle.com/search?q=particles
- https://nullprogram.com/blog/2014/06/29/
- https://gpfault.net/posts/webgl2-particles.txt.html
- https://umbcgaim.wordpress.com/2010/07/01/gpu-random-numbers/
- https://www.youtube.com/playlist?list=PLjcVFFANLS5zH_PeKC6I8p0Pt1hzph_rt
- https://stackoverflow.com/q/15215968/23175171
- https://stackoverflow.com/q/71021772/23175171

## License

This library is licensed under the MPL-2.0 open-source license.

> <img src="https://github.com/react18-tools/webgl-generative-particles/blob/main/popper.png?raw=true" style="height: 20px"/> Please consider enrolling in [our courses](https://mayank-chaudhari.vercel.app/courses) or [sponsoring](https://github.com/sponsors/mayank1513) our work.

<hr />

<p align="center" style="text-align:center">with 💖 by <a href="https://mayank-chaudhari.vercel.app" target="_blank">Mayank Kumar Chaudhari</a></p>
