"use client";

import styles from "./demo.module.scss";
import { LiveProvider, LiveEditor, LivePreview } from "react-live";
import { Particles } from "webgl-generative-particles/dist/react";

const code = `
// WIP - caution work in progress!
<div className="${styles.center}">
 <Particles options={{mouseOff: true}} />
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
