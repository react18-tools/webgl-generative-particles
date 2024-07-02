import { LandingPage } from "@repo/shared/dist/server";
import { Demo } from "@repo/shared";
import { Particles } from "webgl-generative-particles/dist/react";

export const metadata = {
  title: "Webgl Generative Particles",
};

/** next.js landing page */
export default function Page(): JSX.Element {
  const theta = Math.PI / 6;
  return (
    <LandingPage title="Next.js Example">
      <Particles
        style={{ height: "300px", width: "100vw", position: "absolute", left: 0, top: 0 }}
        options={{
          maxParticles: 100_000,
          generationRate: 0.5,
          ageRange: [1.01, 1.15],
          angleRange: [Math.PI / 2.0 - theta, Math.PI / 2.0 + theta],
          speedRange: [0.6, 1.2],
          forceField: [0, -0.5],
          mouseOff: true,
          origin: [0, -1],
        }}
      />
      <Particles
        style={{
          height: "300px",
          width: "60vw",
          position: "absolute",
          left: "20vw",
          top: 0,
          zIndex: 5,
        }}
      />
      <Demo />
    </LandingPage>
  );
}
