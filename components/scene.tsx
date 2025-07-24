"use client";

import { useRef, useEffect } from "react";
import useSpline from "@splinetool/r3f-spline";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { Mesh, Group } from "three";

export default function Scene({
  rotationState,
  currentState,
}: {
  rotationState: { rotateY: number; rotateX: number; rotateZ: number };
  currentState: number;
}) {
  const houseRef = useRef<Group>(null);

  useEffect(() => {
    if (houseRef.current) {
      // Animate to new rotation state
      const targetRotationY = (rotationState.rotateY * Math.PI) / 180;
      const targetRotationX = (rotationState.rotateX * Math.PI) / 180;
      const targetRotationZ = (rotationState.rotateZ * Math.PI) / 180;

      // Smooth transition to new rotation
      const animate = () => {
        if (houseRef.current) {
          houseRef.current.rotation.y +=
            (targetRotationY - houseRef.current.rotation.y) * 0.1;
          houseRef.current.rotation.x +=
            (targetRotationX - houseRef.current.rotation.x) * 0.1;
          houseRef.current.rotation.z +=
            (targetRotationZ - houseRef.current.rotation.z) * 0.1;
        }
        requestAnimationFrame(animate);
      };
      animate();
    }
  }, [rotationState]);

  const { nodes, materials } = useSpline(
    "https://prod.spline.design/VclDxkUtIXJcxYUs/scene.splinecode"
  );

  return (
    <>
      <OrbitControls
        enableRotate={false}
        enablePan={false}
        enableZoom={false}
      />
      <group dispose={null}>
        <scene name="Scene">
          <group name="House_04" ref={houseRef}>
            <group
              name="window"
              position={[1.71, 71.47, 122.69]}
              rotation={[0, 0, 0]}
              scale={0.68}
            >
              <mesh
                name="wood"
                geometry={nodes.wood.geometry}
                material={nodes.wood.material}
                castShadow
                receiveShadow
              />
              <mesh
                name="glass"
                geometry={nodes.glass.geometry}
                material={nodes.glass.material}
                castShadow
                receiveShadow
                position={[0.51, -5.32, 0.78]}
              />
            </group>
            <mesh
              name="rod"
              geometry={nodes.rod.geometry}
              material={nodes.rod.material}
              castShadow
              receiveShadow
              position={[-47.42, 62.04, 169.81]}
              rotation={[0, 0, 0]}
              scale={0.68}
            />
            <group
              name="door"
              position={[-50.99, 59.4, 136.19]}
              rotation={[0, 0, 0]}
              scale={0.68}
            >
              <mesh
                name="door-wood"
                geometry={nodes["door-wood"].geometry}
                material={nodes["door-wood"].material}
                castShadow
                receiveShadow
                position={[1.07, 0, -6.81]}
                rotation={[0, 0, 0]}
                scale={0.75}
              />
              <mesh
                name="glass1"
                geometry={nodes.glass1.geometry}
                material={nodes.glass1.material}
                castShadow
                receiveShadow
                position={[77.74, 12.36, -19.01]}
              />
            </group>
            <mesh
              name="roof"
              geometry={nodes.roof.geometry}
              material={nodes.roof.material}
              castShadow
              receiveShadow
              position={[0, 175.83, 0]}
              rotation={[0, 0, 0]}
              scale={0.68}
            />
            <mesh
              name="body"
              geometry={nodes.body.geometry}
              material={nodes.body.material}
              castShadow
              receiveShadow
              position={[4.03, 114.44, 0]}
              rotation={[0, 0, 0]}
              scale={0.68}
            />
          </group>
          <directionalLight
            name="Directional Light"
            castShadow
            intensity={0.7}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={-10000}
            shadow-camera-far={100000}
            shadow-camera-left={-500}
            shadow-camera-right={500}
            shadow-camera-top={500}
            shadow-camera-bottom={-500}
            position={[200, 300, 300]}
          />
          {/* @ts-ignore */}
          <OrthographicCamera
            name="1"
            makeDefault={true}
            far={10000}
            near={-50000}
            position={[100, 100, 100]}
            zoom={0.5}
          />
          {/* <hemisphereLight
            name="Default Ambient Light"
            intensity={0.75}
            color="#eaeaea"
          /> */}
          <hemisphereLight
            name="Default Ambient Light"
            intensity={0.75}
            color="#7E7E7E"
          />
        </scene>
      </group>
    </>
  );
}
