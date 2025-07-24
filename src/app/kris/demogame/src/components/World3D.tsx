import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { World, Position } from '../core/World';

interface World3DProps {
  world: any; // Use any to accept GameWorld
  onPlayerMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onTileClick?: (position: Position) => void;
  className?: string;
}

export const World3D: React.FC<World3DProps> = ({
  world,
  onPlayerMove,
  onTileClick,
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const playerRef = useRef<THREE.Group | null>(null);
  const enemiesRef = useRef<THREE.Mesh[]>([]);
  const tilesRef = useRef<THREE.Mesh[]>([]);
  const animationRef = useRef<number>();

  // State cho free movement
  const [playerPosFloat, setPlayerPosFloat] = useState(() => {
    const pos = world.getPlayerPosition();
    return { x: pos.x, y: pos.y };
  });
  const [moveDir, setMoveDir] = useState({ up: false, down: false, left: false, right: false });
  const [enemies, setEnemies] = useState(world.getEnemies());
  const [worldMap, setWorldMap] = useState(world.getWorldMap());

  // Minecraft-style colors
  const tileColors = {
    grass: 0x7CB342,    // Green
    forest: 0x388E3C,   // Dark Green
    mountain: 0x8D6E63, // Brown
    water: 0x1976D2,    // Blue
    cave: 0x424242,     // Dark Gray
    town: 0xFFD54F      // Yellow
  };

  // Initialize 3D scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue
    scene.fog = new THREE.Fog(0x87CEEB, 15, 80);

    // Camera setup - Closer to player for better focus
    const camera = new THREE.PerspectiveCamera(
      60, // Narrower FOV for better focus
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 12, 15);
    camera.lookAt(0, 0, 0);

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
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Store references
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Create world
    createWorld(scene);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Gentle player idle animation
      if (playerRef.current) {
        playerRef.current.rotation.y += 0.005; // Slower rotation
        // Add subtle bobbing motion
        playerRef.current.position.y = 1.0 + Math.sin(Date.now() * 0.003) * 0.1;
      }

      // Rotate enemies
      enemiesRef.current.forEach(enemy => {
        enemy.rotation.y += 0.02;
      });

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

    // Handle keyboard input
    const handleKeyPress = (event: KeyboardEvent) => {
      let direction: 'up' | 'down' | 'left' | 'right' | null = null;
      
      switch (event.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          direction = 'up';
          break;
        case 'arrowdown':
        case 's':
          direction = 'down';
          break;
        case 'arrowleft':
        case 'a':
          direction = 'left';
          break;
        case 'arrowright':
        case 'd':
          direction = 'right';
          break;
      }

      if (direction) {
        event.preventDefault();
        console.log('Key pressed:', event.key, 'Direction:', direction);
        onPlayerMove(direction);
        updateView();
      }
    };
    
    // Add event listener to the document for better keyboard capture
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', handleKeyPress);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [onPlayerMove]);

  // Hàm tạo mô hình player Minecraft-style
  function createPlayerModel(): THREE.Group {
    const colors = {
      head: 0xFFB366,
      body: 0x00FF00,
      arms: 0xFFB366,
      legs: 0x00CC00,
      feet: 0x654321
    };
    const player = new THREE.Group();
    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), new THREE.MeshLambertMaterial({ color: colors.head }));
    head.position.y = 2.3;
    head.castShadow = true;
    player.add(head);
    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.4), new THREE.MeshLambertMaterial({ color: colors.body }));
    body.position.y = 1.4;
    body.castShadow = true;
    player.add(body);
    // Arms
    const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 0.3), new THREE.MeshLambertMaterial({ color: colors.arms }));
    leftArm.position.set(-0.8, 1.4, 0);
    leftArm.castShadow = true;
    player.add(leftArm);
    const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 0.3), new THREE.MeshLambertMaterial({ color: colors.arms }));
    rightArm.position.set(0.8, 1.4, 0);
    rightArm.castShadow = true;
    player.add(rightArm);
    // Legs
    const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 0.3), new THREE.MeshLambertMaterial({ color: colors.legs }));
    leftLeg.position.set(-0.3, 0.5, 0);
    leftLeg.castShadow = true;
    player.add(leftLeg);
    const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 0.3), new THREE.MeshLambertMaterial({ color: colors.legs }));
    rightLeg.position.set(0.3, 0.5, 0);
    rightLeg.castShadow = true;
    player.add(rightLeg);
    // Feet
    const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.6), new THREE.MeshLambertMaterial({ color: colors.feet }));
    leftFoot.position.set(-0.3, 0, 0.1);
    leftFoot.castShadow = true;
    player.add(leftFoot);
    const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.6), new THREE.MeshLambertMaterial({ color: colors.feet }));
    rightFoot.position.set(0.3, 0, 0.1);
    rightFoot.castShadow = true;
    player.add(rightFoot);
    // Glow effect
    const glow = new THREE.PointLight(0x00FF00, 0.5, 5);
    glow.position.set(0, 1, 0);
    player.add(glow);
    return player;
  }

  const createWorld = (scene: THREE.Scene) => {
    const worldMap = world.getWorldMap();
    const worldWidth = worldMap[0].length;
    const worldHeight = worldMap.length;

    // Create ground plane
    const groundGeometry = new THREE.PlaneGeometry(worldWidth * 2, worldHeight * 2);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x7CB342 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);

    // Create tiles
    for (let y = 0; y < worldHeight; y++) {
      for (let x = 0; x < worldWidth; x++) {
        const tile = worldMap[y][x];
        // Tô màu block không đi được thật nổi bật
        let color = tileColors[tile.type as keyof typeof tileColors] || 0x808080;
        if (tile.type === 'water') color = 0x0033cc; // Xanh dương đậm
        if (tile.type === 'mountain') color = 0x444444; // Xám đậm
        
        // Create cube for each tile
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshLambertMaterial({ color });
        const cube = new THREE.Mesh(geometry, material);
        
        cube.position.set(
          (x - worldWidth / 2) * 2,
          0,
          (y - worldHeight / 2) * 2
        );
        
        // Add height variation based on tile type
        if (tile.type === 'mountain') {
          cube.scale.y = 2;
          cube.position.y = 0.5;
        } else if (tile.type === 'water') {
          cube.scale.y = 0.3;
          cube.position.y = -0.35;
        } else if (tile.type === 'cave') {
          cube.scale.y = 0.8;
          cube.position.y = -0.1;
        }
        
        cube.castShadow = true;
        cube.receiveShadow = true;
        scene.add(cube);
        tilesRef.current.push(cube);
      }
    }

    // Create player bằng mô hình Minecraft-style
    const playerModel = createPlayerModel();
    playerModel.position.set(
      (playerPosFloat.x - worldWidth / 2) * 2,
      0,
      (playerPosFloat.y - worldHeight / 2) * 2
    );
    playerModel.castShadow = true;
    playerModel.receiveShadow = true;
    scene.add(playerModel);
    playerRef.current = playerModel;

    // Create enemies
    enemies.forEach((enemy: any) => {
      const enemyGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.8);
      const enemyMaterial = new THREE.MeshLambertMaterial({ color: 0xF44336 });
      const enemyMesh = new THREE.Mesh(enemyGeometry, enemyMaterial);
      enemyMesh.position.set(
        (enemy.position.x - worldWidth / 2) * 2,
        0.6,
        (enemy.position.y - worldHeight / 2) * 2
      );
      enemyMesh.castShadow = true;
      scene.add(enemyMesh);
      enemiesRef.current.push(enemyMesh);
    });

    // Update camera position to follow player
    updateCamera();
  };

  const updateCamera = () => {
    if (!cameraRef.current || !playerRef.current) return;
    
    const playerPos = world.getPlayerPosition();
    const worldWidth = world.getWorldDimensions().width;
    const worldHeight = world.getWorldDimensions().height;
    
    const targetX = (playerPos.x - worldWidth / 2) * 2;
    const targetZ = (playerPos.y - worldHeight / 2) * 2;
    
    // Closer camera focus on player
    cameraRef.current.position.x = targetX;
    cameraRef.current.position.z = targetZ + 12; // Closer to player
    cameraRef.current.position.y = 10; // Lower angle for better focus
    cameraRef.current.lookAt(targetX, 1, targetZ); // Look at player center
  };

  const updateView = () => {
    setPlayerPosFloat(world.getPlayerPosition());
    setEnemies(world.getEnemies());
    setWorldMap(world.getWorldMap());
    updateCamera();
  };

  useEffect(() => {
    updateView();
  }, [world]);

  // Free movement: lắng nghe phím nhấn/nhả
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case 'w': case 'arrowup': setMoveDir(dir => ({ ...dir, up: true })); break;
        case 's': case 'arrowdown': setMoveDir(dir => ({ ...dir, down: true })); break;
        case 'a': case 'arrowleft': setMoveDir(dir => ({ ...dir, left: true })); break;
        case 'd': case 'arrowright': setMoveDir(dir => ({ ...dir, right: true })); break;
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case 'w': case 'arrowup': setMoveDir(dir => ({ ...dir, up: false })); break;
        case 's': case 'arrowdown': setMoveDir(dir => ({ ...dir, down: false })); break;
        case 'a': case 'arrowleft': setMoveDir(dir => ({ ...dir, left: false })); break;
        case 'd': case 'arrowright': setMoveDir(dir => ({ ...dir, right: false })); break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Animation loop: cập nhật vị trí player mỗi frame
  useEffect(() => {
    let lastTime = performance.now();
    const speed = 2.5; // block/giây
    const animate = (now: number) => {
      animationRef.current = requestAnimationFrame(animate);
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      let { x, y } = playerPosFloat;
      let dx = 0, dy = 0;
      if (moveDir.up) dy -= 1;
      if (moveDir.down) dy += 1;
      if (moveDir.left) dx -= 1;
      if (moveDir.right) dx += 1;
      // Chuẩn hóa hướng
      if (dx !== 0 || dy !== 0) {
        const len = Math.sqrt(dx * dx + dy * dy);
        dx /= len; dy /= len;
        // Tính vị trí mới
        let nx = x + dx * speed * dt;
        let ny = y + dy * speed * dt;
        // Kiểm tra collision với block không đi được
        if (isWalkable(nx, ny)) {
          setPlayerPosFloat({ x: nx, y: ny });
          // Cập nhật vị trí logic trong world nếu player đã sang block mới
          const gridX = Math.round(nx);
          const gridY = Math.round(ny);
          const oldGrid = world.getPlayerPosition();
          if (gridX !== oldGrid.x || gridY !== oldGrid.y) {
            world.playerPosition = { x: gridX, y: gridY };
          }
        }
      }
      // Render lại scene
      if (sceneRef.current && cameraRef.current && rendererRef.current && playerRef.current) {
        // Cập nhật vị trí player model
        const worldWidth = worldMap[0].length;
        const worldHeight = worldMap.length;
        playerRef.current.position.set(
          (playerPosFloat.x - worldWidth / 2) * 2,
          0,
          (playerPosFloat.y - worldHeight / 2) * 2
        );
        // Camera follow
        cameraRef.current.position.x = (playerPosFloat.x - worldWidth / 2) * 2;
        cameraRef.current.position.z = (playerPosFloat.y - worldHeight / 2) * 2 + 12;
        cameraRef.current.position.y = 10;
        cameraRef.current.lookAt(
          (playerPosFloat.x - worldWidth / 2) * 2,
          1,
          (playerPosFloat.y - worldHeight / 2) * 2
        );
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [moveDir, playerPosFloat, worldMap]);

  // Hàm kiểm tra player có đi vào block walkable không
  function isWalkable(x: number, y: number) {
    const gridX = Math.round(x);
    const gridY = Math.round(y);
    if (gridX < 0 || gridY < 0 || gridY >= worldMap.length || gridX >= worldMap[0].length) return false;
    return worldMap[gridY][gridX].walkable;
  }

  // Mouse controls for camera rotation
  useEffect(() => {
    if (!mountRef.current) return;

    let isMouseDown = false;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseDown = (event: MouseEvent) => {
      isMouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isMouseDown || !cameraRef.current) return;

      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;

      // Rotate camera around player
      const playerPos = world.getPlayerPosition();
      const worldWidth = world.getWorldDimensions().width;
      const worldHeight = world.getWorldDimensions().height;
      const targetX = (playerPos.x - worldWidth / 2) * 2;
      const targetZ = (playerPos.y - worldHeight / 2) * 2;

      const radius = 15;
      const angleX = deltaX * 0.01;
      const angleY = deltaY * 0.01;

      cameraRef.current.position.x = targetX + radius * Math.sin(angleX);
      cameraRef.current.position.z = targetZ + radius * Math.cos(angleX);
      cameraRef.current.position.y = Math.max(5, 15 - angleY * 10);
      cameraRef.current.lookAt(targetX, 0, targetZ);

      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    mountRef.current.addEventListener('mousedown', handleMouseDown);
    mountRef.current.addEventListener('mousemove', handleMouseMove);
    mountRef.current.addEventListener('mouseup', handleMouseUp);

    return () => {
      if (mountRef.current) {
        mountRef.current.removeEventListener('mousedown', handleMouseDown);
        mountRef.current.removeEventListener('mousemove', handleMouseMove);
        mountRef.current.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, [world]);

  return (
    <div className={`world-3d ${className}`}>
      <div className="world-info">
        <div>Vị trí: ({playerPosFloat.x}, {playerPosFloat.y})</div>
        <div>Khu vực: {world.getTile(playerPosFloat).description}</div>
        <div>Quái vật còn lại: {enemies.length}</div>
      </div>
      
      <div 
        ref={mountRef} 
        style={{
          width: '100%',
          height: '400px',
          border: '3px solid #00FF00',
          borderRadius: '12px',
          cursor: 'grab',
          boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)',
          outline: 'none'
        }}
        tabIndex={0}
        onFocus={() => console.log('3D World focused')}
      />
      
      <div className="controls-info">
        <p>🎮 <strong>Điều khiển:</strong> WASD hoặc Arrow Keys để di chuyển</p>
        <p>🖱️ <strong>Camera:</strong> Click và kéo để xoay camera</p>
        <p>👤 <strong>Bạn:</strong> Khối xanh sáng (có ánh sáng)</p>
        <p>👹 <strong>Quái vật:</strong> Khối đỏ</p>
        <p>🌱 Cỏ | 🌲 Rừng | ⛰️ Núi | 💧 Nước | 🕳️ Hang | 🏘️ Thị trấn</p>
      </div>
    </div>
  );
}; 