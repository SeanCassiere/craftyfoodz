import { init } from "@paralleldrive/cuid2";

const cuid2 = init({ length: 12 });

/**
 * A helper function to generate a unique ID for a record.
 * @param prefix The prefix to use for the ID. Must be 3 characters long.
 * @returns A unique ID for a record.
 */
export function generateDbId(prefix: string) {
  if (prefix.length !== 3) {
    throw new Error("generateId: Prefix must be 3 characters long");
  }

  return `${prefix}_${cuid2()}`;
}
