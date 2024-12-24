import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../public');
const SVG_PATH = path.join(PUBLIC_DIR, 'favicon.svg');

async function generateFavicons() {
  try {
    const svgBuffer = await fs.readFile(SVG_PATH);
    
    // Generate PNG favicons
    const sizes = [16, 32, 192, 512];
    for (const size of sizes) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(PUBLIC_DIR, size === 16 ? 'favicon-16x16.png' :
                                     size === 32 ? 'favicon-32x32.png' :
                                     `logo${size}.png`));
    }
    
    // Generate Apple Touch Icon
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
    
    // For favicon.ico, we'll just use the 32x32 PNG since modern browsers prefer PNG anyway
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(path.join(PUBLIC_DIR, 'favicon.ico'));
    
    console.log('✅ All favicon files generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();
