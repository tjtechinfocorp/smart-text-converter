const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeLogo() {
  const inputPath = path.join(__dirname, '../public/main-logo-80x80.png');
  const outputPath = path.join(__dirname, '../public/main-logo-80x80-optimized.png');

  try {
    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      console.log('Input logo file not found, skipping optimization');
      return;
    }

    // Get original file size
    const originalStats = fs.statSync(inputPath);
    console.log(`Original logo size: ${(originalStats.size / 1024).toFixed(2)} KB`);

    // Optimize the logo with better compression
    await sharp(inputPath)
      .resize(80, 80, {
        kernel: sharp.kernel.lanczos3,
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: true,
        quality: 80,
      })
      .toFile(outputPath);

    // Get optimized file size
    const optimizedStats = fs.statSync(outputPath);
    console.log(`Optimized logo size: ${(optimizedStats.size / 1024).toFixed(2)} KB`);
    console.log(
      `Size reduction: ${(((originalStats.size - optimizedStats.size) / originalStats.size) * 100).toFixed(1)}%`
    );

    // Replace original with optimized version
    fs.copyFileSync(outputPath, inputPath);
    fs.unlinkSync(outputPath);

    console.log('Logo optimization completed successfully');
  } catch (error) {
    console.error('Error optimizing logo:', error);
  }
}

optimizeLogo();
