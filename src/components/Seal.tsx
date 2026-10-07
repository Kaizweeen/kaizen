import { KAI, ZEN } from "@/lib/kanji";

type Props = {
  /** Unique per instance: the rough-edge filter is referenced by id. */
  id: string;
  className?: string;
  plate?: string;
  ink?: string;
  strokeWidth?: number;
  label?: string;
};

/**
 * 改 over 善, cut into a vermilion seal. Strokes carry pathLength 1 so they can be drawn
 * in stroke order by animating stroke-dashoffset.
 */
export function Seal({
  id,
  className,
  plate = "var(--seal-plate, var(--shu))",
  ink = "var(--knock)",
  strokeWidth = 7.5,
  label,
}: Props) {
  const strokes = (paths: string[]) =>
    paths.map((d) => <path key={d} d={d} pathLength={1} data-stroke />);

  return (
    <svg
      viewBox="0 0 120 228"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <defs>
        <filter id={`${id}-rough`} x="-4%" y="-4%" width="108%" height="108%">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="2.4" />
        </filter>
      </defs>
      <g filter={`url(#${id}-rough)`}>
        <rect data-plate width="120" height="228" rx="5" style={{ fill: plate }} />
        <g
          fill="none"
          style={{ stroke: ink }}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          data-ink
        >
          <g transform="translate(5.5 4)">{strokes(KAI)}</g>
          <g transform="translate(5.5 115)">{strokes(ZEN)}</g>
        </g>
      </g>
    </svg>
  );
}
