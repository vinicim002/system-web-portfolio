import { Braces, Database, KeyRound, Lock, Webhook } from "lucide-react";

type Orbit = { cx: number; cy: number; rx: number; ry: number; rotate: number };

const orbits: Orbit[] = [
  { cx: 360, cy: 200, rx: 250, ry: 64, rotate: -16 },
  { cx: 400, cy: 230, rx: 210, ry: 118, rotate: 28 },
];

// Ponto da elipse (já rotacionada) no ângulo t, em graus
function pointOn({ cx, cy, rx, ry, rotate }: Orbit, t: number) {
  const a = (t * Math.PI) / 180;
  const r = (rotate * Math.PI) / 180;
  const x = rx * Math.cos(a);
  const y = ry * Math.sin(a);
  return {
    x: Math.round(cx + x * Math.cos(r) - y * Math.sin(r)),
    y: Math.round(cy + x * Math.sin(r) + y * Math.cos(r)),
  };
}

const nodes = [
  { Icon: Lock, orbit: 0, t: 200 },
  { Icon: KeyRound, orbit: 0, t: 262 },
  { Icon: Database, orbit: 1, t: 168 },
  { Icon: Webhook, orbit: 1, t: 228 },
];

// Esfera com órbitas (estilo "Cloud Backup"): segurança, JWT, JPA e APIs
export function BackendOrbit() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 560 340"
      preserveAspectRatio="xMaxYMax meet"
      className="absolute right-0 bottom-0 h-[78%] w-auto max-w-full sm:h-full"
    >
      <defs>
        <radialGradient id="backend-sphere" cx="30%" cy="28%" r="80%">
          <stop offset="0%" stopColor="var(--secondary)" />
          <stop offset="75%" stopColor="var(--primary)" />
        </radialGradient>
      </defs>

      <circle
        cx="440"
        cy="260"
        r="175"
        fill="url(#backend-sphere)"
        className="transition-[filter] duration-500 [filter:drop-shadow(0_0_40px_var(--secondary))] group-hover:[filter:drop-shadow(0_0_70px_var(--secondary))]"
      />
      <Braces x="345" y="150" width="96" height="96" color="white" strokeWidth={1.5} />

      {orbits.map((orbit, index) => (
        <ellipse
          key={index}
          cx={orbit.cx}
          cy={orbit.cy}
          rx={orbit.rx}
          ry={orbit.ry}
          transform={`rotate(${orbit.rotate} ${orbit.cx} ${orbit.cy})`}
          fill="none"
          stroke="var(--secondary)"
          strokeOpacity="0.45"
        />
      ))}

      {nodes.map(({ Icon, orbit, t }, index) => {
        const { x, y } = pointOn(orbits[orbit], t);
        return (
          <g key={index}>
            <circle cx={x} cy={y} r="17" fill="var(--card)" stroke="var(--secondary)" strokeOpacity="0.6" />
            <Icon x={x - 8} y={y - 8} width="16" height="16" color="var(--foreground)" strokeWidth={1.75} />
          </g>
        );
      })}
    </svg>
  );
}
