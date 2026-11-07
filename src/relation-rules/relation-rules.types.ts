import { z } from "zod";

const episode = z.int().min(1);

/** A range of episodes; no end means the series is still airing. */
const Range = z.object({ start: episode, end: episode.optional() });

export type Range = z.infer<typeof Range>;

/** Redirects episodes `from` one entry to episodes of another (`to`). */
export const Rule = z.object({
  from: Range,
  to: Range.extend({ malId: z.int().min(1) }),
});

export type Rule = z.infer<typeof Rule>;

export type SectionType = "meta" | "rules" | "unknown";
