"use strict";
const cvsSettings = new Map();
//@ts-ignore
window.setCanvasSettings = function (id, lw, ss) {
    const { lw: llw, ss: sss } = cvsSettings.get(id);
    cvsSettings.set(id, { lw: lw ?? llw, ss: ss ?? sss });
};
// @ts-ignore
window.initCanvas = function (id, overlay, cb) {
    const cvs = document.getElementById(id);
    const ctx = cvs.getContext("2d");
    cvsSettings.set(id, { lw: 1, ss: "#000000" });
    const img = new Image();
    img.src = overlay;
    img.onload = () => ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
    const drawing = {
        draw: false,
        pos: { x: null, y: null },
    };
    function getCanvasCoord(X, Y) {
        const rect = cvs.getBoundingClientRect();
        const scaleX = cvs.width / rect.width; // Buffer vs CSS width ratio
        const scaleY = cvs.height / rect.height; // Buffer vs CSS height ratio
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
        if (!drawing.draw)
            return;
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
};
//@ts-ignore
window.clearCanvas = function (id) {
    const cvs = document.getElementById(id);
    const ctx = cvs.getContext("2d");
    ctx.clearRect(0, 0, cvs.width, cvs.height);
};
//@ts-ignore
window.fileToB64 = function (file) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onload = () => resolve(fr.result);
        fr.onerror = reject;
    });
};
