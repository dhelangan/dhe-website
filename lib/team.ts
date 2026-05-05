export type TeamLink = {
  label: string;
  href: string;
  detailTitle?: string;
  detailBody?: string;
};

export type TeamMember = {
  name: string;
  role: string;
  imageSrc: string;
  bio?: string;
  highlights?: string[];
  links?: TeamLink[];
};

export const team: TeamMember[] = [
  {
    name: "Dhela Ngan",
    role: "Creative Director",
    imageSrc: "/thumbnails/team-creative.svg",
    bio: "Leads the studio vision and keeps every project grounded in playability.",
    highlights: ["Creative direction & tone", "Pitch decks & prototypes", "Playtest facilitation"],
    links: [
      {
        label: "Instagram",
        href: "https://instagram.com",
        detailTitle: "Instagram Page",
        detailBody: "Follow on our Instagram",
      },
      {
        label: "X",
        href: "https://x.com",
        detailTitle: "X Page",
        detailBody: "Follow on our X",
      },
    ],
  },
  {
    name: "Raka Pramana",
    role: "Game Designer",
    imageSrc: "/thumbnails/team-designer.svg",
    bio: "Designs systems that are learnable, readable, and full of interesting choices.",
    highlights: ["Balance passes", "Rules writing", "Moment-to-moment decisions"],
    links: [
      {
        label: "News",
        href: "/news",
        detailTitle: "News",
        detailBody: "Updates and announcements from the studio.",
      },
    ],
  },
  {
    name: "Sinta Ayu",
    role: "Engineer",
    imageSrc: "/thumbnails/team-engineer.svg",
    bio: "Builds prototypes fast and polishes interactions until they feel great.",
    highlights: ["Gameplay engineering", "Tools & pipelines", "Performance & polish"],
    links: [
      {
        label: "Services",
        href: "/services",
        detailTitle: "Services",
        detailBody: "How we help teams ship prototypes and slices.",
      },
    ],
  },
  {
    name: "Bagus Hartono",
    role: "Artist",
    imageSrc: "/thumbnails/team-artist.svg",
    bio: "Shapes the visual style: characters, UI clarity, and key art.",
    highlights: ["Art direction", "Illustration & UI", "Brand consistency"],
    links: [
      {
        label: "Shop",
        href: "/shop",
        detailTitle: "Shop",
        detailBody: "Print-and-play packs, merch, and downloads.",
      },
    ],
  },
  {
    name: "Dhela Mana",
    role: "Creative Director",
    imageSrc: "/thumbnails/team-creative.svg",
    bio: "Leads the studio vision and keeps every project grounded in playability.",
    highlights: ["Creative direction & tone", "Pitch decks & prototypes", "Playtest facilitation"],
    links: [
      {
        label: "Portfolio",
        href: "/portfolio",
        detailTitle: "Portfolio",
        detailBody: "Selected work, prototypes, and shipped credits.",
      },
    ],
  },
  {
    name: "Raka Reeaa",
    role: "Game Designer",
    imageSrc: "/thumbnails/team-designer.svg",
    bio: "Designs systems that are learnable, readable, and full of interesting choices.",
    highlights: ["Balance passes", "Rules writing", "Moment-to-moment decisions"],
    links: [
      {
        label: "News",
        href: "/news",
        detailTitle: "News",
        detailBody: "Updates and announcements from the studio.",
      },
    ],
  },
  {
    name: "Sinta Blesak",
    role: "Engineer",
    imageSrc: "/thumbnails/team-engineer.svg",
    bio: "Builds prototypes fast and polishes interactions until they feel great.",
    highlights: ["Gameplay engineering", "Tools & pipelines", "Performance & polish"],
    links: [
      {
        label: "Services",
        href: "/services",
        detailTitle: "Services",
        detailBody: "How we help teams ship prototypes and slices.",
      },
    ],
  },
  {
    name: "Bagus Derta",
    role: "Artist",
    imageSrc: "/thumbnails/team-artist.svg",
    bio: "Shapes the visual style: characters, UI clarity, and key art.",
    highlights: ["Art direction", "Illustration & UI", "Brand consistency"],
    links: [
      {
        label: "Shop",
        href: "/shop",
        detailTitle: "Shop",
        detailBody: "Print-and-play packs, merch, and downloads.",
      },
    ],
  },
];
