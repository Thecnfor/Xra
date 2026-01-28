"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

/**
 * RakLink 背景组件配置接口
 */
interface RakLinkProps {
  /** 主题颜色 (Hex 格式), 默认 #C8C8C8 */
  color?: string;
  /** 粒子密度系数, 默认 1.0 (约 80 个粒子) */
  density?: number;
  /** 粒子大小系数, 默认 1.0 (2-4px) */
  size?: number;
  /** 背景容器类名 */
  className?: string;
  /** 整体不透明度, 默认 0.8 */
  opacity?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

/**
 * 16进制颜色转 RGB 对象
 */
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 200, g: 200, b: 200 }; // 默认灰色
};

/**
 * RakLink - 极简主义科技风神经网络背景
 */
function RakLink({
  color = "#C8C8C8",
  density = 1.0,
  size = 1.0,
  className = "",
  opacity = 0.8,
}: RakLinkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // 解析颜色
  const rgb = hexToRgb(color);
  const colorString = `${rgb.r}, ${rgb.g}, ${rgb.b}`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // 配置参数
    const connectionDistance = 180; // 连线最大距离
    const mouseDistance = 200; // 鼠标交互半径
    const baseSpeed = 0.5; // 基础移动速度

    // 窗口大小调整处理 (简单的防抖)
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        
        // 更新画布尺寸
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // 更新全局宽高变量
        width = newWidth;
        height = newHeight;

        // 调整现有粒子位置，使其不超出新边界
        particles.forEach(p => {
          if (p.x > newWidth) p.x = Math.random() * newWidth;
          if (p.y > newHeight) p.y = Math.random() * newHeight;
        });

        // 根据新面积动态调整粒子数量 (维持密度)
        const baseCount = Math.floor((newWidth * newHeight) / 10000);
        const targetCount = Math.min(
          Math.max(Math.floor(baseCount * density), 40),
          300
        );

        // 如果粒子太少，补充
        if (particles.length < targetCount) {
          const addCount = targetCount - particles.length;
          for (let i = 0; i < addCount; i++) {
            particles.push({
              x: Math.random() * newWidth,
              y: Math.random() * newHeight,
              vx: (Math.random() - 0.5) * baseSpeed,
              vy: (Math.random() - 0.5) * baseSpeed,
              size: (Math.random() * 2 + 2) * size,
            });
          }
        } 
        // 如果粒子太多，移除
        else if (particles.length > targetCount) {
          particles.splice(targetCount);
        }

        // 不再调用 initParticles() 重置所有粒子
      }, 200);
    };

    // 初始化粒子系统
    const initParticles = () => {
      particles = [];
      // 基础数量计算：屏幕面积 / 10000 * 密度系数
      const baseCount = Math.floor((width * height) / 10000);
      // 限制粒子数量范围，防止过少或过多影响性能
      const finalCount = Math.min(
        Math.max(Math.floor(baseCount * density), 40),
        300,
      );

      for (let i = 0; i < finalCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * baseSpeed,
          vy: (Math.random() - 0.5) * baseSpeed,
          // 随机大小：(2-4px) * 大小系数
          size: (Math.random() * 2 + 2) * size,
        });
      }
    };

    // 鼠标移动处理
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 更新并绘制粒子
      particles.forEach((p, i) => {
        // 移动位置
        p.x += p.vx;
        p.y += p.vy;

        // 边界反弹
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // 鼠标交互 (柔和排斥效果)
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseDistance) {
          const force = (mouseDistance - dist) / mouseDistance;
          const angle = Math.atan2(dy, dx);
          const moveX = Math.cos(angle) * force * 1;
          const moveY = Math.sin(angle) * force * 1;

          p.x -= moveX;
          p.y -= moveY;
        }

        // 绘制粒子 (节点)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colorString}, 0.8)`; // 节点颜色
        ctx.fill();

        // 绘制连线 (突触)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist2 < connectionDistance) {
            // 根据距离计算透明度
            const lineOpacity = 1 - dist2 / connectionDistance;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            // 连线颜色略淡于节点
            ctx.strokeStyle = `rgba(${colorString}, ${lineOpacity * 0.5})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // 页面可见性处理
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animate();
      }
    };

    // 启动
    // 立即执行一次初始化，不防抖
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initParticles();

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    animate();

    // 清理
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
    };
  }, [color, density, size, colorString]); // 依赖项更新时重新初始化

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 -z-10 pointer-events-none bg-background ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ opacity }}
      />
    </div>
  );
}

// 使用 dynamic 导出组件并禁用 SSR
export default dynamic(() => Promise.resolve(RakLink), {
  ssr: false,
});
