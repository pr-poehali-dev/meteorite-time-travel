export interface SimParams {
  angle: number;
  velocity: number;
  mass: number;
  composition: string;
}

export interface SimResult {
  survived: boolean;
  energyReleased: string;
  energyMt: number;
  finalVelocity: number;
  burnHeight: number;
  craterDiameter: number;
  blastRadius: number;
  fireballRadius: number;
  fragments: number;
}

export interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  r: number;
  color: string;
}

export function simulate(params: SimParams): SimResult {
  const { angle, velocity, mass, composition } = params;
  const angleRad = (angle * Math.PI) / 180;
  const densityFactor = composition === 'iron' ? 1.4 : composition === 'stony' ? 1.0 : 0.7;
  const kineticEnergy = 0.5 * mass * densityFactor * velocity * velocity * 1000;
  const energyMt = kineticEnergy / 4.184e15;

  const survived = mass * densityFactor > 80 && velocity < 45 && angle < 80;
  const burnHeight = Math.max(5, 85 - angle * 0.6 - (mass / 800) * 4);
  const finalVelocity = survived ? velocity * (0.15 + 0.2 * Math.cos(angleRad)) : velocity * 0.05;

  const craterDiameter = survived ? Math.pow(energyMt * 1000, 0.294) * 0.8 : 0;
  const blastRadius = Math.pow(energyMt, 0.333) * 4.5;
  const fireballRadius = Math.pow(energyMt, 0.333) * 1.8;

  return {
    survived,
    energyReleased: energyMt < 0.001
      ? `${(energyMt * 1000).toFixed(2)} кт`
      : energyMt < 1
      ? `${(energyMt * 1000).toFixed(0)} кт`
      : `${energyMt.toFixed(2)} Мт`,
    energyMt,
    finalVelocity: Math.round(finalVelocity * 10) / 10,
    burnHeight: Math.round(burnHeight),
    craterDiameter: Math.max(0, Math.round(craterDiameter * 10) / 10),
    blastRadius: Math.max(0.1, Math.round(blastRadius * 10) / 10),
    fireballRadius: Math.max(0.05, Math.round(fireballRadius * 10) / 10),
    fragments: survived ? Math.max(1, Math.floor(mass / 600) + (angle > 45 ? 4 : 1)) : 0,
  };
}

export const TARGETS = [
  { id: 'city', label: '🏙️ Мегаполис', x: 0.5, emoji: '🏙️' },
  { id: 'forest', label: '🌲 Тайга', x: 0.25, emoji: '🌲' },
  { id: 'ocean', label: '🌊 Океан', x: 0.75, emoji: '🌊' },
  { id: 'desert', label: '🏜️ Пустыня', x: 0.38, emoji: '🏜️' },
  { id: 'mountain', label: '⛰️ Горы', x: 0.62, emoji: '⛰️' },
];

export function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 43758.5453;
  return x - Math.floor(x);
}
