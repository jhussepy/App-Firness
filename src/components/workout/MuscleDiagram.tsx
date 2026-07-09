import { Text, View } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import { useThemeColors } from '@/theme/use-theme-colors';
import type { MuscleGroup } from '@/data/models/exercise';

// Stylized front/back body silhouettes with the trained muscle group
// highlighted. Schematic on purpose — real exercise photos/videos need an
// external media source, which this offline demo doesn't have.

type ViewSide = 'front' | 'back';

interface FigureProps {
  side: ViewSide;
  muscleGroup: MuscleGroup;
  baseColor: string;
  highlightColor: string;
}

function highlightsFor(side: ViewSide, group: MuscleGroup, fill: string) {
  const shoulders = (
    <>
      <Circle cx={37} cy={40} r={7} fill={fill} />
      <Circle cx={83} cy={40} r={7} fill={fill} />
    </>
  );
  const upperArms = (
    <>
      <Rect x={25} y={44} width={11} height={28} rx={5.5} fill={fill} />
      <Rect x={84} y={44} width={11} height={28} rx={5.5} fill={fill} />
    </>
  );
  const upperLegs = (
    <>
      <Rect x={44} y={102} width={14} height={44} rx={7} fill={fill} />
      <Rect x={62} y={102} width={14} height={44} rx={7} fill={fill} />
    </>
  );
  const lowerLegs = (
    <>
      <Rect x={46} y={152} width={11} height={36} rx={5.5} fill={fill} />
      <Rect x={63} y={152} width={11} height={36} rx={5.5} fill={fill} />
    </>
  );
  const torso = <Rect x={42} y={36} width={36} height={58} rx={10} fill={fill} />;

  switch (group) {
    case 'chest':
      return side === 'front' ? (
        <>
          <Ellipse cx={51} cy={48} rx={9} ry={6.5} fill={fill} />
          <Ellipse cx={69} cy={48} rx={9} ry={6.5} fill={fill} />
        </>
      ) : null;
    case 'back':
      return side === 'back' ? (
        <Path d="M44 36 L76 36 L71 76 Q60 84 49 76 Z" fill={fill} />
      ) : null;
    case 'shoulders':
      return shoulders;
    case 'arms':
      return upperArms;
    case 'core':
      return side === 'front' ? <Rect x={50} y={57} width={20} height={34} rx={6} fill={fill} /> : null;
    case 'legs':
      return side === 'front' ? (
        <>
          {upperLegs}
          {lowerLegs}
        </>
      ) : (
        <>
          <Ellipse cx={52} cy={102} rx={8} ry={7} fill={fill} />
          <Ellipse cx={68} cy={102} rx={8} ry={7} fill={fill} />
          {upperLegs}
          {lowerLegs}
        </>
      );
    case 'cardio':
      return side === 'front' ? (
        <Path
          d="M60 46 C57 40 48 42 49 49 C50 55 60 61 60 61 C60 61 70 55 71 49 C72 42 63 40 60 46 Z"
          fill={fill}
        />
      ) : null;
    case 'full_body':
      return (
        <>
          {torso}
          {shoulders}
          {upperArms}
          {upperLegs}
          {lowerLegs}
        </>
      );
    default:
      return null;
  }
}

function Figure({ side, muscleGroup, baseColor, highlightColor }: FigureProps) {
  return (
    <Svg width={110} height={192} viewBox="0 0 120 200">
      {/* silhouette */}
      <Circle cx={60} cy={16} r={10} fill={baseColor} />
      <Rect x={54} y={25} width={12} height={8} rx={3} fill={baseColor} />
      <Path d="M42 33 L78 33 Q84 34 83 42 L78 90 Q77 97 70 97 L50 97 Q43 97 42 90 L37 42 Q36 34 42 33 Z" fill={baseColor} />
      <Rect x={24} y={36} width={13} height={38} rx={6.5} fill={baseColor} />
      <Rect x={83} y={36} width={13} height={38} rx={6.5} fill={baseColor} />
      <Rect x={26} y={74} width={10} height={28} rx={5} fill={baseColor} />
      <Rect x={84} y={74} width={10} height={28} rx={5} fill={baseColor} />
      <Rect x={43} y={96} width={16} height={54} rx={8} fill={baseColor} />
      <Rect x={61} y={96} width={16} height={54} rx={8} fill={baseColor} />
      <Rect x={45} y={150} width={12} height={40} rx={6} fill={baseColor} />
      <Rect x={63} y={150} width={12} height={40} rx={6} fill={baseColor} />
      <Ellipse cx={51} cy={194} rx={8} ry={4} fill={baseColor} />
      <Ellipse cx={69} cy={194} rx={8} ry={4} fill={baseColor} />
      {/* highlighted muscle group */}
      {highlightsFor(side, muscleGroup, highlightColor)}
    </Svg>
  );
}

export function MuscleDiagram({ muscleGroup }: { muscleGroup: MuscleGroup }) {
  const colors = useThemeColors();
  const base = colors.border;
  const highlight = colors.primary;

  return (
    <View className="flex-row justify-center gap-10 py-2">
      <View className="items-center">
        <Figure side="front" muscleGroup={muscleGroup} baseColor={base} highlightColor={highlight} />
        <Text className="font-body text-muted text-xs mt-1.5">Frente</Text>
      </View>
      <View className="items-center">
        <Figure side="back" muscleGroup={muscleGroup} baseColor={base} highlightColor={highlight} />
        <Text className="font-body text-muted text-xs mt-1.5">Espalda</Text>
      </View>
    </View>
  );
}
