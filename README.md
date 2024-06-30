# Webgl Generative Particles <img src="https://github.com/react18-tools/webgl-generative-particles/blob/main/popper.png?raw=true" style="height: 40px"/>

[![test](https://github.com/react18-tools/webgl-generative-particles/actions/workflows/test.yml/badge.svg)](https://github.com/react18-tools/webgl-generative-particles/actions/workflows/test.yml) [![Maintainability](https://api.codeclimate.com/v1/badges/aa896ec14c570f3bb274/maintainability)](https://codeclimate.com/github/react18-tools/webgl-generative-particles/maintainability) [![codecov](https://codecov.io/gh/react18-tools/webgl-generative-particles/graph/badge.svg)](https://codecov.io/gh/react18-tools/webgl-generative-particles) [![Version](https://img.shields.io/npm/v/webgl-generative-particles.svg?colorB=green)](https://www.npmjs.com/package/webgl-generative-particles) [![Downloads](https://img.jsdelivr.com/img.shields.io/npm/d18m/webgl-generative-particles.svg)](https://www.npmjs.com/package/webgl-generative-particles) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/webgl-generative-particles) [![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/from-referrer/)

"webgl-generative-particles" is an efficient WebGL-based generative particle system simulator designed for both React and vanilla JS applications. This system follows the mouse pointer, providing interactive and dynamic visual effects. It offers seamless integration with React (including React 18 and beyond) and Next.js, making it an ideal choice for modern frontend development. The simulator is customizable, compatible with various frameworks, and delivers high performance and real-time rendering for progressive web development.

✅ Fully Treeshakable (import from `webgl-generative-particles/client/loader-container`)

✅ Fully TypeScript Supported

✅ Leverages the power of React 18 Server components

✅ Compatible with all React 18 build systems/tools/frameworks

✅ Documented with [Typedoc](https://react18-tools.github.io/webgl-generative-particles) ([Docs](https://react18-tools.github.io/webgl-generative-particles))

✅ Examples for Next.js, Vite, and Remix

> <img src="https://github.com/react18-tools/webgl-generative-particles/blob/main/popper.png?raw=true" style="height: 20px"/> Please consider starring [this repository](https://github.com/react18-tools/webgl-generative-particles) and sharing it with your friends.

## Getting Started

### Installation

```bash
$ pnpm add webgl-generative-particles
```

**_or_**

```bash
$ npm install webgl-generative-particles
```

**_or_**

```bash
$ yarn add webgl-generative-particles
```

## Want Lite Version? [![npm bundle size](https://img.shields.io/bundlephobia/minzip/webgl-generative-particles-lite)](https://www.npmjs.com/package/webgl-generative-particles-lite) [![Version](https://img.shields.io/npm/v/webgl-generative-particles-lite.svg?colorB=green)](https://www.npmjs.com/package/webgl-generative-particles-lite) [![Downloads](https://img.jsdelivr.com/img.shields.io/npm/d18m/webgl-generative-particles-lite.svg)](https://www.npmjs.com/package/webgl-generative-particles-lite)

```bash
$ pnpm add webgl-generative-particles-lite
```

**or**

```bash
$ npm install webgl-generative-particles-lite
```

**or**

```bash
$ yarn add webgl-generative-particles-lite
```

> You need `r18gs` as a peer-dependency

### Import Styles

You can import styles globally or within specific components.

```css
/* globals.css */
@import "webgl-generative-particles/dist";
```

```tsx
// layout.tsx
import "webgl-generative-particles/dist/index.css";
```

For selective imports:

```css
/* globals.css */
@import "webgl-generative-particles/dist/client"; /** required if you are using LoaderContainer */
@import "webgl-generative-particles/dist/server/bars/bars1";
```

### Usage

Using loaders is straightforward.

```tsx
import { Bars1 } from "webgl-generative-particles/dist/server/bars/bars1";

export default function MyComponent() {
  return someCondition ? <Bars1 /> : <>Something else...</>;
}
```

For detailed API and options, refer to [the API documentation](https://react18-tools.github.io/webgl-generative-particles).

**Using LoaderContainer**

`LoaderContainer` is a fullscreen component. You can add this component directly in your layout and then use `useLoader` hook to toggle its visibility.

```tsx
// layout.tsx
<LoaderContainer />
	 ...
```

```tsx
// some other page or component
import { useLoader } from "webgl-generative-particles/dist/hooks";

export default MyComponent() {
	const { setLoading } = useLoader();
	useCallback(()=>{
		setLoading(true);
		...do some work
		setLoading(false);
	}, [])
	...
}
```

## Creadits

I have learnt the concepts from the following blogs and tutorials.

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
