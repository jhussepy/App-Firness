import type { Exercise } from '../models/exercise';

// Fixed, human-readable ids (not generateId()) so routines.seed.ts can
// reference them deterministically. Ids must never change once shipped —
// stored workout sessions and routines reference them.
function ex(
  id: string,
  name: string,
  muscleGroup: Exercise['muscleGroup'],
  equipment: Exercise['equipment'],
  instructions: string[],
  tips?: string
): Exercise {
  return { id: `ex-${id}`, name, muscleGroup, equipment, isCustom: false, instructions, tips };
}

export const seedExercises: Exercise[] = [
  // Chest
  ex('barbell-bench-press', 'Barbell Bench Press', 'chest', 'barbell', [
    'Acuéstate en el banco con los pies firmes en el suelo y agarra la barra un poco más ancho que los hombros.',
    'Baja la barra con control hasta rozar la mitad del pecho, con los codos a unos 45° del torso.',
    'Empuja la barra hacia arriba hasta extender los brazos, sin bloquear los codos.',
  ], 'Mantén los omóplatos retraídos y pegados al banco durante todo el movimiento.'),
  ex('incline-barbell-bench-press', 'Incline Barbell Bench Press', 'chest', 'barbell', [
    'Ajusta el banco a 30–45° de inclinación y agarra la barra un poco más ancho que los hombros.',
    'Baja la barra con control hasta la parte alta del pecho.',
    'Empuja hacia arriba siguiendo una línea ligeramente diagonal hasta extender los brazos.',
  ], 'A mayor inclinación, más trabajo para hombros; mantente entre 30 y 45° para enfocar el pecho superior.'),
  ex('dumbbell-bench-press', 'Dumbbell Bench Press', 'chest', 'dumbbell', [
    'Acuéstate con una mancuerna en cada mano a la altura del pecho, palmas hacia adelante.',
    'Empuja las mancuernas hacia arriba hasta casi juntarlas sobre el pecho.',
    'Bájalas con control hasta sentir un estiramiento suave en el pecho.',
  ], 'Las mancuernas permiten mayor rango de movimiento que la barra: aprovéchalo sin perder el control.'),
  ex('incline-dumbbell-press', 'Incline Dumbbell Press', 'chest', 'dumbbell', [
    'Ajusta el banco a 30–45° y apoya una mancuerna en cada muslo antes de acostarte.',
    'Lleva las mancuernas a los lados del pecho superior y empuja hacia arriba.',
    'Baja con control de 2 a 3 segundos hasta la posición inicial.',
  ]),
  ex('dumbbell-fly', 'Dumbbell Fly', 'chest', 'dumbbell', [
    'Acuéstate con las mancuernas sobre el pecho, palmas enfrentadas y codos ligeramente flexionados.',
    'Abre los brazos en arco hasta sentir el estiramiento en el pecho.',
    'Cierra el arco apretando el pecho, como si abrazaras un árbol.',
  ], 'No bajes los codos más allá de la línea de los hombros para proteger la articulación.'),
  ex('cable-crossover', 'Cable Crossover', 'chest', 'cable', [
    'Coloca las poleas en posición alta, toma un agarre en cada mano y da un paso adelante.',
    'Con codos levemente flexionados, junta las manos frente al pecho en un arco descendente.',
    'Regresa con control hasta sentir el estiramiento en el pecho.',
  ]),
  ex('push-up', 'Push-Up', 'chest', 'bodyweight', [
    'Apoya manos al ancho de hombros y pies juntos, con el cuerpo en línea recta.',
    'Baja el pecho hasta casi tocar el suelo, con los codos a unos 45°.',
    'Empuja el suelo para volver arriba manteniendo el abdomen apretado.',
  ], 'Si aún es difícil, apoya las rodillas; si es fácil, eleva los pies.'),
  ex('dip', 'Chest Dip', 'chest', 'bodyweight', [
    'Sujétate en las paralelas con los brazos extendidos e inclina el torso hacia adelante.',
    'Baja flexionando los codos hasta sentir el estiramiento en el pecho.',
    'Empuja hacia arriba hasta extender los brazos.',
  ], 'La inclinación hacia adelante enfoca el pecho; el torso vertical enfoca los tríceps.'),
  ex('machine-chest-press', 'Machine Chest Press', 'chest', 'machine', [
    'Ajusta el asiento para que las manijas queden a la altura del pecho.',
    'Empuja las manijas hacia adelante hasta extender los brazos sin bloquear codos.',
    'Regresa con control hasta que el pecho quede ligeramente estirado.',
  ]),
  ex('pec-deck', 'Pec Deck', 'chest', 'machine', [
    'Siéntate con la espalda apoyada y los antebrazos o manos en las almohadillas.',
    'Junta los brazos al frente apretando el pecho.',
    'Abre con control hasta sentir el estiramiento, sin rebotar.',
  ]),

  // Back
  ex('deadlift', 'Deadlift', 'back', 'barbell', [
    'Pies al ancho de caderas con la barra sobre el medio del pie; agarra la barra justo fuera de las piernas.',
    'Pecho arriba y espalda neutra: empuja el suelo con las piernas y sube la barra pegada al cuerpo.',
    'Termina de pie con cadera y rodillas extendidas; baja la barra con el mismo control.',
  ], 'La cadera y los hombros deben subir al mismo tiempo; si la cadera sube primero, baja el peso.'),
  ex('barbell-row', 'Barbell Row', 'back', 'barbell', [
    'Con la barra en las manos, flexiona la cadera hasta inclinar el torso unos 45° con la espalda recta.',
    'Tira de la barra hacia el abdomen bajo, llevando los codos hacia atrás.',
    'Baja con control hasta extender los brazos.',
  ], 'Evita el impulso con la espalda baja: si necesitas balancearte, reduce el peso.'),
  ex('pull-up', 'Pull-Up', 'back', 'bodyweight', [
    'Cuélgate de la barra con agarre prono (palmas al frente) un poco más ancho que los hombros.',
    'Tira de los codos hacia abajo hasta que la barbilla pase la barra.',
    'Baja con control hasta extender los brazos por completo.',
  ], 'Piensa en llevar el pecho hacia la barra, no la barbilla.'),
  ex('chin-up', 'Chin-Up', 'back', 'bodyweight', [
    'Cuélgate con agarre supino (palmas hacia ti) al ancho de hombros.',
    'Sube hasta que la barbilla supere la barra, manteniendo el core firme.',
    'Baja lento hasta la extensión completa.',
  ], 'El agarre supino involucra más los bíceps que el pull-up clásico.'),
  ex('lat-pulldown', 'Lat Pulldown', 'back', 'cable', [
    'Siéntate con los muslos fijos bajo el soporte y agarra la barra más ancho que los hombros.',
    'Tira de la barra hacia la parte alta del pecho llevando los codos hacia abajo y atrás.',
    'Regresa con control hasta extender los brazos.',
  ], 'No lleves la barra detrás de la nuca; al pecho es más seguro y efectivo.'),
  ex('seated-cable-row', 'Seated Cable Row', 'back', 'cable', [
    'Siéntate con las rodillas semiflexionadas y agarra el maneral con la espalda recta.',
    'Tira del maneral hacia el abdomen juntando los omóplatos.',
    'Extiende los brazos con control sin dejar caer los hombros hacia adelante.',
  ]),
  ex('dumbbell-row', 'One-Arm Dumbbell Row', 'back', 'dumbbell', [
    'Apoya rodilla y mano del mismo lado en un banco, con la espalda paralela al suelo.',
    'Tira de la mancuerna hacia la cadera llevando el codo pegado al cuerpo.',
    'Baja con control hasta estirar el brazo por completo.',
  ], 'Evita rotar el torso al subir la mancuerna; el movimiento sale del dorsal.'),
  ex('t-bar-row', 'T-Bar Row', 'back', 'machine', [
    'Colócate sobre la barra con el pecho apoyado o el torso inclinado y la espalda recta.',
    'Tira de las manijas hacia el pecho juntando los omóplatos.',
    'Baja con control hasta extender los brazos.',
  ]),
  ex('face-pull', 'Face Pull', 'back', 'cable', [
    'Coloca la polea a la altura de la cara con el accesorio de cuerda.',
    'Tira de la cuerda hacia la cara separando las manos, con los codos altos.',
    'Regresa con control manteniendo los hombros abajo.',
  ], 'Excelente para la salud del hombro: usa peso ligero y técnica estricta.'),
  ex('hyperextension', 'Back Hyperextension', 'back', 'bodyweight', [
    'Colócate en el banco a 45° con las caderas sobre el borde de la almohadilla.',
    'Baja el torso flexionando la cadera con la espalda neutra.',
    'Sube hasta alinear el torso con las piernas, apretando glúteos y espalda baja.',
  ], 'No hiperextiendas al subir: detente cuando el cuerpo forme una línea recta.'),

  // Legs
  ex('barbell-squat', 'Barbell Back Squat', 'legs', 'barbell', [
    'Apoya la barra sobre los trapecios y separa los pies al ancho de hombros.',
    'Baja flexionando cadera y rodillas a la vez, con el pecho arriba y las rodillas alineadas con los pies.',
    'Baja al menos hasta que los muslos queden paralelos al suelo y sube empujando con toda la planta.',
  ], 'Mantén el core apretado como si fueras a recibir un golpe; eso protege la espalda baja.'),
  ex('front-squat', 'Front Squat', 'legs', 'barbell', [
    'Apoya la barra sobre los deltoides frontales con los codos altos y paralelos al suelo.',
    'Baja en sentadilla manteniendo el torso lo más vertical posible.',
    'Sube empujando el suelo sin dejar caer los codos.',
  ], 'Si los codos caen, la barra se va hacia adelante: piensa en llevarlos siempre hacia arriba.'),
  ex('leg-press', 'Leg Press', 'legs', 'machine', [
    'Siéntate con los pies al ancho de hombros en el centro de la plataforma.',
    'Baja la plataforma con control hasta que las rodillas formen unos 90°.',
    'Empuja hasta extender las piernas sin bloquear las rodillas.',
  ], 'No despegues la cadera del asiento al bajar: reduce el rango antes que redondear la espalda.'),
  ex('romanian-deadlift', 'Romanian Deadlift', 'legs', 'barbell', [
    'De pie con la barra frente a los muslos y las rodillas semiflexionadas.',
    'Empuja la cadera hacia atrás bajando la barra pegada a las piernas, con la espalda recta.',
    'Cuando sientas el estiramiento en los isquios, sube apretando los glúteos.',
  ], 'El movimiento es de cadera, no de rodillas: baja solo hasta donde tu flexibilidad lo permita.'),
  ex('walking-lunge', 'Walking Lunge', 'legs', 'dumbbell', [
    'De pie con una mancuerna en cada mano, da un paso largo hacia adelante.',
    'Baja hasta que ambas rodillas formen 90°, sin que la rodilla trasera golpee el suelo.',
    'Impúlsate con la pierna delantera y da el siguiente paso con la otra pierna.',
  ]),
  ex('bulgarian-split-squat', 'Bulgarian Split Squat', 'legs', 'dumbbell', [
    'Coloca el empeine del pie trasero sobre un banco, con el pie delantero a un paso largo.',
    'Baja vertical hasta que el muslo delantero quede paralelo al suelo.',
    'Sube empujando con el talón delantero.',
  ], 'Si pierdes el equilibrio, alarga un poco el paso y mira a un punto fijo.'),
  ex('leg-extension', 'Leg Extension', 'legs', 'machine', [
    'Siéntate con las espinillas detrás de la almohadilla y las rodillas alineadas con el eje de la máquina.',
    'Extiende las piernas hasta arriba apretando los cuádriceps.',
    'Baja con control sin dejar caer el peso.',
  ]),
  ex('leg-curl', 'Leg Curl', 'legs', 'machine', [
    'Colócate en la máquina con la almohadilla sobre los tobillos.',
    'Flexiona las rodillas llevando los talones hacia los glúteos.',
    'Regresa con control hasta extender las piernas.',
  ]),
  ex('calf-raise', 'Standing Calf Raise', 'legs', 'machine', [
    'Apoya la punta de los pies en la plataforma con los talones colgando.',
    'Baja los talones hasta sentir el estiramiento en las pantorrillas.',
    'Sube de puntas lo más alto posible y aguanta un segundo arriba.',
  ], 'Haz una pausa arriba y abajo: el rebote le quita casi todo el trabajo a la pantorrilla.'),
  ex('goblet-squat', 'Goblet Squat', 'legs', 'dumbbell', [
    'Sostén una mancuerna vertical contra el pecho con ambas manos.',
    'Baja en sentadilla manteniendo el torso erguido y los codos por dentro de las rodillas.',
    'Sube empujando el suelo con toda la planta del pie.',
  ], 'Ideal para aprender el patrón de sentadilla antes de pasar a la barra.'),
  ex('hip-thrust', 'Barbell Hip Thrust', 'legs', 'barbell', [
    'Apoya la espalda alta en un banco con la barra sobre la cadera (usa protector).',
    'Empuja la cadera hacia arriba hasta alinear torso y muslos, apretando fuerte los glúteos.',
    'Baja con control sin apoyar del todo la cadera en el suelo.',
  ], 'Mantén la barbilla ligeramente metida y la mirada al frente durante el empuje.'),
  ex('bodyweight-squat', 'Bodyweight Squat', 'legs', 'bodyweight', [
    'De pie con los pies al ancho de hombros y los brazos al frente.',
    'Baja flexionando cadera y rodillas hasta que los muslos queden paralelos al suelo.',
    'Sube empujando con los talones y aprieta glúteos arriba.',
  ]),

  // Shoulders
  ex('overhead-press', 'Barbell Overhead Press', 'shoulders', 'barbell', [
    'De pie con la barra apoyada en las clavículas y el agarre justo fuera de los hombros.',
    'Empuja la barra vertical hacia arriba, moviendo la cabeza ligeramente hacia atrás para dejarla pasar.',
    'Bloquea los brazos arriba con la barra sobre el centro de la cabeza, y baja con control.',
  ], 'Aprieta glúteos y abdomen para no arquear la espalda baja al empujar.'),
  ex('dumbbell-shoulder-press', 'Dumbbell Shoulder Press', 'shoulders', 'dumbbell', [
    'Sentado o de pie, lleva las mancuernas a la altura de las orejas con las palmas al frente.',
    'Empuja hacia arriba hasta casi juntarlas sobre la cabeza.',
    'Baja con control hasta la altura de las orejas.',
  ]),
  ex('lateral-raise', 'Dumbbell Lateral Raise', 'shoulders', 'dumbbell', [
    'De pie con una mancuerna en cada mano a los costados y codos apenas flexionados.',
    'Eleva los brazos hacia los lados hasta la altura de los hombros.',
    'Baja con control de 2 a 3 segundos.',
  ], 'Sube como si sirvieras dos jarras de agua; no encojas los hombros.'),
  ex('front-raise', 'Dumbbell Front Raise', 'shoulders', 'dumbbell', [
    'De pie con las mancuernas frente a los muslos.',
    'Eleva un brazo (o ambos) al frente hasta la altura de los hombros.',
    'Baja con control sin balancear el torso.',
  ]),
  ex('rear-delt-fly', 'Rear Delt Fly', 'shoulders', 'dumbbell', [
    'Inclina el torso hacia adelante casi paralelo al suelo, con una mancuerna en cada mano.',
    'Abre los brazos hacia los lados apretando la parte posterior del hombro.',
    'Baja con control sin dar impulso.',
  ], 'Usa poco peso: este músculo es pequeño y el impulso arruina el estímulo.'),
  ex('arnold-press', 'Arnold Press', 'shoulders', 'dumbbell', [
    'Comienza con las mancuernas frente al pecho, palmas hacia ti.',
    'Empuja hacia arriba rotando las muñecas hasta terminar con las palmas al frente.',
    'Baja deshaciendo la rotación hasta la posición inicial.',
  ]),
  ex('cable-lateral-raise', 'Cable Lateral Raise', 'shoulders', 'cable', [
    'Colócate de lado a la polea baja y toma el agarre con la mano más lejana.',
    'Eleva el brazo hacia el lado hasta la altura del hombro.',
    'Baja con control manteniendo la tensión del cable.',
  ], 'La polea mantiene tensión constante donde las mancuernas la pierden: aprovéchala con series lentas.'),
  ex('shrug', 'Barbell Shrug', 'shoulders', 'barbell', [
    'De pie con la barra frente a los muslos y los brazos extendidos.',
    'Encoge los hombros hacia las orejas lo más alto posible.',
    'Aguanta un segundo arriba y baja con control.',
  ], 'No gires los hombros en círculo; el movimiento es solo vertical.'),

  // Arms
  ex('barbell-curl', 'Barbell Curl', 'arms', 'barbell', [
    'De pie con la barra en agarre supino al ancho de hombros.',
    'Flexiona los codos llevando la barra hacia los hombros, con los codos pegados al torso.',
    'Baja con control hasta extender los brazos.',
  ], 'Si balanceas el cuerpo para subir la barra, el peso es demasiado.'),
  ex('dumbbell-curl', 'Dumbbell Curl', 'arms', 'dumbbell', [
    'De pie con una mancuerna en cada mano, palmas al frente.',
    'Flexiona un codo llevando la mancuerna al hombro sin mover el brazo.',
    'Baja con control y alterna o trabaja ambos brazos a la vez.',
  ]),
  ex('hammer-curl', 'Hammer Curl', 'arms', 'dumbbell', [
    'Sostén las mancuernas con agarre neutro (palmas enfrentadas).',
    'Flexiona los codos manteniendo el agarre neutro todo el recorrido.',
    'Baja con control hasta extender los brazos.',
  ], 'El agarre de martillo enfatiza el braquial y el antebrazo.'),
  ex('preacher-curl', 'Preacher Curl', 'arms', 'machine', [
    'Apoya la parte posterior de los brazos en el banco predicador.',
    'Flexiona los codos subiendo el peso hasta arriba.',
    'Baja lento hasta casi extender los brazos, sin bloquear los codos abajo.',
  ]),
  ex('cable-curl', 'Cable Curl', 'arms', 'cable', [
    'De pie frente a la polea baja con la barra o cuerda en agarre supino.',
    'Flexiona los codos hacia los hombros manteniéndolos fijos al torso.',
    'Baja con control manteniendo la tensión del cable.',
  ]),
  ex('triceps-pushdown', 'Triceps Pushdown', 'arms', 'cable', [
    'Frente a la polea alta, toma la barra o cuerda con los codos pegados al cuerpo.',
    'Extiende los brazos hacia abajo hasta bloquear suavemente.',
    'Sube con control solo hasta que los antebrazos pasen la paralela.',
  ], 'Los codos son bisagras fijas: si se mueven hacia adelante, es el hombro el que trabaja.'),
  ex('skull-crusher', 'Skull Crusher', 'arms', 'barbell', [
    'Acostado, sostén la barra (idealmente Z) sobre el pecho con agarre estrecho.',
    'Flexiona solo los codos bajando la barra hacia la frente.',
    'Extiende los brazos de vuelta arriba sin mover los hombros.',
  ], 'Baja con control: la muñeca ligeramente flexionada protege los codos.'),
  ex('overhead-triceps-extension', 'Overhead Triceps Extension', 'arms', 'dumbbell', [
    'Sostén una mancuerna con ambas manos sobre la cabeza, brazos extendidos.',
    'Baja la mancuerna detrás de la cabeza flexionando solo los codos.',
    'Extiende los brazos de vuelta arriba apretando los tríceps.',
  ]),
  ex('close-grip-bench-press', 'Close-Grip Bench Press', 'arms', 'barbell', [
    'Acuéstate en el banco y agarra la barra al ancho de hombros o apenas menos.',
    'Baja la barra al pecho bajo con los codos pegados al cuerpo.',
    'Empuja hacia arriba enfocando la extensión en los tríceps.',
  ], 'No juntes demasiado las manos: al ancho de hombros ya es agarre cerrado.'),
  ex('bench-dip', 'Bench Dip', 'arms', 'bodyweight', [
    'Apoya las manos en el borde de un banco por detrás de ti, piernas extendidas al frente.',
    'Baja el cuerpo flexionando los codos hasta unos 90°.',
    'Empuja hacia arriba hasta extender los brazos.',
  ], 'Mantén la espalda cerca del banco; alejarte carga en exceso los hombros.'),

  // Core
  ex('plank', 'Plank', 'core', 'bodyweight', [
    'Apóyate sobre antebrazos y puntas de los pies con el cuerpo en línea recta.',
    'Aprieta abdomen y glúteos para que la cadera no caiga ni suba.',
    'Respira normal y mantén la posición el tiempo objetivo.',
  ], 'Calidad sobre tiempo: 30 segundos perfectos valen más que 2 minutos con la cadera caída.'),
  ex('crunch', 'Crunch', 'core', 'bodyweight', [
    'Acuéstate con las rodillas flexionadas y las manos junto a las orejas.',
    'Despega los omóplatos del suelo contrayendo el abdomen.',
    'Baja con control sin apoyar del todo la cabeza entre repeticiones.',
  ], 'No tires del cuello con las manos; el movimiento es corto y sale del abdomen.'),
  ex('hanging-leg-raise', 'Hanging Leg Raise', 'core', 'bodyweight', [
    'Cuélgate de la barra con los brazos extendidos.',
    'Eleva las piernas (rectas o con rodillas flexionadas) hasta la altura de la cadera o más.',
    'Baja con control evitando el balanceo.',
  ], 'Inclina ligeramente la pelvis hacia atrás al subir para activar de verdad el abdomen.'),
  ex('cable-woodchop', 'Cable Woodchop', 'core', 'cable', [
    'De lado a la polea alta, toma el agarre con ambas manos.',
    'Gira el torso llevando las manos en diagonal hacia la rodilla contraria.',
    'Regresa con control resistiendo la rotación.',
  ]),
  ex('russian-twist', 'Russian Twist', 'core', 'bodyweight', [
    'Sentado con las rodillas flexionadas, inclina el torso hacia atrás unos 45°.',
    'Gira el torso llevando las manos (o un peso) de un lado al otro.',
    'Controla el giro desde el abdomen, no desde los brazos.',
  ]),
  ex('ab-wheel-rollout', 'Ab Wheel Rollout', 'core', 'other', [
    'De rodillas con la rueda bajo los hombros.',
    'Rueda hacia adelante extendiendo el cuerpo sin arquear la espalda baja.',
    'Regresa tirando desde el abdomen hasta la posición inicial.',
  ], 'Avanza solo hasta donde puedas mantener la espalda neutra; el rango crece con la práctica.'),
  ex('side-plank', 'Side Plank', 'core', 'bodyweight', [
    'Apóyate sobre un antebrazo con los pies apilados y el cuerpo en línea recta.',
    'Eleva la cadera hasta alinear tobillos, cadera y hombros.',
    'Mantén la posición y luego cambia de lado.',
  ]),
  ex('mountain-climber', 'Mountain Climber', 'core', 'bodyweight', [
    'En posición de plancha alta con las manos bajo los hombros.',
    'Lleva una rodilla hacia el pecho y regrésala mientras traes la otra.',
    'Alterna a ritmo constante sin elevar la cadera.',
  ]),

  // Cardio / full body
  ex('treadmill-run', 'Treadmill Run', 'cardio', 'machine', [
    'Comienza caminando 2–3 minutos para calentar.',
    'Sube a tu ritmo objetivo manteniendo una postura erguida y zancada natural.',
    'Termina bajando el ritmo gradualmente antes de detener la cinta.',
  ], 'Para intervalos: alterna 1 minuto rápido con 1–2 minutos suaves.'),
  ex('stationary-bike', 'Stationary Bike', 'cardio', 'machine', [
    'Ajusta el asiento para que la rodilla quede casi extendida en el punto bajo del pedaleo.',
    'Pedalea a cadencia constante con el torso relajado.',
    'Ajusta la resistencia según el objetivo: ligera para fondo, alta para intervalos.',
  ]),
  ex('rowing-machine', 'Rowing Machine', 'cardio', 'machine', [
    'Empuja primero con las piernas manteniendo los brazos extendidos.',
    'Cuando las piernas casi se extienden, inclina levemente el torso atrás y tira del maneral al abdomen.',
    'Regresa en orden inverso: brazos, torso y piernas.',
  ], 'La secuencia es piernas–torso–brazos al tirar, y brazos–torso–piernas al volver.'),
  ex('jump-rope', 'Jump Rope', 'cardio', 'other', [
    'Salta con ambos pies apenas unos centímetros del suelo.',
    'Gira la cuerda desde las muñecas, no desde los hombros.',
    'Aterriza suave sobre la punta de los pies con las rodillas relajadas.',
  ]),
  ex('burpee', 'Burpee', 'full_body', 'bodyweight', [
    'Desde de pie, baja a cuclillas y apoya las manos en el suelo.',
    'Lanza los pies atrás a posición de plancha y haz una flexión.',
    'Recoge los pies, ponte de pie y salta con los brazos arriba.',
  ]),
  ex('kettlebell-swing', 'Kettlebell Swing', 'full_body', 'other', [
    'Con la kettlebell entre las piernas, flexiona la cadera con la espalda recta.',
    'Impulsa la cadera hacia adelante con fuerza para lanzar la kettlebell hasta la altura del pecho.',
    'Deja que baje entre las piernas y encadena el siguiente swing.',
  ], 'Es un empuje de cadera, no un levantamiento con los brazos: ellos solo guían.'),
  ex('clean-and-press', 'Clean and Press', 'full_body', 'barbell', [
    'Levanta la barra del suelo de forma explosiva y recíbela sobre los hombros.',
    'Estabiliza un instante con el core firme.',
    'Empuja la barra sobre la cabeza hasta bloquear los brazos y baja con control.',
  ], 'Domina cada fase por separado (cargada y press) antes de encadenarlas con peso.'),
  ex('thruster', 'Dumbbell Thruster', 'full_body', 'dumbbell', [
    'Con las mancuernas a la altura de los hombros, baja en sentadilla completa.',
    'Sube con impulso y usa esa inercia para empujar las mancuernas sobre la cabeza.',
    'Baja las mancuernas a los hombros y encadena la siguiente repetición.',
  ]),
];
