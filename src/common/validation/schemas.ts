import { z } from "zod";

// Path and query values arrive as strings, and older clients send numbers in
// bodies as strings too, so numbers are coerced.

/** A MyAnimeList anime id. */
export const malId = z.coerce.number().int().min(1);

/** A non-negative number of seconds, e.g. a skip time's start or end. */
export const seconds = z.coerce.number().min(0);

/** Any UUID-shaped id; older submitter ids aren't all version 4. */
export const id = z.guid();

/**
 * A query parameter that may be given once (`types=op`) or repeated
 * (`types=op&types=ed`), with no duplicates.
 */
export const uniqueArray = <T extends z.ZodType>(item: T) =>
  z.preprocess(
    (value) => (Array.isArray(value) ? value : [value]),
    z.array(item).refine((items) => new Set(items).size === items.length, {
      message: "each value in the array must be unique",
    }),
  );
