import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React from 'react';

interface NellyAnimationProps {
  className?: string;
  width?: string;
  height?: string;
}

export const NellyAnimation: React.FC<NellyAnimationProps> = ({
  className = '',
  width = '300px',
  height = '300px',
}) => {
  return (
    <div 
      className={`nelly-animation-wrapper ${className}`}
      style={{
        position: 'relative',
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Ambient Backlight Glow */}
      <div 
        style={{
          position: 'absolute',
          width: '70%',
          height: '70%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--color-primary-glow) 0%, rgba(189, 0, 255, 0.05) 50%, transparent 70%)',
          filter: 'blur(30px)',
          zIndex: 0,
          animation: 'pulse 4s infinite ease-in-out',
        }}
      />

      {/* Front Holographic Pedestal / Ring */}
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          width: '60%',
          height: '10px',
          borderRadius: '50%',
          background: 'transparent',
          border: '1px solid rgba(0, 240, 255, 0.4)',
          boxShadow: '0 0 15px rgba(0, 240, 255, 0.6), inset 0 0 10px rgba(0, 240, 255, 0.3)',
          transform: 'rotateX(75deg)',
          zIndex: 1,
          animation: 'rotateRing 12s linear infinite',
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          width: '50%',
          height: '8px',
          borderRadius: '50%',
          background: 'transparent',
          border: '1px dashed rgba(189, 0, 255, 0.4)',
          boxShadow: '0 0 10px rgba(189, 0, 255, 0.5)',
          transform: 'rotateX(75deg)',
          zIndex: 1,
          animation: 'rotateRingCounter 8s linear infinite',
        }}
      />

      {/* Lottie Player */}
      <div style={{ zIndex: 2, width: '100%', height: '100%' }}>
        <DotLottieReact
          src="/nelly.lottie"
          autoplay
          loop
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Embedded Animation Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes rotateRing {
          0% { transform: rotateX(75deg) rotate(0deg); }
          100% { transform: rotateX(75deg) rotate(360deg); }
        }
        @keyframes rotateRingCounter {
          0% { transform: rotateX(75deg) rotate(360deg); }
          100% { transform: rotateX(75deg) rotate(0deg); }
        }
      `}} />
    </div>
  );
};