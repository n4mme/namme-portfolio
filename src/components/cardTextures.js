import * as THREE from 'three';

/**
 * Creates repeating fabric lanyard texture: "NAMME • NAMME • NAMME"
 */
export function createLanyardTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Deep emerald fabric weave background
  ctx.fillStyle = '#064e3b';
  ctx.fillRect(0, 0, 1024, 128);

  // Subtle fabric stitch lines
  ctx.strokeStyle = '#047857';
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, 1016, 120);

  // Repeating text
  ctx.fillStyle = '#ecfdf5';
  ctx.font = 'bold 38px "Fira Code", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const text = 'NAMME   •   NAMME   •   NAMME   •   NAMME   •   ';
  ctx.fillText(text, 512, 64);

  // Texture configuration
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 1);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates high-resolution Front Card Texture (1024 x 1500)
 */
export function createFrontCardTexture(profileImg) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1500;
  const ctx = canvas.getContext('2d');

  // 1. Dark grey background
  ctx.fillStyle = '#18181b';
  ctx.fillRect(0, 0, 1024, 1500);

  // Subtle gradient overlay
  const grad = ctx.createLinearGradient(0, 0, 1024, 1500);
  grad.addColorStop(0, 'rgba(16, 185, 129, 0.08)');
  grad.addColorStop(0.5, 'rgba(24, 24, 27, 0.95)');
  grad.addColorStop(1, 'rgba(6, 182, 212, 0.06)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1500);

  // 2. Card Border
  ctx.strokeStyle = '#27272a';
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, 984, 1460);

  // 3. Top Slot Hole Punch (visual representation)
  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.roundRect(412, 50, 200, 36, 18);
  ctx.fill();
  ctx.strokeStyle = '#3f3f46';
  ctx.lineWidth = 4;
  ctx.stroke();

  // 4. University Header
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BULACAN STATE UNIVERSITY', 512, 160);

  ctx.fillStyle = '#a1a1aa';
  ctx.font = '600 24px monospace';
  ctx.fillText('COLLEGE OF INFORMATION & COMMUNICATIONS TECH', 512, 205);

  // Divider line
  ctx.strokeStyle = '#27272a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(100, 240);
  ctx.lineTo(924, 240);
  ctx.stroke();

  // 5. Developer Photo
  const photoX = 262;
  const photoY = 290;
  const photoW = 500;
  const photoH = 500;

  // Photo border glow
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 6;
  ctx.strokeRect(photoX - 4, photoY - 4, photoW + 8, photoH + 8);

  if (profileImg && profileImg.complete) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(photoX, photoY, photoW, photoH, 16);
    ctx.clip();
    ctx.drawImage(profileImg, photoX, photoY, photoW, photoH);
    ctx.restore();
  } else {
    // Placeholder if not loaded yet
    ctx.fillStyle = '#27272a';
    ctx.fillRect(photoX, photoY, photoW, photoH);
  }

  // "DEVELOPER" Overlay Ribbon on photo
  ctx.fillStyle = '#059669';
  ctx.fillRect(photoX, photoY + photoH - 50, photoW, 50);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('★ OFFICIAL DEVELOPER PASS ★', 512, photoY + photoH - 16);

  // 6. Name & Student Details
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 58px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('EMMANUEL NANTES', 512, 880);

  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 32px monospace';
  ctx.fillText('BSIT • Web & Mobile Development', 512, 940);

  ctx.fillStyle = '#9ca3af';
  ctx.font = '500 28px sans-serif';
  ctx.fillText('Bulacan State University', 512, 990);

  // 7. Status Pill
  ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
  ctx.beginPath();
  ctx.roundRect(332, 1040, 360, 56, 28);
  ctx.fill();
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Green dot
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(370, 1068, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#6ee7b7';
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('ACTIVE CREDENTIAL', 400, 1076);

  // 8. Barcode Graphic at the Base
  const barX = 120;
  const barY = 1170;
  const barH = 120;
  const barWidths = [6, 2, 8, 2, 4, 10, 4, 2, 6, 4, 8, 2, 4, 6, 2, 4, 8, 2, 6, 4, 10, 2, 4, 6, 2, 8, 4, 6, 2, 4, 10, 4, 2, 6, 4, 8, 2, 4, 6, 2, 8, 4, 6, 2, 10];
  
  ctx.fillStyle = '#d4d4d8';
  let curX = barX;
  for (let i = 0; i < barWidths.length; i++) {
    ctx.fillRect(curX, barY, barWidths[i], barH);
    curX += barWidths[i] + 4;
  }

  // Student ID text below barcode
  ctx.fillStyle = '#71717a';
  ctx.font = '500 24px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('BSU-IT-2023-9941 // SECURE CHIP ENABLED', 512, 1340);

  // 9. Bottom Branding Seal
  ctx.fillStyle = '#059669';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('VERIFIED STUDENT IDENTITY • BULSU-CICT', 512, 1420);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates high-resolution Back Card Texture (1024 x 1500)
 */
export function createBackCardTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1500;
  const ctx = canvas.getContext('2d');

  // 1. Dark minimalist background
  ctx.fillStyle = '#141416';
  ctx.fillRect(0, 0, 1024, 1500);

  // 2. Magnetic Stripe across the top
  ctx.fillStyle = '#0a0a0c';
  ctx.fillRect(0, 120, 1024, 180);

  // 3. Card Border
  ctx.strokeStyle = '#27272a';
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, 984, 1460);

  // 4. Center Brand Logo: NAMME
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 110px "Fira Code", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('NAMME', 512, 580);

  ctx.fillStyle = '#a1a1aa';
  ctx.font = 'bold 30px monospace';
  ctx.fillText('FULL STACK & MOBILE DEVELOPER', 512, 660);

  // Center divider
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(312, 710);
  ctx.lineTo(712, 710);
  ctx.stroke();

  // 5. University Affiliation
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 32px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Bulacan State University', 512, 800);

  ctx.fillStyle = '#71717a';
  ctx.font = '500 24px monospace';
  ctx.fillText('Bachelor of Science in Information Technology', 512, 850);

  // 6. Security Microtext & QR Box
  ctx.strokeStyle = '#3f3f46';
  ctx.lineWidth = 3;
  ctx.strokeRect(402, 940, 220, 220);

  // Simulated QR graphic inside box
  ctx.fillStyle = '#10b981';
  ctx.fillRect(432, 970, 60, 60);
  ctx.fillRect(532, 970, 60, 60);
  ctx.fillRect(432, 1070, 60, 60);
  ctx.fillRect(532, 1070, 40, 40);
  ctx.fillRect(502, 1030, 20, 20);

  ctx.fillStyle = '#71717a';
  ctx.font = '400 20px monospace';
  ctx.fillText('SCAN TO VERIFY PORTFOLIO', 512, 1220);

  // 7. Footer text
  ctx.fillStyle = '#52525b';
  ctx.font = '400 18px monospace';
  ctx.fillText('PROPERTY OF BULACAN STATE UNIVERSITY • NON-TRANSFERABLE', 512, 1380);
  ctx.fillText('PORTFOLIO: NAMME.VERCEL.APP', 512, 1420);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
