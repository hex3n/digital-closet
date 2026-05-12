// Extract dominant colors from an image using Canvas API
export function extractColors(imageElement, count = 5) {
  const canvas = document.createElement('canvas');
  const size = 50;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageElement, 0, 0, size, size);

  const data = ctx.getImageData(0, 0, size, size).data;
  const colorMap = {};

  for (let i = 0; i < data.length; i += 4) {
    const r = Math.round(data[i] / 32) * 32;
    const g = Math.round(data[i + 1] / 32) * 32;
    const b = Math.round(data[i + 2] / 32) * 32;
    const a = data[i + 3];
    if (a < 128) continue;
    const key = `${r},${g},${b}`;
    colorMap[key] = (colorMap[key] || 0) + 1;
  }

  return Object.entries(colorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([rgb]) => {
      const [r, g, b] = rgb.split(',').map(Number);
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    });
}

export function hexToName(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  if (brightness > 230) return 'white';
  if (brightness < 30) return 'black';
  if (r > 200 && g < 100 && b < 100) return 'red';
  if (r > 200 && g > 150 && b < 100) return 'orange';
  if (r > 200 && g > 200 && b < 100) return 'yellow';
  if (r < 100 && g > 150 && b < 100) return 'green';
  if (r < 100 && g < 100 && b > 150) return 'blue';
  if (r > 100 && g < 100 && b > 150) return 'purple';
  if (r > 180 && g > 130 && b > 100 && Math.abs(r - g) < 40) return 'beige';
  if (Math.abs(r - g) < 20 && Math.abs(g - b) < 20) return 'gray';
  if (r > 150 && g < 80 && b < 80) return 'burgundy';
  if (r < 50 && g < 80 && b > 100) return 'navy';
  return 'other';
}
