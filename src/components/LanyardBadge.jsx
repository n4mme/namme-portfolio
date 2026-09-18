import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody, useSphericalJoint, BallCollider, CuboidCollider } from '@react-three/rapier';
import { createLanyardTexture, createFrontCardTexture, createBackCardTexture } from './cardTextures';

/**
 * Robust ribbon mesh generator along Catmull-Rom spline
 * Uses stable 2D screen-plane normal interpolation to prevent any ribbon twisting or glitching.
 */
function updateRibbonMesh(geometry, curve, numSegments = 40, ribbonWidth = 0.16) {
  const points = curve.getPoints(numSegments);
  const tangents = [];
  for (let i = 0; i <= numSegments; i++) {
    tangents.push(curve.getTangent(i / numSegments));
  }

  const positions = new Float32Array((numSegments + 1) * 2 * 3);
  const uvs = new Float32Array((numSegments + 1) * 2 * 2);
  const normals = new Float32Array((numSegments + 1) * 2 * 3);

  for (let i = 0; i <= numSegments; i++) {
    const p = points[i];
    const t = tangents[i];

    // Compute continuous, stable binormal in XY screen plane (orthogonal to tangent)
    const bx = -t.y;
    const by = t.x;
    const bLen = Math.hypot(bx, by);
    const nx = bLen > 0.0001 ? bx / bLen : 1;
    const ny = bLen > 0.0001 ? by / bLen : 0;

    const halfW = ribbonWidth / 2;

    // Left vertex
    positions[i * 6 + 0] = p.x - nx * halfW;
    positions[i * 6 + 1] = p.y - ny * halfW;
    positions[i * 6 + 2] = p.z;

    // Right vertex
    positions[i * 6 + 3] = p.x + nx * halfW;
    positions[i * 6 + 4] = p.y + ny * halfW;
    positions[i * 6 + 5] = p.z;

    // UV coordinates
    const u = i / numSegments;
    uvs[i * 4 + 0] = u;
    uvs[i * 4 + 1] = 0;
    uvs[i * 4 + 2] = u;
    uvs[i * 4 + 3] = 1;

    // Normals pointing toward viewer (+Z)
    normals[i * 6 + 0] = 0;
    normals[i * 6 + 1] = 0;
    normals[i * 6 + 2] = 1;
    normals[i * 6 + 3] = 0;
    normals[i * 6 + 4] = 0;
    normals[i * 6 + 5] = 1;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));

  if (!geometry.index) {
    const indices = [];
    for (let i = 0; i < numSegments; i++) {
      const a = i * 2;
      const b = i * 2 + 1;
      const c = (i + 1) * 2;
      const d = (i + 1) * 2 + 1;
      // Front face
      indices.push(a, b, c);
      indices.push(b, d, c);
      // Back face
      indices.push(c, b, a);
      indices.push(c, d, b);
    }
    geometry.setIndex(indices);
  }

  geometry.attributes.position.needsUpdate = true;
}

/**
 * 3D Physics Lanyard Rig with locked Y-axis rotation and smooth drag physics
 */
function LanyardPhysicsRig({ textures, onDragChange, onHoverChange }) {
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();
  const ribbonMesh = useRef();

  const [isDragging, setIsDragging] = useState(false);
  const dragPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const dragOffset = useRef(new THREE.Vector3());
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const planeIntersect = useMemo(() => new THREE.Vector3(), []);
  const targetPos = useMemo(() => new THREE.Vector3(), []);

  // Centripetal Catmull-Rom curve from top anchor down to card clip
  const curve = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 5.5, 0),   // Top anchor extended behind top navigation
      new THREE.Vector3(0.2, 4.0, 0),
      new THREE.Vector3(0.2, 2.6, 0),
      new THREE.Vector3(0.2, 1.2, 0),
      new THREE.Vector3(0.2, 0.6, 0),
    ]);
    c.curveType = 'centripetal';
    return c;
  }, []);

  const ribbonGeometry = useMemo(() => new THREE.BufferGeometry(), []);

  // Connect physics joints using Spherical Joint chains
  useSphericalJoint(fixed, j1, [
    [0, 0, 0],
    [0, 1.1, 0],
  ]);
  useSphericalJoint(j1, j2, [
    [0, 0, 0],
    [0, 1.1, 0],
  ]);
  useSphericalJoint(j2, j3, [
    [0, 0, 0],
    [0, 1.1, 0],
  ]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.46, 0],
  ]);

  // Pointer Down on Card
  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    onDragChange?.(true);

    if (card.current) {
      raycaster.setFromCamera(e.pointer, e.camera);
      raycaster.ray.intersectPlane(dragPlane, planeIntersect);
      const cardPos = card.current.translation();
      dragOffset.current.set(cardPos.x, cardPos.y, cardPos.z).sub(planeIntersect);

      card.current.wakeUp();
      j1.current?.wakeUp();
      j2.current?.wakeUp();
      j3.current?.wakeUp();
    }
  };

  const handlePointerUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onDragChange?.(false);
      card.current?.wakeUp();
    }
  }, [isDragging, onDragChange]);

  useEffect(() => {
    const onUp = () => handlePointerUp();
    window.addEventListener('pointerup', onUp);
    return () => window.removeEventListener('pointerup', onUp);
  }, [handlePointerUp]);

  // Animation & Physics Frame Loop
  useFrame((state) => {
    if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current) return;

    // 1. Interactive 3D Dragging
    if (isDragging) {
      raycaster.setFromCamera(state.pointer, state.camera);
      raycaster.ray.intersectPlane(dragPlane, planeIntersect);
      targetPos.copy(planeIntersect).add(dragOffset.current);

      // Bound drag limits within hero display area
      targetPos.x = THREE.MathUtils.clamp(targetPos.x, -3.2, 5.0);
      targetPos.y = THREE.MathUtils.clamp(targetPos.y, -3.2, 3.2);

      card.current.setNextKinematicTranslation(targetPos);
      card.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    } else {
      // Gentle subtle hover micro-tilt (X and Z only, never Y)
      card.current.applyTorqueImpulse(
        {
          x: state.pointer.y * 0.0003,
          y: 0, // Zero Y torque
          z: -state.pointer.x * 0.0002,
        },
        true
      );
    }

    // 2. ENFORCE FRONT-FACING ORIENTATION (Strictly lock Y-axis rotation)
    const rot = card.current.rotation();
    if (Math.abs(rot.y) > 0.002) {
      // Extract Euler, zero out Y, and reapply quaternion
      const euler = new THREE.Euler().setFromQuaternion(
        new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w),
        'YXZ'
      );
      euler.y = 0;
      const q = new THREE.Quaternion().setFromEuler(euler);
      card.current.setRotation({ x: q.x, y: 0, z: q.z, w: q.w }, true);
      // Zero out any angular velocity on Y
      const avel = card.current.angvel();
      card.current.setAngvel({ x: avel.x, y: 0, z: avel.z }, true);
    }

    // 3. Update Catmull-Rom Ribbon Curve Points
    const pFixed = fixed.current.translation();
    const pJ1 = j1.current.translation();
    const pJ2 = j2.current.translation();
    const pJ3 = j3.current.translation();
    const pCard = card.current.translation();

    const cardRot = card.current.rotation();
    const q = new THREE.Quaternion(cardRot.x, cardRot.y, cardRot.z, cardRot.w);
    const clipOffset = new THREE.Vector3(0, 1.4, 0).applyQuaternion(q);
    const pClip = new THREE.Vector3(pCard.x, pCard.y, pCard.z).add(clipOffset);

    curve.points[0].set(pFixed.x, pFixed.y, pFixed.z);
    curve.points[1].set(pJ1.x, pJ1.y, pJ1.z);
    curve.points[2].set(pJ2.x, pJ2.y, pJ2.z);
    curve.points[3].set(pJ3.x, pJ3.y, pJ3.z);
    curve.points[4].copy(pClip);

    // Update ribbon mesh geometry without stuttering
    if (ribbonGeometry) {
      updateRibbonMesh(ribbonGeometry, curve, 36, 0.16);
    }
  });

  // Card materials: Neutral lighting to prevent any color shifting
  const cardMaterials = useMemo(() => {
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: '#10b981', // Matching website emerald accent border
      roughness: 0.35,
      metalness: 0.2,
    });

    const frontMaterial = new THREE.MeshStandardMaterial({
      map: textures.front,
      color: 0xffffff, // Pure white base to keep photo colors true
      roughness: 0.35,
      metalness: 0.05,
    });

    const backMaterial = new THREE.MeshStandardMaterial({
      map: textures.back,
      color: 0xffffff,
      roughness: 0.35,
      metalness: 0.05,
    });

    // Order: [+X, -X, +Y, -Y, +Z (Front), -Z (Back)]
    return [edgeMaterial, edgeMaterial, edgeMaterial, edgeMaterial, frontMaterial, backMaterial];
  }, [textures]);

  return (
    <>
      {/* 1. Dynamic Woven Ribbon Band */}
      <mesh ref={ribbonMesh} geometry={ribbonGeometry}>
        <meshStandardMaterial
          map={textures.band}
          roughness={0.7}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Fixed Anchor at absolute top */}
      <RigidBody ref={fixed} type="fixed" position={[0, 5.5, 0]} />

      {/* 3. Small joint chain links */}
      <RigidBody
        ref={j1}
        position={[0.2, 4.0, 0]}
        colliders={false}
        linearDamping={2.5}
        angularDamping={3.0}
        enabledRotations={[true, false, true]}
      >
        <BallCollider args={[0.08]} />
      </RigidBody>

      <RigidBody
        ref={j2}
        position={[0.2, 2.6, 0]}
        colliders={false}
        linearDamping={2.5}
        angularDamping={3.0}
        enabledRotations={[true, false, true]}
      >
        <BallCollider args={[0.08]} />
      </RigidBody>

      <RigidBody
        ref={j3}
        position={[0.2, 1.2, 0]}
        colliders={false}
        linearDamping={2.5}
        angularDamping={3.0}
        enabledRotations={[true, false, true]}
      >
        <BallCollider args={[0.08]} />
      </RigidBody>

      {/* 4. The Interactive ID Card Badge (Locked Y Rotation) */}
      <RigidBody
        ref={card}
        position={[0.2, -0.6, 0]}
        type={isDragging ? 'kinematicPosition' : 'dynamic'}
        colliders={false}
        linearDamping={2.0}
        angularDamping={3.5}
        mass={1.8}
        enabledRotations={[true, false, true]} // Locked Y-axis: NEVER spins or flips over
      >
        <CuboidCollider args={[0.8, 1.2, 0.04]} />

        {/* Card Group */}
        <group
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerOver={() => onHoverChange?.(true)}
          onPointerOut={() => onHoverChange?.(false)}
        >
          {/* Card Mesh with Full-Bleed Photo and Emerald Border */}
          <mesh material={cardMaterials} castShadow receiveShadow>
            <boxGeometry args={[1.6, 2.4, 0.03]} />
          </mesh>

          {/* Chrome Metallic Ring in Top Slot */}
          <mesh position={[0, 1.28, 0]}>
            <torusGeometry args={[0.07, 0.016, 16, 32]} />
            <meshStandardMaterial color="#e4e4e7" metalness={0.92} roughness={0.15} />
          </mesh>

          {/* Chrome Metallic Clasp */}
          <mesh position={[0, 1.42, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.14, 16]} />
            <meshStandardMaterial color="#d4d4d8" metalness={0.92} roughness={0.15} />
          </mesh>
        </group>
      </RigidBody>
    </>
  );
}

/**
 * Main LanyardBadge Component with Layering & Stacking Context Optimization
 */
export default function LanyardBadge() {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [texturesReady, setTexturesReady] = useState(false);
  const [textures, setTextures] = useState({ band: null, front: null, back: null });

  // Manage interactive pointer events:
  // When dragging, canvas captures all pointer events;
  // When idle, hovering over card enables drag while allowing clicks to pass through to buttons on the right.
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const profileImg = new Image();
    profileImg.src = '/profile.jpg';

    profileImg.onload = () => {
      const band = createLanyardTexture();
      const front = createFrontCardTexture(profileImg);
      const back = createBackCardTexture();
      setTextures({ band, front, back });
      setTexturesReady(true);
    };

    profileImg.onerror = () => {
      const band = createLanyardTexture();
      const front = createFrontCardTexture(null);
      const back = createBackCardTexture();
      setTextures({ band, front, back });
      setTexturesReady(true);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (isDragging) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    // Enable interaction when cursor is in the left 60% of the canvas area where badge hangs
    setInteractive(x < rect.width * 0.65 || isHovered);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[560px] sm:h-[640px] lg:h-[680px] flex items-center justify-center select-none overflow-visible -mt-16 sm:-mt-20 z-20"
    >
      {/* Visual top strap extension reaching into the top navigation bar */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-8 h-24 bg-emerald-900/60 blur-[1px] pointer-events-none z-10" />

      {texturesReady ? (
        <div
          className={`w-full h-full ${
            interactive || isDragging ? 'pointer-events-auto' : 'pointer-events-none'
          } ${isHovered ? 'cursor-grab' : 'cursor-default'}`}
        >
          <Canvas
            camera={{ position: [0, 0, 13.5], fov: 24 }}
            gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
            className="w-full h-full overflow-visible"
          >
            {/* Pure white, balanced neutral studio lighting to eliminate color shifts */}
            <ambientLight intensity={1.6} color="#ffffff" />
            <directionalLight position={[0, 5, 8]} intensity={2.2} color="#ffffff" />
            <directionalLight position={[-4, 2, -3]} intensity={0.8} color="#f4f4f5" />

            {/* Rapier Physics with extra solver iterations for zero-glitch ribbon */}
            <Physics interpolate gravity={[0, -32, 0]} numSolverIterations={12} timeStep={1 / 60}>
              <LanyardPhysicsRig
                textures={textures}
                onDragChange={(drag) => {
                  setIsDragging(drag);
                  if (drag) setInteractive(true);
                }}
                onHoverChange={(hov) => {
                  setIsHovered(hov);
                  if (hov) setInteractive(true);
                }}
              />
            </Physics>
          </Canvas>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-xs font-mono text-zinc-400">Initializing 3D Card...</span>
        </div>
      )}
    </div>
  );
}
