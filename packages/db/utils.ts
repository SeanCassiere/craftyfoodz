import { init } from "@paralleldrive/cuid2";

const cuid2 = init({ length: 12 });

/**
 * A helper function to generate a unique ID for a record.
 * @param prefix The prefix to use for the ID. Must be 3 characters long.
 * @returns A unique ID for a record.
 */
export function generateDbId(prefix: string) {
  if (prefix.length < 3 || prefix.length > 4) {
    throw new Error("generateId: Prefix must be 3 or 4 characters long");
  }

  return `${prefix}_${cuid2()}`;
}

/**
 * A helper function to generate a six-digit access code
 * @returns A six-digit access code string
 */
export function generateSixDigitAccessCode() {
  return `${Math.floor(100000 + Math.random() * 900000)}`;
}
