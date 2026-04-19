import { useRef, useState } from 'react';
import { SimParams, SimResult, TARGETS } from './simulator/simulatorEngine';
import SimulatorControls from './simulator/SimulatorControls';
import SimulatorFlightCanvas, { SimulatorFlightCanvasHandle } from './simulator/SimulatorFlightCanvas';
import SimulatorMapCanvas, { SimulatorMapCanvasHandle } from './simulator/SimulatorMapCanvas';

export default function AtmosphereSimulator({ onAchievement }: { onAchievement: () => void }) {
  const flightRef = useRef<SimulatorFlightCanvasHandle>(null);
  const mapRef = useRef<SimulatorMapCanvasHandle>(null);

  const [params, setParams] = useState<SimParams>({
    angle: 35,
    velocity: 22,
    mass: 5000,
    composition: 'stony',
  });
  const [result, setResult] = useState<SimResult | null>(null);
  const [running, setRunning] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [targetX, setTargetX] = useState(0.5);
  const [selectedTarget, setSelectedTarget] = useState('city');
  const [impactDone, setImpactDone] = useState(false);

  const handleChange = (key: keyof SimParams, val: number | string) => {
    setParams(p => ({ ...p, [key]: val }));
    if (!hasChanged) { setHasChanged(true); onAchievement(); }
    setResult(null);
    setImpactDone(false);
  };

  const selectTarget = (t: typeof TARGETS[0]) => {
    setSelectedTarget(t.id);
    setTargetX(t.x);
    setResult(null);
    setImpactDone(false);
  };

  const handleSimulationStart = (res: SimResult) => {
    setRunning(true);
    setImpactDone(false);
    setResult(res);
  };

  const handleSimulationEnd = () => {
    setRunning(false);
    setImpactDone(true);
  };

  const handleImpactProgress = (res: SimResult, prog: number) => {
    mapRef.current?.drawImpactMap(res, prog);
  };

  return (
    <div className="space-y-5">
      <SimulatorControls
        params={params}
        result={result}
        selectedTarget={selectedTarget}
        onParamChange={handleChange}
        onSelectTarget={selectTarget}
      />

      <SimulatorFlightCanvas
        ref={flightRef}
        params={params}
        targetX={targetX}
        running={running}
        onSimulationStart={handleSimulationStart}
        onSimulationEnd={handleSimulationEnd}
        onImpactProgress={handleImpactProgress}
      />

      <SimulatorMapCanvas
        ref={mapRef}
        targetX={targetX}
        selectedTarget={selectedTarget}
        impactDone={impactDone}
      />
    </div>
  );
}
