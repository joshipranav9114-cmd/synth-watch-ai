import type { SVGProps } from "react";

type LogoProps = SVGProps<SVGSVGElement>;

export function NetflixLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M5 2h3.6l6.8 14V2H19v20h-3.6L8.6 8v14H5z" />
    </svg>
  );
}

export function CrunchyrollLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden {...props}>
      <path d="M21 12a9 9 0 1 1-9-9" strokeLinecap="round" />
      <circle cx="17.5" cy="6.5" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function DisneyPlusLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 24" fill="currentColor" aria-hidden {...props}>
      <text x="0" y="18" fontFamily="Georgia, serif" fontWeight="700" fontSize="18" fontStyle="italic">D</text>
      <text x="14" y="14" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="14">+</text>
    </svg>
  );
}

export function PrimeVideoLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <text x="2" y="14" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="10" fill="currentColor" stroke="none">prime</text>
      <path d="M3 18c6 4 20 4 26 0" strokeLinecap="round" />
      <path d="M24 17l3 1-1 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HuluLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 24" fill="currentColor" aria-hidden {...props}>
      <text x="2" y="18" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="16" letterSpacing="-1">hulu</text>
    </svg>
  );
}

export function HidiveLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2l10 10-10 10L2 12z" opacity="0.25" />
      <text x="12" y="16" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="12">h!</text>
    </svg>
  );
}

export function YouTubeLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="M10 9l6 3-6 3z" fill="#fff" />
    </svg>
  );
}

export function AppleTVLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 24" fill="currentColor" aria-hidden {...props}>
      <path d="M9 7c.5-1.2 1.6-2 2.8-2 .1 1.2-.4 2.3-1 3-.6.7-1.6 1.2-2.5 1.1-.1-1 .3-2 .7-2.1zM6 12c0-2 1.6-3 3-3 .8 0 1.4.4 2 .4.5 0 1.3-.4 2.2-.4 1.2 0 2.3.7 2.9 1.7-2.6 1.4-2.2 5 .4 5.9-.4.9-.9 1.8-1.6 2.6-.7.7-1.4 1.5-2.5 1.5s-1.4-.6-2.6-.6c-1.2 0-1.6.6-2.6.6-1 0-1.8-.8-2.4-1.6C3.5 17 3 14 4.2 12.4 4.7 11.7 5.5 12 6 12z" />
      <text x="17" y="16" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="9">tv+</text>
    </svg>
  );
}

export function MaxLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 32 24" fill="currentColor" aria-hidden {...props}>
      <text x="16" y="17" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="14" letterSpacing="-0.5">Max</text>
    </svg>
  );
}