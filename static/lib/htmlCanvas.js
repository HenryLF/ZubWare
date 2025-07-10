(function(g,f){if(typeof define=="function"&&define.amd){define(f)}else if(typeof exports=="object" && typeof module<"u"){module.exports=f()}else{var m=f();for(var i in m) g[i]=m[i]}}(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : this,function(){var exports={};var __exports=exports;var module={exports};
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ts/htmlCanvas.ts
var htmlCanvas_exports = {};
__export(htmlCanvas_exports, {
  clearCanvas: () => clearCanvas,
  fileToB64: () => fileToB64,
  initCanvas: () => initCanvas,
  setCanvasSettings: () => setCanvasSettings
});
module.exports = __toCommonJS(htmlCanvas_exports);
var cvsSettings = /* @__PURE__ */ new Map();
function setCanvasSettings(id, lw, ss) {
  const { lw: llw, ss: sss } = cvsSettings.get(id);
  cvsSettings.set(id, { lw: lw != null ? lw : llw, ss: ss != null ? ss : sss });
}
function initCanvas(id, overlay, cb) {
  const cvs = document.getElementById(id);
  const ctx = cvs.getContext("2d");
  cvsSettings.set(id, { lw: 1, ss: "#000000" });
  const img = new Image();
  img.src = overlay;
  img.onload = () => ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
  const drawing = {
    draw: false,
    pos: { x: null, y: null }
  };
  function getCanvasCoord(X, Y) {
    const rect = cvs.getBoundingClientRect();
    const scaleX = cvs.width / rect.width;
    const scaleY = cvs.height / rect.height;
    let x = (X - rect.left) * scaleX;
    let y = (Y - rect.top) * scaleY;
    return { x, y };
  }
  window.addEventListener("mousedown", ({ clientX, clientY }) => {
    drawing.draw = true;
    drawing.pos = getCanvasCoord(clientX, clientY);
  });
  window.addEventListener("mouseup", () => {
    drawing.draw = false;
    drawing.pos = { x: null, y: null };
  });
  window.addEventListener("mousemove", ({ clientX, clientY }) => {
    if (!drawing.draw) return;
    const { x, y } = getCanvasCoord(clientX, clientY);
    if (drawing.pos.x && drawing.pos.y) {
      ctx.lineWidth = cvsSettings.get(id).lw;
      ctx.strokeStyle = cvsSettings.get(id).ss;
      ctx.beginPath();
      ctx.moveTo(drawing.pos.x, drawing.pos.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      cb(cvs.toDataURL());
    }
    drawing.pos = { x, y };
  });
}
function clearCanvas(id) {
  const cvs = document.getElementById(id);
  const ctx = cvs.getContext("2d");
  ctx.clearRect(0, 0, cvs.width, cvs.height);
}
function fileToB64(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
  });
}

if(__exports != exports)module.exports = exports;return module.exports}));
