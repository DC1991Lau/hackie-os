/* UI — what the Orb looks like: a lit sphere with a specular highlight.
   Size and position are decided by interaction/Orb (M3). */
import Svg, { Circle, Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';
import { useTheme } from './theme';

export function OrbSphere({ size = 68 }: { size?: number }) {
  const { orb } = useTheme();
  const r = size / 2;
  return (
    <Svg width={size} height={size}>
      <Defs>
        <RadialGradient id="sphere" cx="34%" cy="28%" r="80%">
          <Stop offset="0" stopColor={orb.hi} />
          <Stop offset="0.2" stopColor={orb.mid} />
          <Stop offset="0.6" stopColor={orb.base} />
          <Stop offset="1" stopColor={orb.rim} />
        </RadialGradient>
        <RadialGradient id="spec" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#ffffff" stopOpacity={0.95} />
          <Stop offset="1" stopColor="#ffffff" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={r} cy={r} r={r} fill="url(#sphere)" />
      <Ellipse cx={size * 0.34} cy={size * 0.21} rx={size * 0.15} ry={size * 0.09} fill="url(#spec)" transform={`rotate(-32 ${size * 0.34} ${size * 0.21})`} />
    </Svg>
  );
}
