export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  try {
    const str = JSON.stringify(err);
    return str === "{}" ? String(err) : str;
  } catch {
    return String(err);
  }
}
