import * as THREE from 'three';

/**
 * Creates repeating fabric lanyard texture: "NAMME • NAMME • NAMME"
 * Widened and optimized with bold typography and crisp stitching
 */
export function createLanyardTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 144;
  const ctx = canvas.getContext('2d');

  // Deep dark emerald fabric weave background
  ctx.fillStyle = '#064e3b';
  ctx.fillRect(0, 0, 1024, 144);

  // Bold fabric edge stitch lines
  ctx.strokeStyle = '#047857';
  ctx.lineWidth = 5;
  ctx.strokeRect(4, 4, 1016, 136);

  // Repeating woven branded text
  ctx.fillStyle = '#ecfdf5';
  ctx.font = 'bold 42px "Fira Code", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const text = 'NAMME   •   NAMME   •   NAMME   •   NAMME   •   ';
  ctx.fillText(text, 512, 72);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates full-bleed Front Card Texture (1024 x 1536)
 * - Photo covers the ENTIRE surface (full-bleed cover)
 * - Clean emerald green (#10b981) border
 * - Zero text, name labels, badges, or overlays
 * - sRGB color space to prevent color shifts
 */
export function createFrontCardTexture(profileImg) {
  const canvas = document.createElement('canvas');
  const w = 1024;
  const h = 1536;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  // 1. Base dark background
  ctx.fillStyle = '#18181b';
  ctx.fillRect(0, 0, w, h);

  // 2. Full-bleed photo covering the entire surface
  if (profileImg && profileImg.complete && profileImg.naturalWidth > 0) {
    const imgW = profileImg.naturalWidth;
    const imgH = profileImg.naturalHeight;

    // Calculate aspect ratio fill (cover entire card without distortion)
    const scale = Math.max(w / imgW, h / imgH);
    const sw = imgW * scale;
    const sh = imgH * scale;
    const sx = (w - sw) / 2;
    const sy = (h - sh) / 2;

    ctx.drawImage(profileImg, sx, sy, sw, sh);
  } else {
    // Elegant dark gradient fallback if image is still loading
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#1f2937');
    grad.addColorStop(1, '#111827');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  // 3. Clean Emerald (#10b981) Border around the card perimeter
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 24;
  ctx.strokeRect(12, 12, w - 24, h - 24);

  // Subtle inner accent line
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
  ctx.lineWidth = 6;
  ctx.strokeRect(32, 32, w - 64, h - 64);

  // 4. Subtle top slot punch cutout for lanyard clip
  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.roundRect(w / 2 - 100, 42, 200, 36, 18);
  ctx.fill();
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 6;
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates minimalist Back Card Texture (1024 x 1536)
 * - Matching emerald border and dark clean finish
 */
export function createBackCardTexture() {
  const canvas = document.createElement('canvas');
  const w = 1024;
  const h = 1536;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  // 1. Dark minimalist surface
  ctx.fillStyle = '#141416';
  ctx.fillRect(0, 0, w, h);

  // 2. Magnetic Stripe across the top
  ctx.fillStyle = '#09090b';
  ctx.fillRect(0, 140, w, 180);

  // 3. Clean Emerald (#10b981) Border
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 24;
  ctx.strokeRect(12, 12, w - 24, h - 24);

  ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
  ctx.lineWidth = 6;
  ctx.strokeRect(32, 32, w - 64, h - 64);

  // 4. Center Brand Logo: NAMME
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 110px "Fira Code", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('NAMME', w / 2, h / 2 - 40);

  ctx.fillStyle = '#a1a1aa';
  ctx.font = 'bold 28px monospace';
  ctx.fillText('FULL STACK & MOBILE DEVELOPER', w / 2, h / 2 + 40);

  // Center accent line
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 200, h / 2 + 80);
  ctx.lineTo(w / 2 + 200, h / 2 + 80);
  ctx.stroke();

  // Subtle bottom text
  ctx.fillStyle = '#52525b';
  ctx.font = '500 24px monospace';
  ctx.fillText('BULACAN STATE UNIVERSITY • BSIT', w / 2, h - 160);
  ctx.fillText('NAMME.VERCEL.APP', w / 2, h - 120);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}
