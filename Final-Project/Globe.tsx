/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 public/models/globe/globe.gltf -t -k -m 
Author: nenjo (https://sketchfab.com/nenjo)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/models/8a3f6e66955e41d48762d75725d3ab52
Title: Earth
*/

import * as THREE from 'three'
import React from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Earth_Surfacemat_0: THREE.Mesh
  }
  materials: {
    ['Surface.mat']: THREE.MeshStandardMaterial
  }
  animations: GLTFAction[]
}

export function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/globe.gltf') as GLTFResult
  return (
    <group {...props} dispose={null}>
      <group name="RootNode" rotation={[Math.PI / 2, 0, 0]} userData={{ name: 'RootNode' }}>
        <mesh name="Earth_Surfacemat_0" geometry={nodes.Earth_Surfacemat_0.geometry} material={materials['Surface.mat']} scale={100} userData={{ name: 'Earth_Surface.mat_0' }} />
      </group>
    </group>
  )
}

useGLTF.preload('/globe.gltf')
