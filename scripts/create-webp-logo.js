const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createWebPLogo() {
  const inputPath = path.join(__dirname, '../public/main-logo-80x80.png');
  const outputPath = path.join(__dirname, '../public/main-logo-80x80.webp');

  try {
    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      console.log('Input logo file not found, skipping WebP creation');
      return;
    }

    // Get original file size
    const originalStats = fs.statSync(inputPath);
    console.log(`Original PNG size: ${(originalStats.size / 1024).toFixed(2)} KB`);

    // Create WebP version
    await sharp(inputPath)
      .webp({
        quality: 85,
        effort: 6,
        lossless: false,
      })
      .toFile(outputPath);

    // Get WebP file size
    const webpStats = fs.statSync(outputPath);
    console.log(`WebP logo size: ${(webpStats.size / 1024).toFixed(2)} KB`);
    console.log(
      `Size reduction: ${(((originalStats.size - webpStats.size) / originalStats.size) * 100).toFixed(1)}%`
    );

    console.log('WebP logo creation completed successfully');
  } catch (error) {
    console.error('Error creating WebP logo:', error);
  }
}

createWebPLogo();
