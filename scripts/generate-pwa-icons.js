// scripts/generate-pwa-icons.js
// Run with: node scripts/generate-pwa-icons.js
// Requires sharp to be installed (already in package.json)

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sizes = [
  { size: 192, name: "icon-192x192.png" },
  { size: 512, name: "icon-512x512.png" },
  { size: 192, name: "icon-maskable-192x192.png", maskable: true },
  { size: 512, name: "icon-maskable-512x512.png", maskable: true },
];

const publicDir = path.join(__dirname, "..", "public");

// Create a simple icon SVG programmatically
const createIconSvg = (size, maskable = false) => {
  const padding = maskable ? size * 0.1 : 0;
  const innerSize = size - padding * 2;
  const rx = maskable ? 0 : Math.round(size * 0.2);

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="${rx}" fill="#0a0a0a"/>
      <g transform="translate(${padding}, ${padding})">
        <text 
          x="${innerSize / 2}" 
          y="${innerSize / 2 + innerSize * 0.12}" 
          font-family="Arial, sans-serif" 
          font-size="${innerSize * 0.4}" 
          font-weight="bold" 
          fill="white" 
          text-anchor="middle"
        >IO</text>
      </g>
    </svg>
  `;
};

async function generateIcons() {
  console.log("Generating PWA icons...");

  for (const { size, name, maskable } of sizes) {
    const svgBuffer = Buffer.from(createIconSvg(size, maskable));

    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, name));

    console.log(`Generated: ${name}`);
  }

  console.log("All PWA icons generated successfully!");
}

generateIcons().catch(console.error);
