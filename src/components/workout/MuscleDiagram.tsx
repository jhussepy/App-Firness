import { Text, View } from 'react-native';
import Svg, { Defs, Ellipse, LinearGradient, Path, RadialGradient, Stop } from 'react-native-svg';

import { useThemeStore } from '@/stores/theme.store';
import type { MuscleGroup } from '@/data/models/exercise';

// Anatomical front/back silhouettes with gradient shading (to read as
// volume, not flat shapes) and the trained muscles drawn as real muscle
// bellies — pecs, abs, lats, delts, quads, glutes — lit with a warm
// gradient plus a soft glow behind the active region. Fully offline SVG;
// real photos/video would need an external licensed media source.

type ViewSide = 'front' | 'back';

// ---- silhouette (shared by both views, mirrored shapes hand-written) ----

const SILHOUETTE: string[] = [
  // neck
  'M63 26 C63 33 62 36 60 39 L80 39 C78 36 77 33 77 26 Z',
  // torso with trap slope, lat taper, waist and pelvis
  'M60 38 C48 40 42 44 40 48 C38 56 40 62 44 68 C47 76 50 84 53 92 C55 100 55 106 54 114 C52 122 51 128 52 132 C58 135 64 138 70 138 C76 138 82 135 88 132 C89 128 88 122 86 114 C85 106 85 100 87 92 C90 84 93 76 96 68 C100 62 102 56 100 48 C98 44 92 40 80 38 C73 36.5 67 36.5 60 38 Z',
  // deltoid caps
  'M40 46 C33 48 29 54 30 61 C31 66 35 69 39 69 C43 68 45 62 45 56 C45 51 44 47 40 46 Z',
  'M100 46 C107 48 111 54 110 61 C109 66 105 69 101 69 C97 68 95 62 95 56 C95 51 96 47 100 46 Z',
  // upper arms
  'M31 63 C26 70 25 80 27 90 C28 95 30 98 33 99 C37 99 40 96 41 92 C43 82 43 72 41 65 C38 62 34 61 31 63 Z',
  'M109 63 C114 70 115 80 113 90 C112 95 110 98 107 99 C103 99 100 96 99 92 C97 82 97 72 99 65 C102 62 106 61 109 63 Z',
  // forearms
  'M28 96 C25 104 25 114 28 124 C29 128 31 131 34 131 C37 131 39 128 39 124 C40 114 40 104 38 97 C35 94 31 94 28 96 Z',
  'M112 96 C115 104 115 114 112 124 C111 128 109 131 106 131 C103 131 101 128 101 124 C100 114 100 104 102 97 C105 94 109 94 112 96 Z',
  // thighs
  'M52 128 C47 142 47 158 51 174 C52 180 55 184 59 184 C64 184 67 180 68 174 C70 158 70 142 68 132 C63 127 56 126 52 128 Z',
  'M88 128 C93 142 93 158 89 174 C88 180 85 184 81 184 C76 184 73 180 72 174 C70 158 70 142 72 132 C77 127 84 126 88 128 Z',
  // calves
  'M54 186 C51 194 50 206 53 218 C54 224 56 228 59 228 C62 228 64 224 65 218 C67 206 66 194 64 186 C61 183 57 183 54 186 Z',
  'M86 186 C89 194 90 206 87 218 C86 224 84 228 81 228 C78 228 76 224 75 218 C73 206 74 194 76 186 C79 183 83 183 86 186 Z',
];

// ---- muscle bellies ----

const PECS = [
  'M69 50 C60 49 52 52 50 58 C49 64 53 70 61 72 C65 73 68.5 72 69 69 L69 52 Z',
  'M71 50 C80 49 88 52 90 58 C91 64 87 70 79 72 C75 73 71.5 72 71 69 L71 52 Z',
];

const ABS = [
  // 3 x 2 pack + lower segment
  'M62.5 78 L69 78 L69 87 L62.8 87 C62.4 84 62.3 81 62.5 78 Z',
  'M71 78 L77.5 78 C77.7 81 77.6 84 77.2 87 L71 87 Z',
  'M63 89.5 L69 89.5 L69 98.5 L63.2 98.5 C63 95.5 63 92.5 63 89.5 Z',
  'M71 89.5 L77 89.5 C77 92.5 77 95.5 76.8 98.5 L71 98.5 Z',
  'M63.4 101 L69 101 L69 110 L63.8 110 C63.5 107 63.4 104 63.4 101 Z',
  'M71 101 L76.6 101 C76.6 104 76.5 107 76.2 110 L71 110 Z',
  'M63.9 112.5 L76.1 112.5 C75.6 120 72.5 125 70 125 C67.5 125 64.4 120 63.9 112.5 Z',
];

const DELTS = [SILHOUETTE[2], SILHOUETTE[3]];

const BICEPS = [
  'M33 66 C30 72 30 82 32 90 C34 94 38 94 39 90 C41 82 41 72 39 67 C37 64 35 64 33 66 Z',
  'M107 66 C110 72 110 82 108 90 C106 94 102 94 101 90 C99 82 99 72 101 67 C103 64 105 64 107 66 Z',
];

const TRICEPS = [
  'M29 66 C26 74 26 84 28 92 C30 96 33 96 35 92 C36 84 36 74 35 67 C33 63 31 63 29 66 Z',
  'M111 66 C114 74 114 84 112 92 C110 96 107 96 105 92 C104 84 104 74 105 67 C107 63 109 63 111 66 Z',
];

const QUADS = [
  'M55 132 C51 144 51 160 54 172 C56 177 61 177 63 172 C66 158 66 142 63 133 C60 129 57 129 55 132 Z',
  'M85 132 C89 144 89 160 86 172 C84 177 79 177 77 172 C74 158 74 142 77 133 C80 129 83 129 85 132 Z',
];

const CALVES = [
  'M55 188 C52 196 52 206 55 214 C58 219 62 219 64 214 C66 206 66 196 64 189 C61 185 57 185 55 188 Z',
  'M85 188 C88 196 88 206 85 214 C82 219 78 219 76 214 C74 206 74 196 76 189 C79 185 83 185 85 188 Z',
];

const TRAPS = ['M70 38 C62 39 55 42 51 46 C58 50 64 60 70 74 C76 60 82 50 89 46 C85 42 78 39 70 38 Z'];

const LATS = [
  'M48 58 C50 74 55 90 61 100 C64 96 65 84 64 74 C61 66 55 60 48 58 Z',
  'M92 58 C90 74 85 90 79 100 C76 96 75 84 76 74 C79 66 85 60 92 58 Z',
];

const LOWER_BACK = ['M70 96 C67 99 64.5 102 63.5 105 L70 117 L76.5 105 C75.5 102 73 99 70 96 Z'];

const GLUTES = [
  'M53 122 C48 128 49 138 55 142 C62 145 68 142 69 136 C69 129 65 123 60 121 C57 120 55 120 53 122 Z',
  'M87 122 C92 128 91 138 85 142 C78 145 72 142 71 136 C71 129 75 123 80 121 C83 120 85 120 87 122 Z',
];

const HEART = [
  'M70 56 C67 50 58 52 59 59 C60 65 70 71 70 71 C70 71 80 65 81 59 C82 52 73 50 70 56 Z',
];

interface Glow {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

function musclesFor(side: ViewSide, group: MuscleGroup): { shapes: string[]; glow?: Glow } {
  switch (group) {
    case 'chest':
      return side === 'front' ? { shapes: PECS, glow: { cx: 70, cy: 60, rx: 34, ry: 24 } } : { shapes: [] };
    case 'back':
      return side === 'back'
        ? { shapes: [...TRAPS, ...LATS, ...LOWER_BACK], glow: { cx: 70, cy: 72, rx: 36, ry: 40 } }
        : { shapes: [] };
    case 'shoulders':
      return { shapes: DELTS, glow: { cx: 70, cy: 56, rx: 52, ry: 20 } };
    case 'arms':
      return side === 'front'
        ? { shapes: BICEPS, glow: { cx: 70, cy: 78, rx: 54, ry: 22 } }
        : { shapes: TRICEPS, glow: { cx: 70, cy: 78, rx: 54, ry: 22 } };
    case 'core':
      return side === 'front' ? { shapes: ABS, glow: { cx: 70, cy: 100, rx: 26, ry: 32 } } : { shapes: [] };
    case 'legs':
      return side === 'front'
        ? { shapes: [...QUADS, ...CALVES], glow: { cx: 70, cy: 176, rx: 34, ry: 56 } }
        : { shapes: [...GLUTES, ...QUADS, ...CALVES], glow: { cx: 70, cy: 170, rx: 34, ry: 60 } };
    case 'cardio':
      return side === 'front' ? { shapes: HEART, glow: { cx: 70, cy: 60, rx: 22, ry: 20 } } : { shapes: [] };
    case 'full_body':
      return side === 'front'
        ? { shapes: [...PECS, ...ABS, ...DELTS, ...BICEPS, ...QUADS, ...CALVES] }
        : { shapes: [...TRAPS, ...LATS, ...LOWER_BACK, ...DELTS, ...TRICEPS, ...GLUTES, ...CALVES] };
    default:
      return { shapes: [] };
  }
}

interface FigureProps {
  side: ViewSide;
  muscleGroup: MuscleGroup;
  isDark: boolean;
}

function Figure({ side, muscleGroup, isDark }: FigureProps) {
  const bodyTop = isDark ? '#52525B' : '#E4EAF2';
  const bodyBottom = isDark ? '#27272A' : '#B7C3D3';
  const headTone = isDark ? '#3F3F46' : '#D5DDE8';
  const shadow = isDark ? '#000000' : '#334155';
  const { shapes, glow } = musclesFor(side, muscleGroup);
  const ids = `${side}`;

  return (
    <Svg width={128} height={222} viewBox="0 0 140 240">
      <Defs>
        <LinearGradient id={`body-${ids}`} gradientUnits="userSpaceOnUse" x1="30" y1="0" x2="112" y2="240">
          <Stop offset="0" stopColor={bodyTop} />
          <Stop offset="1" stopColor={bodyBottom} />
        </LinearGradient>
        <LinearGradient id={`muscle-${ids}`} gradientUnits="userSpaceOnUse" x1="40" y1="30" x2="100" y2="230">
          <Stop offset="0" stopColor="#FDBA74" />
          <Stop offset="0.45" stopColor="#F97316" />
          <Stop offset="1" stopColor="#DC2626" />
        </LinearGradient>
        <RadialGradient id={`glow-${ids}`} gradientUnits="objectBoundingBox" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#F97316" stopOpacity={isDark ? 0.42 : 0.3} />
          <Stop offset="1" stopColor="#F97316" stopOpacity={0} />
        </RadialGradient>
      </Defs>

      {/* soft glow behind the active region */}
      {glow ? <Ellipse cx={glow.cx} cy={glow.cy} rx={glow.rx + 14} ry={glow.ry + 14} fill={`url(#glow-${ids})`} /> : null}

      {/* ground shadow */}
      <Ellipse cx={70} cy={235} rx={32} ry={4.5} fill={shadow} opacity={0.16} />

      {/* silhouette */}
      <Ellipse cx={70} cy={17} rx={10.5} ry={12.5} fill={headTone} />
      {SILHOUETTE.map((d, i) => (
        <Path key={i} d={d} fill={`url(#body-${ids})`} />
      ))}

      {/* active muscles */}
      {shapes.map((d, i) => (
        <Path key={`m-${i}`} d={d} fill={`url(#muscle-${ids})`} stroke="#9A3412" strokeWidth={0.6} strokeOpacity={0.45} />
      ))}
    </Svg>
  );
}

export function MuscleDiagram({ muscleGroup }: { muscleGroup: MuscleGroup }) {
  const mode = useThemeStore((s) => s.mode);
  const isDark = mode === 'dark';

  return (
    <View className="flex-row justify-center gap-8 py-3">
      <View className="items-center">
        <Figure side="front" muscleGroup={muscleGroup} isDark={isDark} />
        <Text className="font-body text-muted text-xs mt-1.5">Frente</Text>
      </View>
      <View className="items-center">
        <Figure side="back" muscleGroup={muscleGroup} isDark={isDark} />
        <Text className="font-body text-muted text-xs mt-1.5">Espalda</Text>
      </View>
    </View>
  );
}
