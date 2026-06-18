#!/usr/bin/env node
// Simple script to generate placeholder PWA icons
// Run: node scripts/generate-icons.js
// For production, replace with actual icons

const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate minimal SVG-based placeholder PNGs using canvas
// In production, use a proper icon generation tool
console.log(`Icons directory: ${iconsDir}`);
console.log('Place your PNG icons at these paths:');
sizes.forEach((size) => {
  console.log(`  public/icons/icon-${size}x${size}.png`);
});
console.log('\nRecommended tools: sharp, jimp, or https://realfavicongenerator.net');
