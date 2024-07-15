import { format as prettyFormat } from "pretty-format";

/**
 * Format value
 */
export function formatValue(value: any): string {
  let str = prettyFormat(value);
  if (str.includes("\n")) str = `\n${str}\n`;
  return str;
}
