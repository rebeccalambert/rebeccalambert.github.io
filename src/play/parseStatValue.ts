export interface ParsedStatValue {
  prefix: string;
  number: number;
  suffix: string;
  decimals: number;
}

// Leading non-digits, one number (optionally decimal), then anything after.
// "99.95%+" -> "", 99.95, "%+"   "< 20 min" -> "< ", 20, " min"   "~10" -> "~", 10, ""
// Thousands separators ("1,000") aren't supported — none of the current stats use them.
const STAT_PATTERN = /^(\D*?)(\d+(?:\.\d+)?)(.*)$/;

export function parseStatValue(value: string): ParsedStatValue | null {
  const match = STAT_PATTERN.exec(value);
  if (!match) return null;
  const [, prefix, digits, suffix] = match;
  return {
    prefix,
    number: Number(digits),
    suffix,
    decimals: digits.split('.')[1]?.length ?? 0,
  };
}

export function formatStatValue({ prefix, suffix, decimals }: ParsedStatValue, n: number): string {
  return `${prefix}${n.toFixed(decimals)}${suffix}`;
}
