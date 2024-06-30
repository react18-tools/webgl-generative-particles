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
            speedRange: [200, 250],
            maxParticles: 10000,
            generationRate: 0.2,
            angleRage: [Math.PI / 4, (3 * Math.PI) / 4],
            forceField: [0, -0.02],
            ageRange: [0.2, 0.5],
          }}
        />
        <Particles style={{ height: "500px", width: "600px" }} />
      </body>
    </html>
  );
}
