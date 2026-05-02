/**
 * Generates pwa-icon-192.png and pwa-icon-512.png from pwa-icon.svg.
 * Requires sharp:  npm i -D sharp
 * Run:             node scripts/generate-pwa-icons.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, "../public");

// ── Fallback: build a minimal valid PNG filled with a solid RGBA color ──────

function uint32BE(n) {
  const b = Buffer.alloc(4);
  b.writeUInt32BE(n);
  return b;
}

function crc32(buf) {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  let crc = 0xffffffff;
  for (const byte of buf) crc = t[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (~crc) >>> 0;
}

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, "ascii");
  const crcBuf = uint32BE(crc32(Buffer.concat([typeBytes, data])));
  return Buffer.concat([uint32BE(data.length), typeBytes, data, crcBuf]);
}

function solidPng(size, r, g, b) {
  const rowBytes = 1 + size * 4; // filter byte + RGBA per pixel
  const raw = Buffer.alloc(size * rowBytes, 0);
  for (let row = 0; row < size; row++) {
    raw[row * rowBytes] = 0; // filter: None
    for (let col = 0; col < size; col++) {
      const o = row * rowBytes + 1 + col * 4;
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b; raw[o + 3] = 255;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", deflateSync(raw)),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const svgPath = resolve(publicDir, "pwa-icon.svg");
  const svgBuffer = readFileSync(svgPath);
  const sizes = [192, 512];

  let sharpFn;
  try {
    const require = createRequire(import.meta.url);
    sharpFn = require("sharp");
  } catch {
    // sharp not installed — fallback to solid-color PNG
  }

  for (const size of sizes) {
    const outPath = resolve(publicDir, `pwa-icon-${size}.png`);
    if (sharpFn) {
      await sharpFn(svgBuffer).resize(size, size).png().toFile(outPath);
      console.log(`✓  pwa-icon-${size}.png  (from SVG via sharp)`);
    } else {
      // Moss green #273f32 = rgb(39, 63, 50)
      writeFileSync(outPath, solidPng(size, 39, 63, 50));
      console.log(`✓  pwa-icon-${size}.png  (solid #273f32 fallback — install sharp for real render)`);
    }
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
