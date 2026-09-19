import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, RigidBody, useSphericalJoint, BallCollider, CuboidCollider } from '@react-three/rapier';
import { createLanyardTexture, createFrontCardTexture, createBackCardTexture } from './cardTextures';

/**
 * Dynamic ribbon mesh generator along Catmull-Rom spline
 * Uses stable 2D screen-plane normal interpolation to prevent any ribbon twisting or glitching.
 */
function updateRibbonMesh(geometry, curve, numSegments = 44, ribbonWidth = 0.22) {
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

    // Compute continuous, stable binormal in XY screen plane
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

    // UVs
    const u = i / numSegments;
    uvs[i * 4 + 0] = u;
    uvs[i * 4 + 1] = 0;
    uvs[i * 4 + 2] = u;
    uvs[i * 4 + 3] = 1;

    // Normal pointing toward camera (+Z)
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
      indices.push(a, b, c);
      indices.push(b, d, c);
      indices.push(c, b, a);
      indices.push(c, d, b);
    }
    geometry.setIndex(indices);
  }

  geometry.attributes.position.needsUpdate = true;
}

/**
 * 3D Physics Lanyard Rig with locked Y-axis rotation and full hero drag freedom
 */
function LanyardPhysicsRig({ textures, anchorX, onCardScreenPosUpdate, onDragStateChange }) {
  const { camera, size } = useThree();
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

  // Centripetal Catmull-Rom curve with anchor at absolute top
  const curve = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(anchorX, 5.8, 0),
      new THREE.Vector3(anchorX, 4.35, 0),
      new THREE.Vector3(anchorX, 2.95, 0),
      new THREE.Vector3(anchorX, 1.55, 0),
      new THREE.Vector3(anchorX, 0.95, 0),
    ]);
    c.curveType = 'centripetal';
    return c;
  }, [anchorX]);

  const ribbonGeometry = useMemo(() => new THREE.BufferGeometry(), []);

  // Connect physics joints: All sharing exact anchorX for vertical resting equilibrium
  useSphericalJoint(fixed, j1, [
    [0, 0, 0],
    [0, 1.45, 0],
  ]);
  useSphericalJoint(j1, j2, [
    [0, 0, 0],
    [0, 1.4, 0],
  ]);
  useSphericalJoint(j2, j3, [
    [0, 0, 0],
    [0, 1.4, 0],
  ]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.48, 0],
  ]);

  // Pointer Down on Card
  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    onDragStateChange?.(true);

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
      onDragStateChange?.(false);
      card.current?.wakeUp();
    }
  }, [isDragging, onDragStateChange]);

  useEffect(() => {
    const onUp = () => handlePointerUp();
    window.addEventListener('pointerup', onUp);
    return () => window.removeEventListener('pointerup', onUp);
  }, [handlePointerUp]);

  // Animation & Physics Frame Loop
  useFrame((state) => {
    if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current) return;

    // 1. Full Hero Viewport Dragging (Unclipped)
    if (isDragging) {
      raycaster.setFromCamera(state.pointer, state.camera);
      raycaster.ray.intersectPlane(dragPlane, planeIntersect);
      targetPos.copy(planeIntersect).add(dragOffset.current);

      // Wide movement bounds encompassing the entire screen
      targetPos.x = THREE.MathUtils.clamp(targetPos.x, -7.5, 7.5);
      targetPos.y = THREE.MathUtils.clamp(targetPos.y, -4.5, 4.5);

      card.current.setNextKinematicTranslation(targetPos);
      card.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    } else {
      // Subtle micro-tilt hover response
      card.current.applyTorqueImpulse(
        {
          x: state.pointer.y * 0.0003,
          y: 0,
          z: -state.pointer.x * 0.0002,
        },
        true
      );
    }

    // 2. STRICTLY LOCK Y-AXIS ROTATION (Never flips backwards)
    const rot = card.current.rotation();
    if (Math.abs(rot.y) > 0.002) {
      const euler = new THREE.Euler().setFromQuaternion(
        new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w),
        'YXZ'
      );
      euler.y = 0;
      const q = new THREE.Quaternion().setFromEuler(euler);
      card.current.setRotation({ x: q.x, y: 0, z: q.z, w: q.w }, true);
      const avel = card.current.angvel();
      card.current.setAngvel({ x: avel.x, y: 0, z: avel.z }, true);
    }

    // 3. Project Card 3D position to 2D Screen Coordinates for Hit-Testing
    const pCard = card.current.translation();
    const vCard = new THREE.Vector3(pCard.x, pCard.y, pCard.z);
    vCard.project(camera);
    const screenX = ((vCard.x + 1) / 2) * size.width;
    const screenY = ((-vCard.y + 1) / 2) * size.height;
    onCardScreenPosUpdate?.(screenX, screenY);

    // 4. Update Catmull-Rom Ribbon Spline Points
    const pFixed = fixed.current.translation();
    const pJ1 = j1.current.translation();
    const pJ2 = j2.current.translation();
    const pJ3 = j3.current.translation();

    const cardRot = card.current.rotation();
    const q = new THREE.Quaternion(cardRot.x, cardRot.y, cardRot.z, cardRot.w);
    const clipOffset = new THREE.Vector3(0, 1.4, 0).applyQuaternion(q);
    const pClip = new THREE.Vector3(pCard.x, pCard.y, pCard.z).add(clipOffset);

    curve.points[0].set(pFixed.x, pFixed.y, pFixed.z);
    curve.points[1].set(pJ1.x, pJ1.y, pJ1.z);
    curve.points[2].set(pJ2.x, pJ2.y, pJ2.z);
    curve.points[3].set(pJ3.x, pJ3.y, pJ3.z);
    curve.points[4].copy(pClip);

    // Dynamic ribbon mesh update (widened to 0.22 for bold fabric look)
    if (ribbonGeometry) {
      updateRibbonMesh(ribbonGeometry, curve, 44, 0.22);
    }
  });

  // Card materials: Neutral pure-white lighting to eliminate color shifts
  const cardMaterials = useMemo(() => {
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: '#10b981',
      roughness: 0.35,
      metalness: 0.2,
    });

    const frontMaterial = new THREE.MeshStandardMaterial({
      map: textures.front,
      color: 0xffffff,
      roughness: 0.35,
      metalness: 0.05,
    });

    const backMaterial = new THREE.MeshStandardMaterial({
      map: textures.back,
      color: 0xffffff,
      roughness: 0.35,
      metalness: 0.05,
    });

    return [edgeMaterial, edgeMaterial, edgeMaterial, edgeMaterial, frontMaterial, backMaterial];
  }, [textures]);

  return (
    <>
      {/* 1. Dynamic Woven Ribbon Band (Single dynamic mesh, zero static duplicates) */}
      <mesh ref={ribbonMesh} geometry={ribbonGeometry}>
        <meshStandardMaterial
          map={textures.band}
          roughness={0.7}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Top Anchor RigidBody (Fixed at absolute top behind nav) */}
      <RigidBody ref={fixed} type="fixed" position={[anchorX, 5.8, 0]} />

      {/* 3. Joint Chains (Aligned on anchorX) */}
      <RigidBody
        ref={j1}
        position={[anchorX, 4.35, 0]}
        colliders={false}
        linearDamping={2.5}
        angularDamping={3.0}
        enabledRotations={[true, false, true]}
      >
        <BallCollider args={[0.08]} />
      </RigidBody>

      <RigidBody
        ref={j2}
        position={[anchorX, 2.95, 0]}
        colliders={false}
        linearDamping={2.5}
        angularDamping={3.0}
        enabledRotations={[true, false, true]}
      >
        <BallCollider args={[0.08]} />
      </RigidBody>

      <RigidBody
        ref={j3}
        position={[anchorX, 1.55, 0]}
        colliders={false}
        linearDamping={2.5}
        angularDamping={3.0}
        enabledRotations={[true, false, true]}
      >
        <BallCollider args={[0.08]} />
      </RigidBody>

      {/* 4. The Interactive ID Card Badge (Resting at Y = 0.05, aligned with hero bio) */}
      <RigidBody
        ref={card}
        position={[anchorX, 0.05, 0]}
        type={isDragging ? 'kinematicPosition' : 'dynamic'}
        colliders={false}
        linearDamping={2.2}
        angularDamping={3.8}
        mass={2.0}
        enabledRotations={[true, false, true]}
      >
        <CuboidCollider args={[0.8, 1.2, 0.04]} />

        <group onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
          {/* Card Mesh: Full-bleed photo with clean emerald border */}
          <mesh material={cardMaterials} castShadow receiveShadow>
            <boxGeometry args={[1.6, 2.4, 0.03]} />
          </mesh>

          {/* Chrome Metallic Ring */}
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
 * Main LanyardBadge Component
 * - Full hero viewport canvas (absolute inset-0) to eliminate clipping
 * - Dynamic hit-testing allows dragging everywhere while preserving button clicks
 */
export default function LanyardBadge() {
  const canvasContainerRef = useRef(null);
  const cardScreenPosRef = useRef({ x: -1000, y: -1000 });
  const isDraggingRef = useRef(false);

  const [isNearCard, setIsNearCard] = useState(false);
  const [texturesReady, setTexturesReady] = useState(false);
  const [textures, setTextures] = useState({ band: null, front: null, back: null });
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  // Responsive anchor: Centered on desktop left column (-2.65), centered on mobile (0)
  const anchorX = isDesktop ? -2.65 : 0;

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load high-resolution textures
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

  // Mouse move listener: detects if cursor is near the card to enable pointer-events
  useEffect(() => {
    const handlePointerMove = (e) => {
      if (isDraggingRef.current) return;
      if (!canvasContainerRef.current) return;

      const rect = canvasContainerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const cardX = cardScreenPosRef.current.x;
      const cardY = cardScreenPosRef.current.y;

      // Hit-test radius around card (~150px)
      const dist = Math.hypot(mouseX - cardX, mouseY - cardY);
      setIsNearCard(dist < 155);
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  const handleCardScreenPosUpdate = useCallback((x, y) => {
    cardScreenPosRef.current = { x, y };
  }, []);

  const handleDragStateChange = useCallback((dragging) => {
    isDraggingRef.current = dragging;
    if (dragging) setIsNearCard(true);
  }, []);

  return (
    <div
      ref={canvasContainerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
    >
      {texturesReady ? (
        <div
          className={`w-full h-full ${
            isNearCard || isDraggingRef.current ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : 'pointer-events-none'
          }`}
        >
          <Canvas
            camera={{ position: [0, 0, 14], fov: 26 }}
            gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
            className="w-full h-full overflow-visible"
          >
            {/* Pure white neutral studio lighting */}
            <ambientLight intensity={1.7} color="#ffffff" />
            <directionalLight position={[0, 6, 8]} intensity={2.2} color="#ffffff" />
            <directionalLight position={[-4, 3, -3]} intensity={0.9} color="#f4f4f5" />

            {/* Rapier Physics World */}
            <Physics interpolate gravity={[0, -32, 0]} numSolverIterations={14} timeStep={1 / 60}>
              <LanyardPhysicsRig
                textures={textures}
                anchorX={anchorX}
                onCardScreenPosUpdate={handleCardScreenPosUpdate}
                onDragStateChange={handleDragStateChange}
              />
            </Physics>
          </Canvas>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            <span className="text-xs font-mono text-zinc-400">Loading 3D Physics Lanyard...</span>
          </div>
        </div>
      )}
    </div>
  );
}
