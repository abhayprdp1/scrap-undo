const fs = require('fs');
const path = require('path');

function generateIco() {
  const width = 32;
  const height = 32;
  const bpp = 32;
  
  // Create 32x32 RGBA buffer (bottom-up for BMP)
  const pixelData = Buffer.alloc(width * height * 4);
  
  // Helper to set pixel (x, y) where y=0 is top, x=0 is left
  function setPixel(x, y, r, g, b, a) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    // BMP stores pixels bottom to top: row 0 is the bottom row
    const bmpY = (height - 1 - y);
    const idx = (bmpY * width + x) * 4;
    pixelData[idx] = b;     // Blue
    pixelData[idx + 1] = g; // Green
    pixelData[idx + 2] = r; // Red
    pixelData[idx + 3] = a; // Alpha
  }

  // Draw rounded rectangle with emerald green gradient
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Corner radius = 7
      let inBounds = true;
      const r = 7;
      if (x < r && y < r && Math.hypot(x - r, y - r) > r) inBounds = false;
      if (x >= width - r && y < r && Math.hypot(x - (width - 1 - r), y - r) > r) inBounds = false;
      if (x < r && y >= height - r && Math.hypot(x - r, y - (height - 1 - r)) > r) inBounds = false;
      if (x >= width - r && y >= height - r && Math.hypot(x - (width - 1 - r), y - (height - 1 - r)) > r) inBounds = false;
      
      if (inBounds) {
        // Gradient from #008f39 (bottom) to #00C853 (top)
        const t = y / height;
        const red = Math.round(0);
        const green = Math.round(200 * (1 - t * 0.3));
        const blue = Math.round(83 * (1 - t * 0.3));
        setPixel(x, y, red, green, blue, 255);
      } else {
        setPixel(x, y, 0, 0, 0, 0);
      }
    }
  }

  // Draw 3 white recycling arrows inside
  // Simple crisp white arrows pattern
  // Arrow 1: top horizontal going right, angled down
  for (let x = 11; x <= 21; x++) {
    setPixel(x, 10, 255, 255, 255, 255);
    setPixel(x, 11, 255, 255, 255, 255);
  }
  setPixel(20, 9, 255, 255, 255, 255);
  setPixel(21, 9, 255, 255, 255, 255);
  setPixel(20, 12, 255, 255, 255, 255);
  setPixel(21, 13, 255, 255, 255, 255);
  setPixel(22, 12, 255, 255, 255, 255);

  // Arrow 2: right vertical going down, angled left
  for (let y = 12; y <= 21; y++) {
    setPixel(22, y, 255, 255, 255, 255);
    setPixel(21, y, 255, 255, 255, 255);
  }
  setPixel(20, 20, 255, 255, 255, 255);
  setPixel(19, 21, 255, 255, 255, 255);
  setPixel(23, 20, 255, 255, 255, 255);
  setPixel(20, 22, 255, 255, 255, 255);

  // Arrow 3: bottom/left going up
  for (let x = 11; x <= 20; x++) {
    setPixel(x, 21, 255, 255, 255, 255);
    setPixel(x, 22, 255, 255, 255, 255);
  }
  for (let y = 12; y <= 21; y++) {
    setPixel(10, y, 255, 255, 255, 255);
    setPixel(11, y, 255, 255, 255, 255);
  }
  setPixel(9, 13, 255, 255, 255, 255);
  setPixel(8, 14, 255, 255, 255, 255);
  setPixel(12, 13, 255, 255, 255, 255);
  setPixel(13, 14, 255, 255, 255, 255);

  // 1-bit AND mask (32 rows of 4 bytes = 128 bytes)
  const andMask = Buffer.alloc(128, 0);

  // BMP Header (BITMAPINFOHEADER = 40 bytes)
  const bih = Buffer.alloc(40);
  bih.writeUInt32LE(40, 0);          // biSize
  bih.writeInt32LE(width, 4);         // biWidth
  bih.writeInt32LE(height * 2, 8);    // biHeight (x2 for ICO BMP format)
  bih.writeUInt16LE(1, 12);           // biPlanes
  bih.writeUInt16LE(bpp, 14);         // biBitCount
  bih.writeUInt32LE(0, 16);           // biCompression (BI_RGB)
  bih.writeUInt32LE(pixelData.length + andMask.length, 20); // biSizeImage
  bih.writeInt32LE(0, 24);            // biXPelsPerMeter
  bih.writeInt32LE(0, 28);            // biYPelsPerMeter
  bih.writeUInt32LE(0, 32);           // biClrUsed
  bih.writeUInt32LE(0, 36);           // biClrImportant

  const imageBuffer = Buffer.concat([bih, pixelData, andMask]);

  // ICO Header (6 bytes)
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Type 1 = ICO
  icoHeader.writeUInt16LE(1, 4); // 1 Image

  // ICO Directory Entry (16 bytes)
  const dirEntry = Buffer.alloc(16);
  dirEntry.writeUInt8(width, 0);       // Width
  dirEntry.writeUInt8(height, 1);      // Height
  dirEntry.writeUInt8(0, 2);           // Color count (0 for 32bpp)
  dirEntry.writeUInt8(0, 3);           // Reserved
  dirEntry.writeUInt16LE(1, 4);        // Planes
  dirEntry.writeUInt16LE(bpp, 6);      // Bits per pixel
  dirEntry.writeUInt32LE(imageBuffer.length, 8); // Size of image data
  dirEntry.writeUInt32LE(6 + 16, 12);  // Offset of image data (after header + dir)

  const finalIco = Buffer.concat([icoHeader, dirEntry, imageBuffer]);
  
  const targetPath = path.join(__dirname, 'src', 'app', 'favicon.ico');
  fs.writeFileSync(targetPath, finalIco);
  console.log('Successfully written new recycle favicon.ico to:', targetPath);
}

generateIco();
