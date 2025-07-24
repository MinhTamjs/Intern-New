import React, { useEffect, useRef, useState } from 'react';
import { PLAYER_SPRITE, EQUIPMENT_SPRITES, ANIMATION_CONFIG } from '../assets/sprites/player';
import { SpriteRenderer } from '../utils/SpriteRenderer';

interface PlayerSpriteProps {
  animation: 'idle' | 'attack' | 'cast';
  equipment?: {
    weapon?: string;
    armor?: string;
  };
  effects?: {
    glow?: boolean;
    glowColor?: string;
    particles?: Array<{x: number, y: number, color: string}>;
  };
  pixelSize?: number;
  className?: string;
}

export const PlayerSprite: React.FC<PlayerSpriteProps> = ({
  animation = 'idle',
  equipment,
  effects,
  pixelSize = 4,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const spriteRendererRef = useRef<SpriteRenderer | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const spriteRenderer = new SpriteRenderer(canvas, pixelSize);
    spriteRendererRef.current = spriteRenderer;

    // Set canvas size based on sprite dimensions
    const frames = PLAYER_SPRITE[animation];
    const dimensions = spriteRenderer.getSpriteDimensions(frames[0]);
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Start animation
    const config = ANIMATION_CONFIG[animation];
    spriteRenderer.animate(
      frames,
      PLAYER_SPRITE.colors,
      config.frameDuration,
      (frameIndex) => setCurrentFrame(frameIndex)
    );

    return () => {
      // Cleanup animation if needed
    };
  }, [animation, pixelSize]);

  // Render equipment overlay
  useEffect(() => {
    if (!spriteRendererRef.current || !equipment) return;

    const spriteRenderer = spriteRendererRef.current;
    const frames = PLAYER_SPRITE[animation];
    const currentFrameData = frames[currentFrame];

    // Get equipment overlay
    let equipmentOverlay = null;
    if (equipment.weapon && EQUIPMENT_SPRITES[equipment.weapon as keyof typeof EQUIPMENT_SPRITES]) {
      equipmentOverlay = EQUIPMENT_SPRITES[equipment.weapon as keyof typeof EQUIPMENT_SPRITES];
    }

    // Render with equipment
    if (effects) {
      spriteRenderer.renderWithEffects(
        currentFrameData,
        PLAYER_SPRITE.colors,
        effects
      );
    } else {
      spriteRenderer.renderWithEquipment(
        currentFrameData,
        equipmentOverlay,
        PLAYER_SPRITE.colors
      );
    }
  }, [currentFrame, equipment, effects, animation]);

  return (
    <div className={`player-sprite ${className}`}>
      <canvas
        ref={canvasRef}
        style={{
          imageRendering: 'pixelated'
        }}
      />
    </div>
  );
};

// Enemy sprite component
interface EnemySpriteProps {
  type: 'goblin' | 'orc' | 'dragon' | 'dark-knight' | 'troll';
  animation: 'idle' | 'attack' | 'hurt';
  pixelSize?: number;
  className?: string;
}

export const EnemySprite: React.FC<EnemySpriteProps> = ({
  type,
  animation = 'idle',
  pixelSize = 4,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simple enemy sprites (placeholder)
  const enemySprites: { [key: string]: any } = {
    goblin: {
      colors: { outline: '#4CAF50', body: '#8BC34A' },
      idle: [
        [
          '    ████    ',
          '   ██████   ',
          '   ██████   ',
          '   ██████   ',
          '   ██████   ',
          '   ██████   ',
          '   ██████   ',
          '   ██████   ',
          '   ██████   ',
          '   ██████   ',
          '   ██████   ',
          '   ██████   '
        ]
      ]
    },
    orc: {
      colors: { outline: '#795548', body: '#A1887F' },
      idle: [
        [
          '   ██████   ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  '
        ]
      ]
    },
    dragon: {
      colors: { outline: '#D32F2F', body: '#F44336' },
      idle: [
        [
          '    ████████    ',
          '   ██████████   ',
          '   ██████████   ',
          '   ██████████   ',
          '   ██████████   ',
          '   ██████████   ',
          '   ██████████   ',
          '   ██████████   ',
          '   ██████████   ',
          '   ██████████   ',
          '   ██████████   ',
          '   ██████████   ',
          '   ██████████   ',
          '   ██████████   ',
          '   ██████████   ',
          '   ██████████   '
        ]
      ]
    },
    'dark-knight': {
      colors: { outline: '#424242', body: '#757575' },
      idle: [
        [
          '   ██████   ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  '
        ]
      ]
    },
    troll: {
      colors: { outline: '#4CAF50', body: '#8BC34A' },
      idle: [
        [
          '   ██████   ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  ',
          '  ████████  '
        ]
      ]
    }
  };

  const enemyData = enemySprites[type] || enemySprites.goblin;

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const spriteRenderer = new SpriteRenderer(canvas, pixelSize);

    // Set canvas size
    const frames = enemyData[animation] || enemyData.idle;
    const dimensions = spriteRenderer.getSpriteDimensions(frames[0]);
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Render enemy
    spriteRenderer.renderFrame(frames[0], enemyData.colors);
  }, [type, animation, pixelSize, enemyData]);

  return (
    <div className={`enemy-sprite ${className}`}>
      <canvas
        ref={canvasRef}
        style={{
          imageRendering: 'pixelated'
        }}
      />
    </div>
  );
}; 