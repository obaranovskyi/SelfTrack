/**
 * Generates placeholder PNG icons for the PWA.
 * Run once with: node scripts/generate-icons.mjs
 *
 * Replace the generated files with your final brand icons before release.
 */

import { deflateSync } from "zlib";
import { writeFileSync, mkdirSync, existsSync } from "fs";

// CRC32 table
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  return table;
})();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, "ascii");
  const dataBytes = Buffer.isBuffer(data) ? data : Buffer.from(data);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(dataBytes.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBytes, dataBytes])), 0);
  return Buffer.concat([len, typeBytes, dataBytes, crcBuf]);
}

/**
 * Create a solid-color PNG.
 * @param {number} size - width and height in pixels
 * @param {number} r - red (0-255)
 * @param {number} g - green (0-255)
 * @param {number} b - blue (0-255)
 */
function createSolidPNG(size, r, g, b) {
  const SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // RGB color type
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // One row: filter byte (0) + RGB pixels
  const row = Buffer.alloc(1 + size * 3);
  row[0] = 0; // None filter
  for (let x = 0; x < size; x++) {
    row[1 + x * 3] = r;
    row[2 + x * 3] = g;
    row[3 + x * 3] = b;
  }

  // Repeat for all rows
  const rawData = Buffer.concat(Array.from({ length: size }, () => row));
  const compressed = deflateSync(rawData, { level: 6 });

  return Buffer.concat([SIG, chunk("IHDR", ihdr), chunk("IDAT", compressed), chunk("IEND", Buffer.alloc(0))]);
}

// Brand color: light grey #a0a0a0
const [r, g, b] = [160, 160, 160];

const iconsDir = "public/icons";
if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true });
}

const specs = [
  { file: "icon-192x192.png", size: 192 },
  { file: "icon-512x512.png", size: 512 },
  { file: "icon-maskable-192x192.png", size: 192 },
  { file: "icon-maskable-512x512.png", size: 512 },
  { file: "apple-touch-icon.png", size: 180 },
];

for (const { file, size } of specs) {
  writeFileSync(`${iconsDir}/${file}`, createSolidPNG(size, r, g, b));
  console.log(`✓  ${iconsDir}/${file}  (${size}x${size})`);
}

// Minimal favicon.ico (wraps a 16x16 PNG image)
const png16 = createSolidPNG(16, r, g, b);
const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0); // reserved
icoHeader.writeUInt16LE(1, 2); // type: ICO
icoHeader.writeUInt16LE(1, 4); // count: 1 image

const icoDirEntry = Buffer.alloc(16);
icoDirEntry[0] = 16; // width
icoDirEntry[1] = 16; // height
icoDirEntry[2] = 0;  // color count (0 = more than 256)
icoDirEntry[3] = 0;  // reserved
icoDirEntry.writeUInt16LE(1, 4); // planes
icoDirEntry.writeUInt16LE(32, 6); // bit count
icoDirEntry.writeUInt32LE(png16.length, 8); // bytes in resource
icoDirEntry.writeUInt32LE(22, 12); // offset of image data (6 + 16 = 22)

writeFileSync("public/favicon.ico", Buffer.concat([icoHeader, icoDirEntry, png16]));
console.log("✓  public/favicon.ico  (16x16)");

console.log("\nDone! Replace these placeholder icons with your final brand assets.");
