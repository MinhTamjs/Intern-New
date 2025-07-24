import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Character3DProps {
  type: 'player' | 'enemy';
  enemyType?: 'goblin' | 'orc' | 'troll' | 'dark-knight';
  position: { x: number; y: number; z: number };
  isAttacking?: boolean;
  className?: string;
}

export const Character3D: React.FC<Character3DProps> = ({
  type,
  enemyType = 'goblin',
  position,
  isAttacking = false,
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const characterRef = useRef<THREE.Group | null>(null);
  const animationRef = useRef<number>();

  // Minecraft-style character colors
  const characterColors = {
    player: {
      head: 0xFFB366,    // Skin tone
      body: 0x00FF00,    // Bright green for visibility
      arms: 0xFFB366,    // Skin tone
      legs: 0x00CC00,    // Darker green
      feet: 0x654321     // Dark brown shoes
    },
    goblin: {
      head: 0x4CAF50,    // Green
      body: 0x388E3C,    // Dark green
      arms: 0x4CAF50,    // Green
      legs: 0x388E3C,    // Dark green
      feet: 0x2E7D32     // Darker green
    },
    orc: {
      head: 0x795548,    // Brown
      body: 0x6D4C41,    // Dark brown
      arms: 0x795548,    // Brown
      legs: 0x6D4C41,    // Dark brown
      feet: 0x5D4037     // Darker brown
    },
    troll: {
      head: 0x8BC34A,    // Light green
      body: 0x689F38,    // Green
      arms: 0x8BC34A,    // Light green
      legs: 0x689F38,    // Green
      feet: 0x558B2F     // Dark green
    },
    'dark-knight': {
      head: 0x424242,    // Dark gray
      body: 0x212121,    // Very dark gray
      arms: 0x424242,    // Dark gray
      legs: 0x212121,    // Very dark gray
      feet: 0x000000     // Black
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);

    // Camera setup - Closer focus
    const camera = new THREE.PerspectiveCamera(
      60, // Narrower FOV for better focus
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 4, 6);
    camera.lookAt(0, 1.5, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create character
    const character = createCharacter();
    scene.add(character);
    characterRef.current = character;

    // Store references
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Idle animation
      if (character) {
        character.rotation.y += 0.01;
        
        // Attack animation
        if (isAttacking) {
          character.children.forEach((child, index) => {
            if (index === 1 || index === 2) { // Arms
              child.rotation.x = Math.sin(Date.now() * 0.01) * 0.5;
            }
          });
        } else {
          // Gentle idle movement
          character.children.forEach((child, index) => {
            if (index === 0) { // Head
              child.rotation.y = Math.sin(Date.now() * 0.005) * 0.1;
            }
          });
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [type, enemyType, isAttacking]);

  const createCharacter = (): THREE.Group => {
    const character = new THREE.Group();
    const colors = type === 'player' ? characterColors.player : characterColors[enemyType];

    // Head
    const headGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const headMaterial = new THREE.MeshLambertMaterial({ color: colors.head });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2.3;
    head.castShadow = true;
    character.add(head);

    // Body
    const bodyGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.4);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: colors.body });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1.4;
    body.castShadow = true;
    character.add(body);

    // Arms
    const armGeometry = new THREE.BoxGeometry(0.3, 1.0, 0.3);
    const leftArmMaterial = new THREE.MeshLambertMaterial({ color: colors.arms });
    const rightArmMaterial = new THREE.MeshLambertMaterial({ color: colors.arms });
    
    const leftArm = new THREE.Mesh(armGeometry, leftArmMaterial);
    leftArm.position.set(-0.8, 1.4, 0);
    leftArm.castShadow = true;
    character.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, rightArmMaterial);
    rightArm.position.set(0.8, 1.4, 0);
    rightArm.castShadow = true;
    character.add(rightArm);

    // Legs
    const legGeometry = new THREE.BoxGeometry(0.3, 1.0, 0.3);
    const leftLegMaterial = new THREE.MeshLambertMaterial({ color: colors.legs });
    const rightLegMaterial = new THREE.MeshLambertMaterial({ color: colors.legs });
    
    const leftLeg = new THREE.Mesh(legGeometry, leftLegMaterial);
    leftLeg.position.set(-0.3, 0.5, 0);
    leftLeg.castShadow = true;
    character.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, rightLegMaterial);
    rightLeg.position.set(0.3, 0.5, 0);
    rightLeg.castShadow = true;
    character.add(rightLeg);

    // Feet
    const footGeometry = new THREE.BoxGeometry(0.4, 0.2, 0.6);
    const leftFootMaterial = new THREE.MeshLambertMaterial({ color: colors.feet });
    const rightFootMaterial = new THREE.MeshLambertMaterial({ color: colors.feet });
    
    const leftFoot = new THREE.Mesh(footGeometry, leftFootMaterial);
    leftFoot.position.set(-0.3, 0, 0.1);
    leftFoot.castShadow = true;
    character.add(leftFoot);

    const rightFoot = new THREE.Mesh(footGeometry, rightFootMaterial);
    rightFoot.position.set(0.3, 0, 0.1);
    rightFoot.castShadow = true;
    character.add(rightFoot);

    // Add equipment for player
    if (type === 'player') {
      // Sword
      const swordGeometry = new THREE.BoxGeometry(0.1, 1.2, 0.1);
      const swordMaterial = new THREE.MeshLambertMaterial({ color: 0xC0C0C0 });
      const sword = new THREE.Mesh(swordGeometry, swordMaterial);
      sword.position.set(1.2, 1.4, 0);
      sword.rotation.z = Math.PI / 4;
      sword.castShadow = true;
      character.add(sword);

      // Shield
      const shieldGeometry = new THREE.BoxGeometry(0.1, 0.8, 0.6);
      const shieldMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
      const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
      shield.position.set(-1.2, 1.4, 0);
      shield.castShadow = true;
      character.add(shield);
    }

    // Add weapon for enemies
    if (type === 'enemy') {
      const weaponGeometry = new THREE.BoxGeometry(0.1, 1.0, 0.1);
      const weaponMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
      const weapon = new THREE.Mesh(weaponGeometry, weaponMaterial);
      weapon.position.set(1.0, 1.4, 0);
      weapon.rotation.z = Math.PI / 6;
      weapon.castShadow = true;
      character.add(weapon);
    }

    // Position character
    character.position.set(position.x, position.y, position.z);

    return character;
  };

  return (
    <div className={`character-3d ${className}`}>
      <div 
        ref={mountRef} 
        style={{
          width: '200px',
          height: '200px',
          border: '2px solid #333',
          borderRadius: '8px',
          margin: '10px'
        }}
      />
    </div>
  );
}; 