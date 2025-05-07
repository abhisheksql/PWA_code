const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
  const logoPath = path.join(__dirname, 'images', 'Acadally_Logo_colleps.svg');
  const outputPath = path.join(__dirname);

  // Generate 192x192 icon
  await sharp(logoPath)
    .resize(192, 192)
    .png()
    .toFile(path.join(outputPath, 'icon-192x192.png'));

  // Generate 512x512 icon
  await sharp(logoPath)
    .resize(512, 512)
    .png()
    .toFile(path.join(outputPath, 'icon-512x512.png'));

  console.log('Icons generated successfully!');
}

generateIcons().catch(console.error);
