import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function createPNG(width, height, drawFn) {
  // Simple uncompressed or deflate PNG generator
  const buffer = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;

  for (let y = 0; y < height; y++) {
    buffer[offset++] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawFn(x, y, width, height);
      buffer[offset++] = r;
      buffer[offset++] = g;
      buffer[offset++] = b;
      buffer[offset++] = a;
    }
  }

  const compressed = zlib.deflateSync(buffer);

  function crc32(buf) {
    let crc = 0 ^ (-1);
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ (-1)) >>> 0;
  }

  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[i] = c;
  }

  function makeChunk(type, data) {
    const len = data.length;
    const chunk = Buffer.alloc(8 + len + 4);
    chunk.writeUInt32BE(len, 0);
    chunk.write(type, 4);
    data.copy(chunk, 8);
    const crcVal = crc32(Buffer.concat([Buffer.from(type), data]));
    chunk.writeUInt32BE(crcVal, 8 + len);
    return chunk;
  }

  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

// Cyberpunk neon drawer
function drawCyberIcon(x, y, w, h) {
  // normalized coordinates -1 to 1
  const nx = (x / w) * 2 - 1;
  const ny = (y / h) * 2 - 1;
  const dist = Math.sqrt(nx * nx + ny * ny);

  // Background dark gradient with slight radial glow
  let r = 10, g = 14, b = 26, a = 255; // #0a0e1a

  // Border rounded card
  const rCard = Math.max(Math.abs(nx), Math.abs(ny));
  if (rCard < 0.85) {
    // subtle inner glow
    r = 13; g = 20; b = 38;
  }
  
  // Neon cyan diamond / code bracket accents
  if (dist < 0.65 && dist > 0.60) {
    r = 0; g = 240; b = 255; // Cyan #00f0ff
  } else if (dist < 0.59 && dist > 0.56) {
    r = 168; g = 85; b = 247; // Purple #a855f7
  }

  // Draw 'BC' or Java coffee cup / terminal symbol in center
  // Coffee cup / brackets
  // Left bracket: <
  if (nx > -0.55 && nx < -0.2 && Math.abs(ny - (nx + 0.35)) < 0.08 && Math.abs(ny) < 0.35) {
    r = 0; g = 255; b = 204;
  }
  if (nx > -0.55 && nx < -0.2 && Math.abs(ny + (nx + 0.35)) < 0.08 && Math.abs(ny) < 0.35) {
    r = 0; g = 255; b = 204;
  }
  // Right bracket: >
  if (nx > 0.2 && nx < 0.55 && Math.abs(ny - (0.35 - nx)) < 0.08 && Math.abs(ny) < 0.35) {
    r = 255; g = 0; b = 128;
  }
  if (nx > 0.2 && nx < 0.55 && Math.abs(ny + (0.35 - nx)) < 0.08 && Math.abs(ny) < 0.35) {
    r = 255; g = 0; b = 128;
  }
  // Center slash: /
  if (Math.abs(ny - (-nx * 1.6)) < 0.08 && Math.abs(ny) < 0.4) {
    r = 250; g = 204; b = 21; // Yellow #facc15
  }

  return [r, g, b, a];
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write 192x192 PNG
const png192 = createPNG(192, 192, drawCyberIcon);
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), png192);

// Write 512x512 PNG
const png512 = createPNG(512, 512, drawCyberIcon);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), png512);
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), png512);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png192);

// Also create vector icon.svg
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#090d16"/>
  <rect x="20" y="20" width="472" height="472" rx="96" fill="none" stroke="#00f0ff" stroke-width="6" opacity="0.4"/>
  <circle cx="256" cy="256" r="180" fill="#0f172a" stroke="#a855f7" stroke-width="8" filter="drop-shadow(0 0 20px #a855f7)"/>
  <!-- Java Coffee Steam -->
  <path d="M 230 140 Q 240 110 230 80" stroke="#ff007f" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.8"/>
  <path d="M 260 140 Q 275 110 265 80" stroke="#00f0ff" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.8"/>
  <path d="M 290 140 Q 300 110 290 80" stroke="#facc15" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.8"/>
  <!-- Code bracket < / > -->
  <path d="M 180 200 L 120 260 L 180 320" stroke="#00f0ff" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <line x1="280" y1="180" x2="232" y2="340" stroke="#facc15" stroke-width="18" stroke-linecap="round"/>
  <path d="M 332 200 L 392 260 L 332 320" stroke="#ff007f" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Subtitle -->
  <text x="256" y="420" font-family="monospace" font-size="34" font-weight="900" fill="#00f0ff" text-anchor="middle" letter-spacing="4">&lt;BOLEH_CODE/&gt;</text>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svg);

console.log('PWA icons generated successfully in public/');
