export const GAMES = [
  {
    id: "chess",
    title: "Chess Clock",
    tagline: "Masters of Time",
    description:
      "High-precision mechanical and digital timers for competitive play.",
    href: "/chess-clock",
    status: "active",
    theme: "bg-red-500",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v8M8 12h8M10 12v10h4V12M7 22h10M6 2h12" />
      </svg>
    ),
  },
  {
    id: "basketball",
    title: "Basketball Pro",
    tagline: "Every Second Counts",
    description:
      "Full scoreboard featuring shot clocks, fouls, and period tracking.",
    href: "#",
    status: "coming-soon",
    theme: "bg-orange-500",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20M2 12a14.5 14.5 0 0 0 20 0" />
      </svg>
    ),
  },
  {
    id: "volleyball",
    title: "Volleyball Hub",
    tagline: "Rise Above",
    description:
      "Keep track of every set, rotation, and side-switch with ease.",
    href: "#",
    status: "coming-soon",
    theme: "bg-blue-500",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m5 5 14 14M19 5 5 19" />
      </svg>
    ),
  },
];
