import { QuizSet } from '../types';

export const QUIZ_SETS: QuizSet[] = [
  {
    id: 'quiz-visual-id-1',
    title: 'North American Field ID Mastery',
    description: 'Test your visual identification skills on field marks, beak profiles, and diagnostic plumage cues.',
    category: 'Visual Photo Identification',
    difficulty: 'Beginner',
    questions: [
      {
        id: 'q1',
        type: 'visual',
        question: 'Observe the bright crimson body, prominent head crest, and black facial mask. Which iconic songbird species is this?',
        options: ['Summer Tanager', 'Northern Cardinal', 'Pyrrhuloxia', 'Scarlet Tanager'],
        correctIndex: 1,
        explanation: 'The Northern Cardinal male is distinguished by its vivid red plumage, conspicuous raised crest, black mask surrounding the orange beak, and thick seed-crushing cone bill.',
        speciesId: 'cardinal',
        imageUrl: 'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=800&q=80',
        fieldMarkHint: 'Look at the raised crest on the crown and black mask around the orange bill.'
      },
      {
        id: 'q2',
        type: 'visual',
        question: 'Which apex aerial predator is famous for reaching dive speeds exceeding 240 mph during its hunting stoop?',
        options: ['Red-tailed Hawk', 'Cooper’s Hawk', 'Peregrine Falcon', 'American Kestrel'],
        correctIndex: 2,
        explanation: 'The Peregrine Falcon is the fastest animal on Earth, utilizing sharply pointed long wings and a dark helmet-like hood to target prey in high-speed vertical stoops.',
        speciesId: 'peregrine-falcon',
        imageUrl: 'https://images.unsplash.com/photo-1574063413132-355dbfd83e08?auto=format&fit=crop&w=800&q=80',
        fieldMarkHint: 'Note the dark mustache wedge under the eye and narrow, pointed wings.'
      },
      {
        id: 'q3',
        type: 'visual',
        question: 'This large woodpecker creates deep rectangular excavated holes in dead trees to feed on carpenter ants. Identify it:',
        options: ['Downy Woodpecker', 'Pileated Woodpecker', 'Red-bellied Woodpecker', 'Northern Flicker'],
        correctIndex: 1,
        explanation: 'The Pileated Woodpecker is crow-sized with a flaming red crest, black body, and distinct rectangular tree cavities.',
        speciesId: 'pileated-woodpecker',
        imageUrl: 'https://images.unsplash.com/photo-1628102491629-778571d893a3?auto=format&fit=crop&w=800&q=80',
        fieldMarkHint: 'Notice the flaming red crest and large crow-like body.'
      },
      {
        id: 'q4',
        type: 'visual',
        question: 'Which raptor exhibits a kinked "M-shaped" wing contour during flight and feeds almost exclusively on live fish?',
        options: ['Bald Eagle', 'Osprey', 'Marsh Harrier', 'Northern Goshawk'],
        correctIndex: 1,
        explanation: 'Ospreys have dark brown upperparts, a stark white belly, dark eye stripe, and a distinctive M-like kinked wing profile in flight.',
        speciesId: 'osprey',
        imageUrl: 'https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&w=800&q=80',
        fieldMarkHint: 'Look for the white breast, dark eye stripe, and M-shaped kinked wings.'
      }
    ]
  },
  {
    id: 'quiz-audio-id-1',
    title: 'Acoustic Bird Calls & Songs Challenge',
    description: 'Listen to synthesized acoustic tone rhythms and descriptions to identify species by sound.',
    category: 'Acoustic Bird Song Identification',
    difficulty: 'Intermediate',
    questions: [
      {
        id: 'aq1',
        type: 'audio',
        question: 'Listen to or read this call profile: A clear, rich whistle sounding like "cheer, cheer, cheer" or "birdie, birdie, birdie". Which bird is singing?',
        options: ['Blue Jay', 'Northern Cardinal', 'American Goldfinch', 'Barn Owl'],
        correctIndex: 1,
        explanation: 'Northern Cardinals sing clear, cheerful whistling phrases that sound like "cheer, cheer, cheer". Both males and females sing throughout spring and summer.',
        speciesId: 'cardinal',
        audioFrequencyHz: 1200,
        audioPattern: 'whistle-slide',
        fieldMarkHint: 'Clear whistling pitch rising and repeating in phrases.'
      },
      {
        id: 'aq2',
        type: 'audio',
        question: 'Which nocturnal predator is known for an eerie, raspy, long-drawn-out screech rather than a typical hooting call?',
        options: ['Great Horned Owl', 'Barn Owl', 'Snowy Owl', 'Screech Owl'],
        correctIndex: 1,
        explanation: 'Barn Owls produce a harsh, raspy hiss and screech, often heard at night near open fields and farm structures.',
        speciesId: 'barn-owl',
        audioFrequencyHz: 1400,
        audioPattern: 'whistle-slide',
        fieldMarkHint: 'A raspy, high-pitched screech that sounds like a hiss.'
      },
      {
        id: 'aq3',
        type: 'audio',
        question: 'Which waterside species utters a rapid, mechanical rattling call in flight as it patrols river margins?',
        options: ['Belted Kingfisher', 'Great Blue Heron', 'Pileated Woodpecker', 'Osprey'],
        correctIndex: 0,
        explanation: 'The Belted Kingfisher emits a loud, dry, machine-gun-like rattle while flying along streams, rivers, and lake shores.',
        speciesId: 'belted-kingfisher',
        audioFrequencyHz: 1600,
        audioPattern: 'rapid-peck',
        fieldMarkHint: 'Rapid mechanical chatter pattern.'
      }
    ]
  },
  {
    id: 'quiz-anatomy-1',
    title: 'Avian Anatomy, Physics & Flight Adaptation',
    description: 'Deepen your knowledge of wing mechanics, feather structures, beak evolution, and thermoregulation.',
    category: 'Avian Biology & Physics',
    difficulty: 'Expert',
    questions: [
      {
        id: 'an1',
        type: 'anatomy',
        question: 'Which specialized wing flight feather category forms the main propulsive outer flight feathers attached to the hand/carpometacarpus bones?',
        options: ['Secondary Remiges', 'Primary Remiges', 'Rectrices', 'Greater Coverts'],
        correctIndex: 1,
        explanation: 'Primary remiges are the outermost flight feathers that provide forward thrust during active flapping flight.',
        fieldMarkHint: 'Look at the outer edge of the wing tip.'
      },
      {
        id: 'an2',
        type: 'anatomy',
        question: 'Why can hummingbirds flap their wings in a figure-8 pattern and hover continuously while other birds cannot?',
        options: ['Flexible spine bones', 'Extremely short humerus with 75% of flight muscle power on upstroke and downstroke', 'Extra lung capacity', 'Tail feather air sacks'],
        correctIndex: 1,
        explanation: 'Hummingbirds have a rigid, fused shoulder joint and tiny humerus bone. Their massive supracoracoideus muscles generate lift on both the forward stroke AND the backward stroke in a figure-8 motion!',
        fieldMarkHint: 'Focus on muscle power allocation across the upstroke vs downstroke.'
      },
      {
        id: 'an3',
        type: 'anatomy',
        question: 'What physiological mechanism prevents the brain of a Pileated Woodpecker from concussing despite hammering trees at 1,000 Gs?',
        options: ['Air cushions behind eyes', 'Hyoid bone wrapped around the skull like a safety helmet and spongy cranial bones', 'Thick double-layered skull skin', 'Fluid-filled beak joints'],
        correctIndex: 1,
        explanation: 'The long, flexible hyoid bone originates in the nostril, splits into two horns, wraps entirely around the back of the skull, and acts as a dynamic seatbelt/shock absorber during impacts!',
        speciesId: 'pileated-woodpecker',
        fieldMarkHint: 'Think about a anatomical bone sling wrapping around the skull.'
      }
    ]
  }
];
