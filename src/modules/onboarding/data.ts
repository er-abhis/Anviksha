export interface OnboardingSlide {
  key: string;
  title: string;
  description: string;
  /** Gradient stops for the slide backdrop. */
  gradient: [string, string];
  /** Abstract art variant rendered by <AbstractArt />. */
  art: 'orbit' | 'waves' | 'grid';
}

export const SLIDES: OnboardingSlide[] = [
  {
    key: 'what',
    title: 'This is Anviksha',
    description:
      'An interactive playground for AI. Understand concepts by experimenting with them — not by reading walls of text.',
    gradient: ['#4B58F0', '#6C77F5'],
    art: 'orbit',
  },
  {
    key: 'learn',
    title: 'Learn by simulating',
    description:
      'Tweak inputs, watch models react, and build intuition through play. Every idea becomes something you can touch.',
    gradient: ['#3A46D9', '#2DD4BF'],
    art: 'waves',
  },
  {
    key: 'ready',
    title: 'Become AI‑ready',
    description:
      'Progress through worlds, earn XP, and keep your streak. Turn curiosity into real, lasting understanding.',
    gradient: ['#2C36B0', '#14B8A6'],
    art: 'grid',
  },
];
