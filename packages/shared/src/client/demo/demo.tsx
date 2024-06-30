"use client";

import styles from "./demo.module.scss";
import { LiveProvider, LiveEditor, LivePreview } from "react-live";
import { Particles } from "webgl-generative-particles/dist/react";

const code = `
// WIP - caution work in progress!
<div className="${styles.center}">
 <Particles options={{mouseOff: true, maxParticles: 10_000, speedRange: [0.6, 1.2]}} />
</div>
`;

/** React live demo */
export function Demo() {
  return (
    <LiveProvider code={code} scope={{ Particles }}>
      <div className={styles.demo}>
        <LiveEditor className={styles.code} />
        <LivePreview className={styles.preview} />
      </div>
    </LiveProvider>
  );
}
