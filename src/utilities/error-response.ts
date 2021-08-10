export default function errorResponse(message: string) {
  return new Error(message);
}
