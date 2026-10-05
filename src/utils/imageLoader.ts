// Utility to load image and make solid white/light background transparent at runtime via OffscreenCanvas
export function loadTransparentImage(src: string, threshold = 238): Promise<CanvasImageSource> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      const offscreen = document.createElement('canvas');
      offscreen.width = img.width;
      offscreen.height = img.height;
      const ctx = offscreen.getContext('2d');
      if (!ctx) {
        resolve(img);
        return;
      }
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, offscreen.width, offscreen.height);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i];
        const g = d[i + 1];
        const b = d[i + 2];
        if (r > threshold && g > threshold && b > threshold) {
          d[i + 3] = 0; // Alpha transparent
        }
      }
      ctx.putImageData(imgData, 0, 0);
      resolve(offscreen);
    };
    img.onerror = reject;
  });
}
