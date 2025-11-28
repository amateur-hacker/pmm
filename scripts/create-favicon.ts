import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Create a canvas for the favicon
const size = 32;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');

// Set background (optional - you can make it transparent)
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, size, size);

// Draw a simplified handshake icon
ctx.fillStyle = '#2563eb'; // Use the primary color
ctx.font = `${size * 0.6}px Arial`;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// Draw a simple handshake symbol or text
// For this example, I'll draw a simple "H" to represent Handshake
ctx.fillText('🤝', size / 2, size / 2);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
const outputPath = join(process.cwd(), 'public', 'favicon.png');
writeFileSync(outputPath, buffer);

console.log('Favicon created at public/favicon.png');