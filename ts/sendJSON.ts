export function sendJSON(payload: object) {
  return {
    json: JSON.stringify(payload),
  };
}
