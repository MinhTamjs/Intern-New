export class SpriteRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private pixelSize: number;

  constructor(canvas: HTMLCanvasElement, pixelSize: number = 4) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.pixelSize = pixelSize;
  }

  // Render a single frame from ASCII art
  renderFrame(frame: string[], colors: any, x: number = 0, y: number = 0) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    frame.forEach((row, rowIndex) => {
      row.split('').forEach((pixel, colIndex) => {
        if (pixel === '█') {
          this.ctx.fillStyle = colors.outline;
          this.ctx.fillRect(
            x + colIndex * this.pixelSize,
            y + rowIndex * this.pixelSize,
            this.pixelSize,
            this.pixelSize
          );
        }
      });
    });
  }

  // Render with equipment overlay
  renderWithEquipment(
    baseFrame: string[],
    equipmentFrame: string[] | null,
    colors: any,
    x: number = 0,
    y: number = 0
  ) {
    // Render base character
    this.renderFrame(baseFrame, colors, x, y);
    
    // Render equipment overlay if provided
    if (equipmentFrame) {
      equipmentFrame.forEach((row, rowIndex) => {
        row.split('').forEach((pixel, colIndex) => {
          if (pixel === '█') {
            this.ctx.fillStyle = '#FFD700'; // Gold color for equipment
            this.ctx.fillRect(
              x + colIndex * this.pixelSize,
              y + rowIndex * this.pixelSize,
              this.pixelSize,
              this.pixelSize
            );
          }
        });
      });
    }
  }

  // Create sprite sheet from multiple frames
  createSpriteSheet(frames: string[][], colors: any): HTMLCanvasElement {
    const frameWidth = frames[0][0].length * this.pixelSize;
    const frameHeight = frames[0].length * this.pixelSize;
    const sheetWidth = frameWidth * frames.length;
    const sheetHeight = frameHeight;

    const sheetCanvas = document.createElement('canvas');
    sheetCanvas.width = sheetWidth;
    sheetCanvas.height = sheetHeight;
    const sheetCtx = sheetCanvas.getContext('2d')!;

    frames.forEach((frame, frameIndex) => {
      frame.forEach((row, rowIndex) => {
        row.split('').forEach((pixel, colIndex) => {
          if (pixel === '█') {
            sheetCtx.fillStyle = colors.outline;
            sheetCtx.fillRect(
              frameIndex * frameWidth + colIndex * this.pixelSize,
              rowIndex * this.pixelSize,
              this.pixelSize,
              this.pixelSize
            );
          }
        });
      });
    });

    return sheetCanvas;
  }

  // Animate sprite
  animate(
    frames: string[][],
    colors: any,
    frameDuration: number,
    onFrameChange?: (frameIndex: number) => void
  ) {
    let currentFrame = 0;
    let lastTime = 0;

    const animate = (timestamp: number) => {
      if (timestamp - lastTime >= frameDuration) {
        this.renderFrame(frames[currentFrame], colors);
        onFrameChange?.(currentFrame);
        
        currentFrame = (currentFrame + 1) % frames.length;
        lastTime = timestamp;
      }
      
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  // Render with effects (glow, particles, etc.)
  renderWithEffects(
    frame: string[],
    colors: any,
    effects: {
      glow?: boolean;
      glowColor?: string;
      particles?: Array<{x: number, y: number, color: string}>;
    },
    x: number = 0,
    y: number = 0
  ) {
    // Render glow effect
    if (effects.glow) {
      this.ctx.shadowColor = effects.glowColor || '#FFD700';
      this.ctx.shadowBlur = 10;
    }

    // Render base sprite
    this.renderFrame(frame, colors, x, y);

    // Reset shadow
    this.ctx.shadowBlur = 0;

    // Render particles
    if (effects.particles) {
      effects.particles.forEach(particle => {
        this.ctx.fillStyle = particle.color;
        this.ctx.fillRect(
          x + particle.x * this.pixelSize,
          y + particle.y * this.pixelSize,
          this.pixelSize,
          this.pixelSize
        );
      });
    }
  }

  // Scale sprite
  setPixelSize(newPixelSize: number) {
    this.pixelSize = newPixelSize;
  }

  // Get sprite dimensions
  getSpriteDimensions(frame: string[]): {width: number, height: number} {
    return {
      width: frame[0].length * this.pixelSize,
      height: frame.length * this.pixelSize
    };
  }
} 