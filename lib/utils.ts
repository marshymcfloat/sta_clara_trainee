import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function StringFormatter(str: string) {
  if (str.trim() === "") {
    return null;
  }

  return str
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function generateRandomSecretMessage(): string {
  const starters = [
    "The",
    "Your",
    "In",
    "Every",
    "When",
    "Dreams",
    "Hope",
    "Courage",
    "Magic",
    "Tomorrow",
  ];

  const adjectives = [
    "secret",
    "hidden",
    "mysterious",
    "magical",
    "brave",
    "kind",
    "bright",
    "quiet",
    "ancient",
    "eternal",
    "infinite",
    "beautiful",
    "wonderful",
    "amazing",
    "special",
  ];

  const nouns = [
    "stars",
    "universe",
    "moment",
    "journey",
    "dream",
    "path",
    "light",
    "ocean",
    "mountain",
    "forest",
    "river",
    "sky",
    "heart",
    "soul",
    "spirit",
    "adventure",
    "treasure",
    "secret",
    "message",
    "wisdom",
  ];

  const verbs = [
    "aligns",
    "whispers",
    "shines",
    "flows",
    "dances",
    "glows",
    "awakens",
    "blooms",
    "soars",
    "sparkles",
    "guides",
    "inspires",
    "transforms",
    "creates",
    "reveals",
  ];

  const endings = [
    "in the darkness",
    "with endless possibilities",
    "beyond the horizon",
    "within your heart",
    "through time and space",
    "like a gentle breeze",
    "as the sun rises",
    "when you least expect it",
    "in the quiet moments",
    "with infinite grace",
  ];

  const starter = starters[Math.floor(Math.random() * starters.length)];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const verb = verbs[Math.floor(Math.random() * verbs.length)];
  const ending = endings[Math.floor(Math.random() * endings.length)];

  return `${starter} ${adjective} ${noun} ${verb} ${ending}.`;
}
