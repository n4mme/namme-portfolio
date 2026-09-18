import React, { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody, useSphericalJoint, BallCollider, CuboidCollider } from '@react-three/rapier';
import { createLanyardTexture, createFrontCardTexture, createBackCardTexture } from './cardTextures';

// Helper function to dynamically generate and update the Catmull-Rom ribbon band mesh
function updateRibbonMesh(geometry, curve, numSegments = 40, ribbonWidth = 0.16) {
  const points = curve.getPoints(numSegments);
  const tangents = [];
  for (let i = 0; i <= numSegments; i++) {
    tangents.push(curve.getTangent(i / numSegments));
  }

  const positions = new Float32Array((numSegments + 1) * 2 * 3);
  const uvs = new Float32Array((numSegments + 1) * 2 * 2);
  const normals = new Float32Array((numSegments + 1) * 2 * 3);
  const up = new THREE.Vector3(0, 0, 1);

  for (let i = 0; i <= numSegments; i++) {
    const p = points[i];
    const t = tangents[i];
    const binormal = new THREE.Vector3().crossVectors(t, up).normalize();
    if (binormal.lengthSq() < 0.0001) {
      binormal.set(1, 0, 0);
    }
    const offset = binormal.multiplyScalar(ribbonWidth / 2);

    // Left vertex
    positions[i * 6 + 0] = p.x - offset.x;
    positions[i * 6 + 1] = p.y - offset.y;
    positions[i * 6 + 2] = p.z - offset.z;

    // Right vertex
    positions[i * 6 + 3] = p.x + offset.x;
    positions[i * 6 + 4] = p.y + offset.y;
    positions[i * 6 + 5] = p.z + offset.z;

    // UVs
    const u = i / numSegments;
    uvs[i * 4 + 0] = u;
    uvs[i * 4 + 1] = 0;
    uvs[i * 4 + 2] = u;
    uvs[i * 4 + 3] = 1;

    // Normal
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
      // Double sided faces
      indices.push(a, b, c);
      indices.push(b, d, c);
      indices.push(c, b, a);
      indices.push(c, d, b);
    }
    geometry.setIndex(indices);
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();
}

/**
 * 3D Physics Lanyard Rig Component (Runs inside <Physics>)
 */
function LanyardPhysicsRig({ textures, onPointerOver, onPointerOut }) {
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

  // Catmull-Rom curve connecting fixed anchor -> joints -> card top clip
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 4.2, 0),
        new THREE.Vector3(0.3, 3.2, 0),
        new THREE.Vector3(0.3, 2.2, 0),
        new THREE.Vector3(0.3, 1.2, 0),
        new THREE.Vector3(0.3, 0.8, 0),
      ]),
    []
  );

  const ribbonGeometry = useMemo(() => new THREE.BufferGeometry(), []);

  // Connect physics joints using Spherical Joint chains
  useSphericalJoint(fixed, j1, [
    [0, 0, 0],
    [0, 0.9, 0],
  ]);
  useSphericalJoint(j1, j2, [
    [0, 0, 0],
    [0, 0.9, 0],
  ]);
  useSphericalJoint(j2, j3, [
    [0, 0, 0],
    [0, 0.9, 0],
  ]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.48, 0],
  ]);

  // Handle pointer down on card
  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);

    if (card.current) {
      // Calculate intersection on z=0 plane
      raycaster.setFromCamera(e.pointer, e.camera);
      raycaster.ray.intersectPlane(dragPlane, planeIntersect);
      const cardPos = card.current.translation();
      dragOffset.current.set(cardPos.x, cardPos.y, cardPos.z).sub(planeIntersect);

      // Wake up physics simulation
      card.current.wakeUp();
      j1.current?.wakeUp();
      j2.current?.wakeUp();
      j3.current?.wakeUp();
    }
  };

  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);
      card.current?.wakeUp();
    }
  };

  // Global pointer up listener
  useEffect(() => {
    const onUp = () => {
      if (isDragging) {
        setIsDragging(false);
        card.current?.wakeUp();
      }
    };
    window.addEventListener('pointerup', onUp);
    return () => window.removeEventListener('pointerup', onUp);
  }, [isDragging]);

  // Frame loop: updates curve ribbon and dragging physics
  useFrame((state) => {
    if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current) return;

    // Handle interactive drag in 3D
    if (isDragging) {
      raycaster.setFromCamera(state.pointer, state.camera);
      raycaster.ray.intersectPlane(dragPlane, planeIntersect);
      targetPos.copy(planeIntersect).add(dragOffset.current);

      // Bound drag limits for realism
      targetPos.x = THREE.MathUtils.clamp(targetPos.x, -3.5, 3.5);
      targetPos.y = THREE.MathUtils.clamp(targetPos.y, -3.0, 3.0);

      card.current.setNextKinematicTranslation(targetPos);
      card.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    } else {
      // Gentle micro-tilt hover response when not dragging
      if (card.current) {
        card.current.applyTorqueImpulse(
          {
            x: state.pointer.y * 0.0003,
            y: state.pointer.x * 0.0003,
            z: 0,
          },
          true
        );
      }
    }

    // Update CatmullRom curve points from physics rigid bodies
    const pFixed = fixed.current.translation();
    const pJ1 = j1.current.translation();
    const pJ2 = j2.current.translation();
    const pJ3 = j3.current.translation();
    const pCard = card.current.translation();

    // Clip position at top slot of card
    const cardRot = card.current.rotation();
    const q = new THREE.Quaternion(cardRot.x, cardRot.y, cardRot.z, cardRot.w);
    const clipOffset = new THREE.Vector3(0, 1.4, 0).applyQuaternion(q);
    const pClip = new THREE.Vector3(pCard.x, pCard.y, pCard.z).add(clipOffset);

    curve.points[0].set(pFixed.x, pFixed.y, pFixed.z);
    curve.points[1].set(pJ1.x, pJ1.y, pJ1.z);
    curve.points[2].set(pJ2.x, pJ2.y, pJ2.z);
    curve.points[3].set(pJ3.x, pJ3.y, pJ3.z);
    curve.points[4].copy(pClip);

    // Re-generate dynamic ribbon mesh along curve
    if (ribbonGeometry) {
      updateRibbonMesh(ribbonGeometry, curve, 36, 0.15);
    }
  });

  // Materials for 6 sides of card box geometry
  const cardMaterials = useMemo(() => {
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: '#27272a',
      roughness: 0.3,
      metalness: 0.4,
    });

    const frontMaterial = new THREE.MeshPhysicalMaterial({
      map: textures.front,
      roughness: 0.25,
      metalness: 0.05,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      reflectivity: 0.5,
    });

    const backMaterial = new THREE.MeshPhysicalMaterial({
      map: textures.back,
      roughness: 0.25,
      metalness: 0.05,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      reflectivity: 0.5,
    });

    // Box order: [+X, -X, +Y, -Y, +Z (Front), -Z (Back)]
    return [edgeMaterial, edgeMaterial, edgeMaterial, edgeMaterial, frontMaterial, backMaterial];
  }, [textures]);

  return (
    <>
      {/* 1. Dynamic Woven Ribbon Band */}
      <mesh ref={ribbonMesh} geometry={ribbonGeometry}>
        <meshStandardMaterial
          map={textures.band}
          roughness={0.65}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Top Anchor RigidBody (Fixed outside/at top of view) */}
      <RigidBody ref={fixed} type="fixed" position={[0, 4.2, 0]} />

      {/* 3. Joint Chains (Dynamic small physics links) */}
      <RigidBody
        ref={j1}
        position={[0.3, 3.2, 0]}
        colliders={false}
        linearDamping={2.5}
        angularDamping={2.5}
      >
        <BallCollider args={[0.08]} />
      </RigidBody>

      <RigidBody
        ref={j2}
        position={[0.3, 2.2, 0]}
        colliders={false}
        linearDamping={2.5}
        angularDamping={2.5}
      >
        <BallCollider args={[0.08]} />
      </RigidBody>

      <RigidBody
        ref={j3}
        position={[0.3, 1.2, 0]}
        colliders={false}
        linearDamping={2.5}
        angularDamping={2.5}
      >
        <BallCollider args={[0.08]} />
      </RigidBody>

      {/* 4. The Interactive ID Card Badge */}
      <RigidBody
        ref={card}
        position={[0.3, -0.6, 0]}
        type={isDragging ? 'kinematicPosition' : 'dynamic'}
        colliders={false}
        linearDamping={2.0}
        angularDamping={2.0}
        mass={1.5}
      >
        <CuboidCollider args={[0.8, 1.2, 0.04]} />

        {/* Grab trigger & 3D Card Group */}
        <group
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
        >
          {/* Card Body */}
          <mesh material={cardMaterials} castShadow receiveShadow>
            <boxGeometry args={[1.6, 2.4, 0.03]} />
          </mesh>

          {/* Chrome Metallic Ring in the Top Slot Hole */}
          <mesh position={[0, 1.28, 0]}>
            <torusGeometry args={[0.07, 0.016, 16, 32]} />
            <meshStandardMaterial color="#f4f4f5" metalness={0.95} roughness={0.12} />
          </mesh>

          {/* Chrome Swivel Clasp Hardware */}
          <mesh position={[0, 1.42, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.14, 16]} />
            <meshStandardMaterial color="#e4e4e7" metalness={0.95} roughness={0.15} />
          </mesh>

          {/* Swivel Clasp Lever accent */}
          <mesh position={[0.04, 1.42, 0.03]}>
            <boxGeometry args={[0.02, 0.08, 0.02]} />
            <meshStandardMaterial color="#a1a1aa" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </RigidBody>
    </>
  );
}

/**
 * Main LanyardBadge Component
 */
export default function LanyardBadge() {
  const [isHovered, setIsHovered] = useState(false);
  const [texturesReady, setTexturesReady] = useState(false);
  const [textures, setTextures] = useState({ band: null, front: null, back: null });

  // Generate high-resolution card and ribbon textures with developer photo
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
      // Fallback if image fails to load
      const band = createLanyardTexture();
      const front = createFrontCardTexture(null);
      const back = createBackCardTexture();
      setTextures({ band, front, back });
      setTexturesReady(true);
    };
  }, []);

  return (
    <div className="relative w-full h-[540px] sm:h-[620px] lg:h-[660px] flex items-center justify-center select-none overflow-visible">
      {/* Visual top lanyard extension fading behind the sticky top navigation */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-8 h-20 bg-emerald-900/60 blur-[1px] pointer-events-none z-10" />

      {/* 3D Canvas Scene */}
      {texturesReady ? (
        <Canvas
          camera={{ position: [0, 0, 12.5], fov: 25 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          className={`w-full h-full ${isHovered ? 'cursor-grab' : 'cursor-default'}`}
        >
          {/* Lighting */}
          <ambientLight intensity={1.8} />
          <directionalLight position={[5, 6, 6]} intensity={2.8} />
          <directionalLight position={[-6, 4, -4]} intensity={1.5} color="#10b981" />
          <pointLight position={[0, -2, 4]} intensity={1.2} color="#f0fdf4" />

          {/* Rapier Physics World */}
          <Physics interpolate gravity={[0, -36, 0]} timeStep={1 / 60}>
            <LanyardPhysicsRig
              textures={textures}
              onPointerOver={() => setIsHovered(true)}
              onPointerOut={() => setIsHovered(false)}
            />
          </Physics>
        </Canvas>
      ) : (
        /* Smooth loading fallback placeholder */
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-xs font-mono text-zinc-400">Loading 3D Physics Lanyard...</span>
        </div>
      )}
    </div>
  );
}
