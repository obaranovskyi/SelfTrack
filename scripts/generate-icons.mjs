/**
 * Generates PWA icons with an "ST" logo design.
 * Run with: node scripts/generate-icons.mjs
 */

import { deflateSync } from "zlib";
import { writeFileSync, mkdirSync, existsSync } from "fs";

// ---------------------------------------------------------------------------
// PNG encoder (pure Node.js, no dependencies)
// ---------------------------------------------------------------------------

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const t = Buffer.from(type, "ascii");
  const d = Buffer.isBuffer(data) ? data : Buffer.from(data);
  const len = Buffer.alloc(4); len.writeUInt32BE(d.length, 0);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, d])), 0);
  return Buffer.concat([len, t, d, crc]);
}

function encodePNG(size, pixels) {
  const SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA

  const rows = [];
  for (let y = 0; y < size; y++) {
    rows.push(Buffer.from([0])); // filter: None
    rows.push(Buffer.from(pixels.buffer, y * size * 4, size * 4));
  }
  const idat = deflateSync(Buffer.concat(rows), { level: 6 });
  return Buffer.concat([SIG, pngChunk("IHDR", ihdr), pngChunk("IDAT", idat), pngChunk("IEND", Buffer.alloc(0))]);
}

// ---------------------------------------------------------------------------
// Pixel-art glyphs (5 wide × 9 tall)
// ---------------------------------------------------------------------------

const GLYPH = {
  S: [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,0],
    [0,1,1,1,0],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
    [0,0,0,0,0],
  ],
  T: [
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,0,0,0],
  ],
};

function setPixel(pixels, size, x, y, r, g, b, a = 255) {
  if (x < 0 || x >= size || y < 0 || y >= size) return;
  const i = (y * size + x) * 4;
  pixels[i] = r; pixels[i + 1] = g; pixels[i + 2] = b; pixels[i + 3] = a;
}

function drawGlyph(pixels, size, glyph, ox, oy, scale, r, g, b) {
  for (let row = 0; row < glyph.length; row++) {
    for (let col = 0; col < glyph[row].length; col++) {
      if (!glyph[row][col]) continue;
      for (let dy = 0; dy < scale; dy++)
        for (let dx = 0; dx < scale; dx++)
          setPixel(pixels, size, ox + col * scale + dx, oy + row * scale + dy, r, g, b);
    }
  }
}

// ---------------------------------------------------------------------------
// Icon renderer
// ---------------------------------------------------------------------------

function createIcon(size) {
  const pixels = new Uint8Array(size * size * 4);

  // Background: white #fafafa
  const [bgR, bgG, bgB] = [250, 250, 250];
  for (let i = 0; i < size * size; i++) {
    pixels[i * 4]     = bgR;
    pixels[i * 4 + 1] = bgG;
    pixels[i * 4 + 2] = bgB;
    pixels[i * 4 + 3] = 255;
  }

  // Centered rounded-rectangle background: dark grey #3a3a3a
  const [fgR, fgG, fgB] = [58, 58, 58];
  const pad = Math.round(size * 0.1);   // 10% padding from edge
  const rx = Math.round(size * 0.22);   // corner radius ≈ 22%

  for (let y = pad; y < size - pad; y++) {
    for (let x = pad; x < size - pad; x++) {
      // Signed distances to the rounded-rect corners
      const dx = Math.max(pad + rx - x, x - (size - pad - rx), 0);
      const dy = Math.max(pad + rx - y, y - (size - pad - rx), 0);
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= rx) {
        // Antialiased edge
        const alpha = Math.min(1, rx - dist + 0.5);
        const a = Math.round(alpha * 255);
        const i = (y * size + x) * 4;
        pixels[i]     = Math.round(fgR * alpha + bgR * (1 - alpha));
        pixels[i + 1] = Math.round(fgG * alpha + bgG * (1 - alpha));
        pixels[i + 2] = Math.round(fgB * alpha + bgB * (1 - alpha));
        pixels[i + 3] = a;
      }
    }
  }

  // Draw "ST" in white, centered on the dark rect
  const COLS = 5; const ROWS = 9;
  const gap = Math.max(1, Math.round(size * 0.03));
  const scale = Math.max(1, Math.floor((size * 0.38) / ROWS));
  const textW = COLS * scale * 2 + gap;
  const textH = ROWS * scale;
  const ox = Math.round((size - textW) / 2);
  const oy = Math.round((size - textH) / 2);

  drawGlyph(pixels, size, GLYPH.S, ox,                         oy, scale, 255, 255, 255);
  drawGlyph(pixels, size, GLYPH.T, ox + COLS * scale + gap,    oy, scale, 255, 255, 255);

  return encodePNG(size, pixels);
}

// ---------------------------------------------------------------------------
// Generate files
// ---------------------------------------------------------------------------

const iconsDir = "public/icons";
if (!existsSync(iconsDir)) mkdirSync(iconsDir, { recursive: true });

for (const { file, size } of [
  { file: "icon-192x192.png",          size: 192 },
  { file: "icon-512x512.png",          size: 512 },
  { file: "icon-maskable-192x192.png", size: 192 },
  { file: "icon-maskable-512x512.png", size: 512 },
  { file: "apple-touch-icon.png",      size: 180 },
]) {
  writeFileSync(`${iconsDir}/${file}`, createIcon(size));
  console.log(`✓  ${iconsDir}/${file}  (${size}x${size})`);
}

// Favicon (16x16 PNG wrapped in minimal ICO)
const png16 = createIcon(16);
const icoHeader = Buffer.from([0, 0, 1, 0, 1, 0]);
const dir = Buffer.alloc(16);
dir[0] = 16; dir[1] = 16;
dir.writeUInt16LE(1, 4); dir.writeUInt16LE(32, 6);
dir.writeUInt32LE(png16.length, 8);
dir.writeUInt32LE(22, 12);
writeFileSync("public/favicon.ico", Buffer.concat([icoHeader, dir, png16]));
console.log("✓  public/favicon.ico  (16x16)");
console.log("\nDone!");
