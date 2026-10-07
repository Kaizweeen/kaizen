export const EMAIL = "kaizen.gabriel.0106@gmail.com";
export const GITHUB = "https://github.com/Kaizweeen";

export type Project = {
  slug: string;
  name: string;
  line: string;
  detail: string;
  status: "shipped" | "in progress";
  stack: string[];
  /** Real count from the repo's git history on 2026-10-07; null when the project has no git history. */
  commits: number | null;
  links: { label: string; href: string }[];
  private?: boolean;
  /** Screenshot in /public/work, captured from the running project. */
  shot?: string;
};

export const projects: Project[] = [
  {
    slug: "koino",
    name: "Koino",
    line: "A daily devotion you can actually finish.",
    detail:
      "Guided Scripture reading in four short steps, a private journal, streaks, reading plans, dark mode, and an installable offline app. It started as a church welcome app and became this.",
    status: "shipped",
    stack: ["Next.js", "TypeScript", "Tailwind", "PWA", "Vitest"],
    commits: 71,
    links: [
      { label: "Live", href: "https://koino-bay.vercel.app" },
      { label: "Code", href: "https://github.com/Kaizweeen/Koino" },
    ],
    shot: "/work/koino.webp",
  },
  {
    slug: "dentasync",
    name: "DentaSync",
    line: "A three-branch dental clinic, from booking to chair.",
    detail:
      "Live at brightsmile.pro for a clinic with three branches in Makati. Patients book online and get text reminders; staff run appointments, chairs, patient forms, and dental charts. An end-to-end test drives the whole thing in a browser.",
    status: "in progress",
    stack: ["Next.js 16", "Drizzle", "Postgres", "Better Auth", "Playwright"],
    commits: 322,
    links: [
      { label: "Live", href: "https://brightsmile.pro" },
      { label: "Code", href: "https://github.com/Kaizweeen/BrightSmile" },
    ],
    shot: "/work/dentasync.webp",
  },
  {
    slug: "planorama",
    name: "Planorama",
    line: "Finds the hour when the whole group is free.",
    detail:
      "Group scheduling for college students with irregular timetables. A team course project, taken from the pitch deck's mockups to a full-stack app with its own auth.",
    status: "shipped",
    stack: ["Next.js 16", "Postgres", "Supabase", "jose"],
    commits: 3,
    links: [{ label: "Code", href: "https://github.com/Kaizweeen/Planorama" }],
    shot: "/work/planorama.webp",
  },
  {
    slug: "prompt-builder",
    name: "Prompt Builder",
    line: "Write, version, and test prompts like code.",
    detail:
      "A full-stack workspace with a template library, saved versions, and ghost-text autocomplete that runs locally. Test runs are simulated on purpose, so it works offline with no API key.",
    status: "shipped",
    stack: ["Next.js", "FastAPI", "SQLAlchemy", "SQLite"],
    commits: null,
    links: [],
    private: true,
  },
  {
    slug: "chord-transposer",
    name: "chord-transposer",
    line: "Any progression, any key, with the shapes on the neck.",
    detail:
      "Type a progression, pick a key, and read the result like a stage tuner: capo suggestions, every chord shape on a full guitar neck, and history saved on your device.",
    status: "shipped",
    stack: ["Next.js", "TypeScript", "SVG", "Vitest"],
    commits: 18,
    links: [{ label: "Code", href: "https://github.com/Kaizweeen/chord-transposer" }],
    shot: "/work/chord-transposer.webp",
  },
  {
    slug: "handscope",
    name: "handscope",
    line: "Make a hand sign, throw a technique.",
    detail:
      "Live hand tracking in the browser that recognises twelve signs, some needing two hands or a real punch toward the lens, and draws each one on a canvas by hand. No engine, no effects library.",
    status: "shipped",
    stack: ["JavaScript", "Canvas", "MediaPipe"],
    commits: 3,
    links: [
      { label: "Try it", href: "https://kaizweeen.github.io/handscope/" },
      { label: "Code", href: "https://github.com/Kaizweeen/handscope" },
    ],
    shot: "/work/handscope.webp",
  },
  {
    slug: "air-loops",
    name: "air-loops",
    line: "Hold up fingers, build a beat.",
    detail:
      "The webcam counts your fingers and stacks lo-fi loops on one shared clock, so every layer lands on the beat. Sing over it and record the take. One HTML file, nothing uploaded.",
    status: "shipped",
    stack: ["JavaScript", "Web Audio", "MediaPipe"],
    commits: 2,
    links: [
      { label: "Try it", href: "https://kaizweeen.github.io/air-loops/" },
      { label: "Code", href: "https://github.com/Kaizweeen/air-loops" },
    ],
    shot: "/work/air-loops.webp",
  },
  {
    slug: "moonshadow",
    name: "Moonshadow",
    line: "Shadow puppets that come alive.",
    detail:
      "Make five classic hand shadows at your webcam and each one becomes an animated creature in a narrated moonlit story, ending in a papercraft keepsake you can download.",
    status: "shipped",
    stack: ["JavaScript", "Canvas", "MediaPipe", "Speech"],
    commits: 20,
    links: [],
    private: true,
    shot: "/work/moonshadow.webp",
  },
  {
    slug: "penalty-keeper",
    name: "penalty-keeper",
    line: "You are the keeper. Read the run-up.",
    detail:
      "A retro pixel penalty shootout with no coin flips: the striker's body gives away the direction, and you have to commit to the dive before the shot.",
    status: "shipped",
    stack: ["JavaScript", "Canvas"],
    commits: 1,
    links: [
      { label: "Play", href: "https://kaizweeen.github.io/penalty-keeper/" },
      { label: "Code", href: "https://github.com/Kaizweeen/penalty-keeper" },
    ],
    shot: "/work/penalty-keeper.webp",
  },
];

export const copy = {
  meta: {
    title: "Kaizen Gabriel, student developer",
    description:
      "Portfolio of Kaizen Gabriel. Nine web projects, shipped rough and made better one version at a time.",
  },
  hero: {
    name: "Kaizen Gabriel",
    role: "Student developer",
    line: "I ship it, then I make it better.",
    cta: "See the work",
    contact: "Say hello",
  },
  statement: {
    lead: "I'm Kai.",
    body: "I build web apps, mostly alone and mostly fast. The first version is always rough. Then I keep going: fix what broke, cut what didn't matter, sharpen what did. Project after project, that loop is the only method I trust.",
  },
  onePercent: {
    jp: "改善",
    heading: "means change for the better, one small step at a time.",
    still: "Standing still for a year",
    better: "One percent better, every day",
    note: "A slogan, not a promise. The arithmetic is real though: small steps compound.",
  },
  work: {
    heading: "Work",
    sub: "Nine projects, newest thinking first. Commit counts come straight from each repo, every branch, small ones included.",
  },
  method: {
    heading: "How I work",
    steps: [
      { name: "Plan", text: "Write the spec before the code: what it is, who it is for, and what must never be faked." },
      { name: "Do", text: "Build the smallest version that runs. Tests guard the parts that must not break." },
      { name: "Check", text: "Run it for real, in the browser and on a phone. Never ship on it should work." },
      { name: "Act", text: "Fix what broke, cut what did not matter, and start the loop again." },
    ],
  },
  clients: {
    heading: "If you run a business",
    sub: "I take on a small number of projects alongside school, and I tell you plainly what I can and cannot do.",
    offers: [
      {
        name: "A website people trust",
        text: "For clinics, shops, and studios. Fast, clear, and built for the phones your customers actually use.",
      },
      {
        name: "A web app that removes busywork",
        text: "Booking, scheduling, records. The kind of tool DentaSync is for a three-branch dental clinic.",
      },
      {
        name: "Something people remember",
        text: "Interactive pieces with camera, sound, and motion, like handscope and air-loops.",
      },
    ],
  },
  contact: {
    heading: "Let's make it better.",
    copy: "Copy email",
    copied: "Copied to your clipboard",
    write: "Write an email",
    github: "GitHub",
  },
  footer: {
    built: "Built with Next.js and GSAP. Every number on this page is real.",
    credit: "Kanji stroke data from KanjiVG by Ulrich Apel, CC BY-SA 3.0.",
  },
} as const;
