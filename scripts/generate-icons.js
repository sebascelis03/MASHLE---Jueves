import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcInput = Buffer.concat([typeBuf, data]);
  const crcVal = Buffer.alloc(4);
  crcVal.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([len, typeBuf, data, crcVal]);
}

function createPng(size, primaryColor, secondaryColor) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr.writeUInt8(8, 8); // 8 bits per channel
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw image data with filter byte 0 at start of each scanline
  const raw = Buffer.alloc(size * (1 + size * 4));
  let offset = 0;
  const radius = size / 2;
  const cx = size / 2;
  const cy = size / 2;

  for (let y = 0; y < size; y++) {
    raw.writeUInt8(0, offset++); // Filter type 0 (None)
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Rounded card or icon shape
      const isInIcon = Math.abs(dx) < (size * 0.42) && Math.abs(dy) < (size * 0.42);
      const isTopBar = isInIcon && dy < -(size * 0.2);
      const isCalendarBody = isInIcon && dy >= -(size * 0.2);

      let r = 30, g = 41, b = 59, a = 255; // Background #1e293b

      // Gradient background
      const ratio = y / size;
      r = Math.floor(37 * (1 - ratio) + 99 * ratio);
      g = Math.floor(99 * (1 - ratio) + 102 * ratio);
      b = Math.floor(235 * (1 - ratio) + 241 * ratio);

      if (isTopBar) {
        r = 15; g = 23; b = 42; // Dark header
      } else if (isCalendarBody) {
        // Inner calendar white/light surface
        if (Math.abs(dx) < (size * 0.38) && dy < (size * 0.38)) {
          r = 248; g = 250; b = 252;
          // Accent dot or check
          if ((Math.abs(dx) < 6 && Math.abs(dy) < 6) || (x % 20 < 6 && y % 20 < 6 && dy > 0)) {
            r = 59; g = 130; b = 246; // Blue dot
          }
        }
      }

      raw.writeUInt8(r, offset++);
      raw.writeUInt8(g, offset++);
      raw.writeUInt8(b, offset++);
      raw.writeUInt8(a, offset++);
    }
  }

  const compressed = zlib.deflateSync(raw);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const outDir = path.resolve('public');
fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), createPng(192));
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), createPng(512));
console.log('PWA PNG icons generated successfully!');
