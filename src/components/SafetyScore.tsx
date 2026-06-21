interface Props {
  score: number;
  size?: number;
  thickness?: number;
  label?: string;
}

export function SafetyScore({ score, size = 140, thickness = 12, label = "Safety" }: Props) {
  const s = Math.max(0, Math.min(100, Math.round(score)));
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (s / 100) * circumference;
  const color =
    s >= 75 ? "var(--success)" : s >= 50 ? "var(--warning)" : "var(--danger)";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--border)"
          strokeWidth={thickness}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          fill="none"
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tracking-tight text-foreground">{s}</span>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}