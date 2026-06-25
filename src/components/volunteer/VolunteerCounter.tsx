interface VolunteerCounterProps {
  current: number;
  max: number;
  size?: 'sm' | 'lg';
}

export function VolunteerCounter({ current, max, size = 'sm' }: VolunteerCounterProps) {
  const pct = Math.min(100, (current / max) * 100);
  const progressColor =
    pct >= 100 ? 'bg-red-500' : pct > 70 ? 'bg-yellow-500' : 'bg-green-500';

  const barHeight = size === 'lg' ? 'h-2.5' : 'h-1.5';
  const textSize = size === 'lg' ? 'text-sm' : 'text-xs';

  return (
    <div>
      <div className={`flex items-center justify-between ${textSize} text-gray-500 mb-1`}>
        <span>
          {current} persona{current !== 1 ? 's' : ''} en camino
        </span>
        {pct >= 100 ? (
          <span className="text-red-600 font-semibold">Suficiente ayuda</span>
        ) : (
          <span>{max - current} espacio{max - current !== 1 ? 's' : ''}</span>
        )}
      </div>
      <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${barHeight}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
