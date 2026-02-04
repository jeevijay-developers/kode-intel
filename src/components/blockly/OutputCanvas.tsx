import { useEffect, useRef } from 'react';
import { SpriteState, CanvasState } from '@/lib/blockly/interpreters/animationInterpreter';

interface OutputCanvasProps {
  sprite: SpriteState;
  canvas: CanvasState;
  width?: number;
  height?: number;
}

const OutputCanvas = ({ sprite, canvas, width = 400, height = 400 }: OutputCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Draw grid - adjust spacing based on canvas size
    const gridSpacing = Math.max(15, Math.floor(width / 20));
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Scale factor for sprite position (if canvas size differs from expected)
    const scaleFactor = width / 400;

    // Draw pen lines
    canvas.drawings.forEach(drawing => {
      if (drawing.type === 'line') {
        ctx.strokeStyle = drawing.color;
        ctx.lineWidth = drawing.width * scaleFactor;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(drawing.fromX * scaleFactor, drawing.fromY * scaleFactor);
        ctx.lineTo(drawing.toX * scaleFactor, drawing.toY * scaleFactor);
        ctx.stroke();
      }
    });

    // Draw sprite
    if (sprite.visible) {
      const size = (sprite.size / 100) * 30 * scaleFactor;
      const spriteX = sprite.x * scaleFactor;
      const spriteY = sprite.y * scaleFactor;
      
      ctx.save();
      ctx.translate(spriteX, spriteY);
      ctx.rotate((sprite.direction * Math.PI) / 180);

      // Draw sprite body (star shape)
      ctx.fillStyle = sprite.color;
      ctx.beginPath();
      const points = 5;
      const outerRadius = size;
      const innerRadius = size * 0.5;
      
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / points - Math.PI / 2;
        if (i === 0) {
          ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        } else {
          ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        }
      }
      ctx.closePath();
      ctx.fill();

      // Draw direction indicator
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2 * scaleFactor;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(size + 5, 0);
      ctx.stroke();

      // Draw arrow head
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.moveTo(size + 10, 0);
      ctx.lineTo(size + 2, -4);
      ctx.lineTo(size + 2, 4);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // Draw speech bubble if message exists
      if (sprite.message) {
        const bubbleX = spriteX + size + 10;
        const bubbleY = spriteY - size - 30;
        const padding = 8 * scaleFactor;
        const fontSize = Math.max(10, 14 * scaleFactor);
        
        ctx.font = `${fontSize}px Nunito, sans-serif`;
        const textWidth = ctx.measureText(sprite.message).width;
        
        // Bubble background
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.roundRect(
          bubbleX - padding,
          bubbleY - fontSize - padding,
          textWidth + padding * 2,
          fontSize + padding * 2,
          8
        );
        ctx.fill();
        
        // Bubble tail
        ctx.beginPath();
        ctx.moveTo(bubbleX, bubbleY + padding);
        ctx.lineTo(spriteX + size, spriteY - size);
        ctx.lineTo(bubbleX + 15, bubbleY + padding);
        ctx.closePath();
        ctx.fill();
        
        // Text
        ctx.fillStyle = '#333';
        ctx.fillText(sprite.message, bubbleX, bubbleY);
      }
    }

    // Draw recent messages
    const recentMessages = canvas.messages.filter(
      m => Date.now() - m.timestamp < 3000
    );
    recentMessages.forEach(msg => {
      const alpha = Math.max(0, 1 - (Date.now() - msg.timestamp) / 3000);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      const fontSize = Math.max(10, 14 * scaleFactor);
      ctx.font = `bold ${fontSize}px Nunito, sans-serif`;
      ctx.fillText(msg.text, msg.x * scaleFactor, msg.y * scaleFactor);
    });

  }, [sprite, canvas, width, height]);

  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg border-4 border-primary/30 max-w-full">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="block w-full h-auto"
        style={{ maxWidth: `${width}px` }}
      />
      {/* Coordinate display */}
      <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-background/80 rounded text-[10px] sm:text-xs font-mono text-muted-foreground">
        x: {Math.round(sprite.x)} y: {Math.round(sprite.y)} | {Math.round(sprite.direction)}°
      </div>
    </div>
  );
};

export default OutputCanvas;
