//@ts-ignore
window.sendJSON = function (obj: object) {
  return { json: JSON.stringify(obj) };
};
