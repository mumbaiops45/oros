/**
 * Inline icon set — no icon library dependency.
 * Every icon inherits `currentColor` and accepts standard SVG props.
 */

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  xmlns: "http://www.w3.org/2000/svg",
};

const Svg = ({ children, className = "h-5 w-5", ...props }) => (
  <svg {...base} className={className} aria-hidden="true" {...props}>
    {children}
  </svg>
);

export const UserIcon = (props) => (
  <Svg {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Svg>
);

export const HeartIcon = (props) => (
  <Svg {...props}>
    <path d="M20.8 5.6a5.2 5.2 0 0 0-7.4 0L12 7l-1.4-1.4a5.2 5.2 0 1 0-7.4 7.4L12 21l8.8-8a5.2 5.2 0 0 0 0-7.4Z" />
  </Svg>
);

export const BagIcon = (props) => (
  <Svg {...props}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </Svg>
);

export const SearchIcon = (props) => (
  <Svg {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
);

export const ChevronDownIcon = (props) => (
  <Svg {...props}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

export const ChevronRightIcon = (props) => (
  <Svg {...props}>
    <path d="m9 6 6 6-6 6" />
  </Svg>
);

export const ArrowRightIcon = (props) => (
  <Svg {...props}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </Svg>
);

export const MenuIcon = (props) => (
  <Svg {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

export const CloseIcon = (props) => (
  <Svg {...props}>
    <path d="M6 6 18 18M18 6 6 18" />
  </Svg>
);

export const StarIcon = ({ className = "h-4 w-4", filled = true, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z" />
  </svg>
);

export const PlayIcon = ({ className = "h-5 w-5", ...props }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M8 5.5v13a1 1 0 0 0 1.5.9l10.5-6.5a1 1 0 0 0 0-1.7L9.5 4.6A1 1 0 0 0 8 5.5Z" />
  </svg>
);

export const LeafIcon = (props) => (
  <Svg {...props}>
    <path d="M4 20c0-9 5-14 16-15 1 11-5 16-14 16" />
    <path d="M4 20c4-6 8-9 13-11" />
  </Svg>
);

export const FlaskIcon = (props) => (
  <Svg {...props}>
    <path d="M10 3h4" />
    <path d="M11 3v6.2L5.6 18A2 2 0 0 0 7.3 21h9.4a2 2 0 0 0 1.7-3L13 9.2V3" />
    <path d="M7.5 15h9" />
  </Svg>
);

export const RabbitIcon = (props) => (
  <Svg {...props}>
    <path d="M8 9c-1.6-3.6-1.2-6 .6-6.4C10.4 2.2 11.4 4.4 11.6 9" />
    <path d="M13.5 9c1-3.8 2.4-5.6 4-5 1.6.6 1.4 3.2-.6 6" />
    <path d="M6 14a5.6 5.6 0 0 1 5.6-5h1.6A6.8 6.8 0 0 1 20 15.8V19a2 2 0 0 1-2 2H9a3 3 0 0 1-3-3Z" />
    <circle cx="16.5" cy="14.5" r="0.8" fill="currentColor" stroke="none" />
  </Svg>
);

export const RecycleIcon = (props) => (
  <Svg {...props}>
    <path d="M7 19H5.5a2.5 2.5 0 0 1-2.1-3.8L5 12.6" />
    <path d="m12 3 2.4 4.1" />
    <path d="M9.6 7.1 12 3l-4.7.5" />
    <path d="M17 19h1.5a2.5 2.5 0 0 0 2.1-3.8l-3.4-5.7" />
    <path d="m7.5 19 2.3-3.6M7.5 19l2.6 3" />
    <path d="M17.6 12.4 21 11l-3.4-1.2" />
  </Svg>
);

export const TruckIcon = (props) => (
  <Svg {...props}>
    <path d="M3 7a1 1 0 0 1 1-1h9v11H3Z" />
    <path d="M13 10h4.2a2 2 0 0 1 1.7 1l2.1 3.4V17h-8Z" />
    <circle cx="7" cy="18.5" r="2" />
    <circle cx="17" cy="18.5" r="2" />
  </Svg>
);

export const PhoneIcon = (props) => (
  <Svg {...props}>
    <path d="M6.3 3h3l1.4 3.6-2 1.3a12 12 0 0 0 5.4 5.4l1.3-2L19 12.7v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.3 5.2 2 2 0 0 1 6.3 3Z" />
  </Svg>
);

export const MailIcon = (props) => (
  <Svg {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </Svg>
);

export const PinIcon = (props) => (
  <Svg {...props}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </Svg>
);

export const ClockIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.2l3.2 2" />
  </Svg>
);

export const ShieldIcon = (props) => (
  <Svg {...props}>
    <path d="M12 3 5 6v6c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6Z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
);

export const SparkIcon = (props) => (
  <Svg {...props}>
    <path d="M12 3.5 13.7 9l5.3 1.7-5.3 1.8L12 18l-1.7-5.5L5 10.7 10.3 9Z" />
    <path d="M18.5 16.5 19.2 18l1.6.6-1.6.6-.7 1.5-.7-1.5-1.6-.6 1.6-.6Z" />
  </Svg>
);

export const InstagramIcon = (props) => (
  <Svg {...props}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
  </Svg>
);

export const FacebookIcon = ({ className = "h-5 w-5", ...props }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5H16.6V4.4A21 21 0 0 0 14.2 4c-2.4 0-4 1.5-4 4.2v2.3H7.5v3h2.7V21Z" />
  </svg>
);

export const YoutubeIcon = ({ className = "h-5 w-5", ...props }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M21.5 8.2a2.6 2.6 0 0 0-1.8-1.9C18 5.8 12 5.8 12 5.8s-6 0-7.7.5A2.6 2.6 0 0 0 2.5 8.2 27 27 0 0 0 2 12a27 27 0 0 0 .5 3.8 2.6 2.6 0 0 0 1.8 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.6 2.6 0 0 0 1.8-1.9A27 27 0 0 0 22 12a27 27 0 0 0-.5-3.8ZM10.2 14.9V9.1l5 2.9Z" />
  </svg>
);

export const XIcon = ({ className = "h-5 w-5", ...props }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M17.5 3h3l-6.6 7.6L21.8 21h-6l-4.7-6.1L5.6 21h-3l7-8.1L2.5 3h6.2l4.3 5.6Zm-1 16.1h1.6L8.1 4.8H6.3Z" />
  </svg>
);

export const PinterestIcon = ({ className = "h-5 w-5", ...props }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5.1s-.3-.6-.3-1.5c0-1.4.8-2.5 1.9-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.2-.9 3.5-.2 1 .5 1.9 1.6 1.9 1.9 0 3.3-2 3.3-4.9 0-2.6-1.8-4.4-4.4-4.4a4.6 4.6 0 0 0-4.8 4.6c0 .9.3 1.9.8 2.4.1.1.1.2.1.3l-.3 1.1c0 .2-.1.2-.3.1-1.4-.6-2.2-2.6-2.2-4.2 0-3.4 2.5-6.6 7.2-6.6 3.8 0 6.7 2.7 6.7 6.3 0 3.7-2.4 6.8-5.6 6.8-1.1 0-2.2-.6-2.5-1.3l-.7 2.6c-.3 1-1 2.2-1.4 3A10 10 0 1 0 12 2Z" />
  </svg>
);

export const benefitIcons = {
  leaf: LeafIcon,
  flask: FlaskIcon,
  rabbit: RabbitIcon,
  recycle: RecycleIcon,
  truck: TruckIcon,
  shield: ShieldIcon,
  spark: SparkIcon,
};
