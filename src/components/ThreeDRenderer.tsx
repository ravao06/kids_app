import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ThreeDRendererProps {
  modelType: string | null;
}

const ThreeDRenderer: React.FC<ThreeDRendererProps> = ({ modelType }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const objectRef = useRef<THREE.Group | THREE.Mesh | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (objectRef.current) {
        objectRef.current.rotation.y += 0.01;
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Update 3D model based on recognition
  useEffect(() => {
    if (!sceneRef.current) return;
    
    // Remove previous object if exists
    if (objectRef.current) {
      sceneRef.current.remove(objectRef.current);
      objectRef.current = null;
    }
    
    if (!modelType) return;
    
    // Create new object based on recognized type
    const color = new THREE.Color(0x8B5CF6); // Purple color
    
    switch(modelType.toLowerCase()) {
      case 'maison': {
        // Create a house group
        const houseGroup = new THREE.Group();
        
        // House body (cube)
        const houseBody = new THREE.Mesh(
          new THREE.BoxGeometry(2, 1.5, 2),
          new THREE.MeshPhongMaterial({ color: new THREE.Color(0x8B5CF6) })
        );
        houseBody.position.y = -0.25;
        houseGroup.add(houseBody);
        
        // Roof (pyramid)
        const roof = new THREE.Mesh(
          new THREE.ConeGeometry(1.5, 1, 4),
          new THREE.MeshPhongMaterial({ color: new THREE.Color(0x6D28D9) })
        );
        roof.position.y = 1;
        roof.rotation.y = Math.PI / 4; // Rotate to align with house
        houseGroup.add(roof);
        
        // Door
        const door = new THREE.Mesh(
          new THREE.PlaneGeometry(0.5, 0.8),
          new THREE.MeshPhongMaterial({ color: new THREE.Color(0x4C1D95) })
        );
        door.position.set(0, -0.35, 1.01);
        houseGroup.add(door);
        
        // Windows
        const windowMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color(0xC4B5FD) });
        
        const window1 = new THREE.Mesh(
          new THREE.PlaneGeometry(0.4, 0.4),
          windowMaterial
        );
        window1.position.set(-0.6, 0, 1.01);
        houseGroup.add(window1);
        
        const window2 = new THREE.Mesh(
          new THREE.PlaneGeometry(0.4, 0.4),
          windowMaterial
        );
        window2.position.set(0.6, 0, 1.01);
        houseGroup.add(window2);
        
        objectRef.current = houseGroup;
        sceneRef.current.add(houseGroup);
        break;
      }
      case 'rond': {
        // Create a circle (sphere)
        objectRef.current = new THREE.Mesh(
          new THREE.SphereGeometry(1.5, 32, 32),
          new THREE.MeshPhongMaterial({ color })
        );
        sceneRef.current.add(objectRef.current);
        break;
      }
      case 'arbre': {
        // Create a tree
        const treeGroup = new THREE.Group();
        
        // Tree trunk
        const trunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.3, 0.3, 2),
          new THREE.MeshPhongMaterial({ color: new THREE.Color(0x8B4513) })
        );
        treeGroup.add(trunk);
        
        // Tree foliage
        const foliage = new THREE.Mesh(
          new THREE.SphereGeometry(1.2, 32, 32),
          new THREE.MeshPhongMaterial({ color: new THREE.Color(0x228B22) })
        );
        foliage.position.y = 1.2;
        treeGroup.add(foliage);
        
        objectRef.current = treeGroup;
        sceneRef.current.add(treeGroup);
        break;
      }
      case 'carré': {
        objectRef.current = new THREE.Mesh(
          new THREE.BoxGeometry(2, 2, 2),
          new THREE.MeshPhongMaterial({ color })
        );
        sceneRef.current.add(objectRef.current);
        break;
      }
      case 'soleil': {
        // Sun with rays
        const sunGroup = new THREE.Group();
        
        // Center sphere
        const center = new THREE.Mesh(
          new THREE.SphereGeometry(1, 32, 32),
          new THREE.MeshPhongMaterial({ color: new THREE.Color(0xFCD34D) })
        );
        sunGroup.add(center);
        
        // Rays
        const rayMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color(0xFCD34D) });
        
        for (let i = 0; i < 8; i++) {
          const ray = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.2, 1.5),
            rayMaterial
          );
          ray.position.z = -0.75;
          ray.rotation.z = i * Math.PI / 4;
          ray.translateX(1.5);
          sunGroup.add(ray);
        }
        
        objectRef.current = sunGroup;
        sceneRef.current.add(sunGroup);
        break;
      }
      default:
        // Default shape for unrecognized objects
        objectRef.current = new THREE.Mesh(
          new THREE.DodecahedronGeometry(1.5, 0),
          new THREE.MeshPhongMaterial({ color })
        );
        sceneRef.current.add(objectRef.current);
    }
    
  }, [modelType]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[250px] rounded-lg overflow-hidden" />
  );
};

export default ThreeDRenderer;
