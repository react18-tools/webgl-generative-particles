import { HTMLProps, useEffect, useRef } from "react";
import { ParticlesOptions, renderParticles } from "../../simulator";

export interface ParticlesProps extends HTMLProps<HTMLCanvasElement> {
  options?: ParticlesOptions;
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
export const Particles = ({ options, style, ...props }: ParticlesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(
    () => (canvasRef.current ? renderParticles(canvasRef.current, options) : undefined),
    [options],
  );
  return (
    <canvas
      ref={canvasRef}
      style={{ pointerEvents: "none", position: "fixed", top: 0, left: 0, ...style }}
      {...props}
      data-testid="particles"
    />
  );
};
