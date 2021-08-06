export default function keyFormatter(prefix: string, value: string | number): string {
  return `${prefix}-${value}`;
}
