type DrawingInfo = {
  draw: boolean;
  pos: {
    x: number | null;
    y: number | null;
  };
};

const cvsSettings = new Map<string, { lw: number; ss: string }>();

export function setCanvasSettings(id: string, lw?: number, ss?: string) {
  const { lw: llw, ss: sss } = cvsSettings.get(id)!;
  cvsSettings.set(id, { lw: lw ?? llw, ss: ss ?? sss });
}

export function initCanvas(
  id: string,
  overlay: string,
  cb: (s: string) => void
) {
  const cvs = document.getElementById(id) as HTMLCanvasElement;
  const ctx = cvs.getContext("2d")!;

  cvsSettings.set(id, { lw: 1, ss: "#000000" });

  const img = new Image();
  img.src = overlay;

  img.onload = () => ctx.drawImage(img, 0, 0, cvs.width, cvs.height);

  const drawing: DrawingInfo = {
    draw: false,
    pos: { x: null, y: null },
  };

  function getCanvasCoord(X: number, Y: number) {
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
    if (!drawing.draw) return;
    const { x, y } = getCanvasCoord(clientX, clientY);
    if (drawing.pos.x && drawing.pos.y) {
      ctx.lineWidth = cvsSettings.get(id)!.lw;
      ctx.strokeStyle = cvsSettings.get(id)!.ss;
      ctx.beginPath();
      ctx.moveTo(drawing.pos.x, drawing.pos.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      cb(cvs.toDataURL());
    }
    drawing.pos = { x, y };
  });
}

export function clearCanvas(id: string) {
  const cvs = document.getElementById(id) as HTMLCanvasElement;
  const ctx = cvs.getContext("2d")!;
  ctx.clearRect(0, 0, cvs.width, cvs.height);
}

export function fileToB64(file: Blob) {
  return new Promise<string | null | ArrayBuffer>((resolve, reject) => {
    const fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
  });
}
