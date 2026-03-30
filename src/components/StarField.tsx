import { useMemo } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function StarField() {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 120 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.7 + 0.3,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((star, i) => (
        <div
          key={i}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            '--duration': `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Shooting meteorite */}
      <div
        className="absolute w-2 h-2 rounded-full bg-orange-400"
        style={{
          top: '10%',
          left: '-5%',
          animation: 'meteor-fly 8s linear infinite',
          animationDelay: '3s',
          boxShadow: '0 0 10px rgba(255,140,0,0.8), 40px 0 60px rgba(255,140,0,0.4), 80px 0 120px rgba(255,140,0,0.2)',
        }}
      />
      <div
        className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400"
        style={{
          top: '40%',
          left: '-5%',
          animation: 'meteor-fly 12s linear infinite',
          animationDelay: '7s',
          boxShadow: '0 0 8px rgba(0,200,255,0.8), 30px 0 50px rgba(0,200,255,0.3)',
        }}
      />
    </div>
  );
}
