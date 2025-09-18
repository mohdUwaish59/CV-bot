// Simple script to create a basic icon
// Run this in a browser console to generate icon data URLs

function createIcon(size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#059669';
  ctx.fillRect(0, 0, size, size);
  
  // Simple CV icon
  const scale = size / 128;
  
  // Document
  ctx.fillStyle = 'white';
  ctx.fillRect(20 * scale, 20 * scale, 60 * scale, 80 * scale);
  
  // Lines
  ctx.fillStyle = '#059669';
  ctx.fillRect(30 * scale, 40 * scale, 40 * scale, 2 * scale);
  ctx.fillRect(30 * scale, 50 * scale, 40 * scale, 2 * scale);
  ctx.fillRect(30 * scale, 60 * scale, 30 * scale, 2 * scale);
  
  // Plus
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(90 * scale, 90 * scale, 12 * scale, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.fillStyle = 'white';
  ctx.fillRect((90 - 6) * scale, (90 - 1) * scale, 12 * scale, 2 * scale);
  ctx.fillRect((90 - 1) * scale, (90 - 6) * scale, 2 * scale, 12 * scale);
  
  return canvas.toDataURL('image/png');
}

// Generate icons
console.log('16px:', createIcon(16));
console.log('32px:', createIcon(32));
console.log('48px:', createIcon(48));
console.log('128px:', createIcon(128));