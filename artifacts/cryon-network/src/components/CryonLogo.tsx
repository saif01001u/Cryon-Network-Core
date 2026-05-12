interface CryonLogoProps {
  size?: number;
  animated?: boolean;
  className?: string;
}

export function CryonLogo({ size = 48, animated = false, className = "" }: CryonLogoProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;

  const hexPoints = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");

  const innerR = r * 0.6;
  const innerHex = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + innerR * Math.cos(angle)},${cy + innerR * Math.sin(angle)}`;
  }).join(" ");

  const nodeR = r * 0.18;
  const nodes = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const nr = r * 0.74;
    return { x: cx + nr * Math.cos(angle), y: cy + nr * Math.sin(angle) };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={size * 0.06} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f5ff" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="cyanGradInner" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      <polygon
        points={hexPoints}
        fill="rgba(0,245,255,0.06)"
        stroke="url(#cyanGrad)"
        strokeWidth={size * 0.025}
        filter="url(#glow)"
      />

      <polygon
        points={innerHex}
        fill="rgba(0,245,255,0.04)"
        stroke="url(#cyanGradInner)"
        strokeWidth={size * 0.018}
      />

      {nodes.map((node, i) => (
        <g key={i}>
          <line
            x1={cx}
            y1={cy}
            x2={node.x}
            y2={node.y}
            stroke="rgba(0,245,255,0.25)"
            strokeWidth={size * 0.012}
          />
          <circle
            cx={node.x}
            cy={node.y}
            r={nodeR}
            fill="rgba(0,245,255,0.15)"
            stroke="#00f5ff"
            strokeWidth={size * 0.018}
            filter="url(#glow)"
          >
            {animated && (
              <animate
                attributeName="opacity"
                values="0.6;1;0.6"
                dur={`${1.5 + i * 0.3}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>
        </g>
      ))}

      <circle
        cx={cx}
        cy={cy}
        r={size * 0.1}
        fill="url(#cyanGrad)"
        filter="url(#glow)"
      >
        {animated && (
          <animate
            attributeName="r"
            values={`${size * 0.1};${size * 0.12};${size * 0.1}`}
            dur="2s"
            repeatCount="indefinite"
          />
        )}
      </circle>
    </svg>
  );
}

export function CryonWordmark({ height = 28 }: { height?: number }) {
  const w = height * 5.5;
  return (
    <svg
      width={w}
      height={height}
      viewBox={`0 0 ${w} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="wordGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f5ff" />
          <stop offset="60%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#00f5ff" />
        </linearGradient>
      </defs>
      <text
        x="0"
        y={height * 0.78}
        fontFamily="'Inter', sans-serif"
        fontWeight="800"
        fontSize={height * 0.9}
        letterSpacing={height * 0.05}
        fill="url(#wordGrad)"
      >
        CRYON
      </text>
      <text
        x={height * 3.15}
        y={height * 0.78}
        fontFamily="'Inter', sans-serif"
        fontWeight="300"
        fontSize={height * 0.9}
        letterSpacing={height * 0.05}
        fill="rgba(255,255,255,0.55)"
      >
        NETWORK
      </text>
    </svg>
  );
}
