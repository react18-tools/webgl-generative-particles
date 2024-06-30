import { CSSProperties, HTMLProps, useEffect, useRef } from "react";
import { ParticlesOptions, renderParticles } from "../../simulator";

export interface ParticlesProps extends HTMLProps<HTMLCanvasElement> {
  options?: ParticlesOptions;
  overlay?: boolean;
  fullScreenOverlay?: boolean;
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
export const Particles = ({ options, overlay, fullScreenOverlay, ...props }: ParticlesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fsStyles = fullScreenOverlay
    ? { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh" }
    : {};

  const resolvedOverlay = overlay || fullScreenOverlay;

  const style = (
    resolvedOverlay ? { pointerEvents: "none", ...fsStyles, ...props.style } : props.style
  ) as CSSProperties;

  useEffect(
    () =>
      canvasRef.current
        ? renderParticles(canvasRef.current, { ...options, overlay: resolvedOverlay })
        : undefined,
    [options, resolvedOverlay],
  );
  return <canvas ref={canvasRef} style={style} {...props} data-testid="particles" />;
};
