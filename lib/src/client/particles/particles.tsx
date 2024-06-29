import { HTMLProps, ReactNode } from "react";
import styles from "./particles.module.scss";

export interface ParticlesProps extends HTMLProps<HTMLDivElement> {
	children?: ReactNode;
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
export const Particles = ({ children, ...props }: ParticlesProps) => {
  const className = [props.className, styles["particles"]].filter(Boolean).join(" ");
	return (
		<div {...props} className={className} data-testid="particles">
			{children}
		</div>
	);
}
