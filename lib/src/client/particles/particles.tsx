import { HTMLProps, useEffect, useRef } from "react";

export interface ParticlesProps extends HTMLProps<HTMLCanvasElement> {
  nParticles?: number;
}

/**
 *
 *
 * @example
 * ```tsx
 * <Particles />
 * ```
 *
 * @source - Source code
 */
export const Particles = ({ nParticles, ...props }: ParticlesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {}, [nParticles]);
  return (
    <canvas
      ref={canvasRef}
      style={{ pointerEvents: "none", position: "fixed", top: 0, left: 0 }}
      {...props}
      data-testid="particles"
    />
  );
};
