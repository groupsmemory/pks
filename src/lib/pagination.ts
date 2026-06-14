export function encodeCursor(sortValue: string, id: string): string {
  return Buffer.from(`${sortValue}||${id}`).toString('base64');
}

export function decodeCursor(cursor: string): [string, string] {
  const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
  const sepIndex = decoded.indexOf('||');
  return [decoded.slice(0, sepIndex), decoded.slice(sepIndex + 2)];
}
