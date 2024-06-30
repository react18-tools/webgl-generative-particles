import "./styles.css";
import "react18-loaders/dist/index.css";
import { Core } from "nextjs-darkmode";
import { Layout } from "@repo/shared/dist/server";
import { GlobalLoader, Header } from "@repo/shared";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Particles } from "webgl-generative-particles/dist/react";

const inter = Inter({ subsets: ["latin"] });

/** Root layout. */
export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Core />
        <Layout>
          <Header linkComponent={Link} />
          {children}
        </Layout>
        <GlobalLoader />
        <Particles
          fullScreenOverlay
          options={{
            rgba: [0, 1, 0, 0.5],
            maxParticles: 1000,
            generationRate: 0.25,
            angleRage: [-2 * Math.PI, 2 * Math.PI],
            origin: [-1, -1],
            speedRange: [0.01, 0.1],
            ageRange: [0.01, 0.5],
            forceField: [0, 0],
          }}
        />
      </body>
    </html>
  );
}
