import { QuizQuestion, Quiz } from "./types";

export const introductionQuiz: QuizQuestion[] = [
  {
    id: "intro-1",
    type: "multiple-choice",
    question: "What is electric current?",
    options: [
      "The flow of electric charge through a conductor",
      "The resistance to electrical flow",
      "The amount of work done by electricity",
      "The speed of light in a vacuum"
    ],
    correctAnswer: "The flow of electric charge through a conductor",
    explanation: "Electric current is defined as the flow of electric charge (typically electrons) through a conductor such as a wire.",
    difficulty: "easy",
    topic: "basic-concepts"
  },
  {
    id: "intro-2",
    type: "true-false",
    question: "Voltage is measured in amperes.",
    correctAnswer: false,
    explanation: "Voltage is measured in volts (V), not amperes. Amperes (A) are the unit for measuring electric current.",
    difficulty: "easy",
    topic: "units"
  },
  {
    id: "intro-3",
    type: "calculation",
    question: "Calculate the current in a circuit with 12V voltage and 4Ω resistance. (A)",
    correctAnswer: 3,
    explanation: "Using Ohm's Law: I = V/R = 12V / 4Ω = 3A",
    difficulty: "medium",
    topic: "ohms-law"
  },
  {
    id: "intro-4",
    type: "multiple-choice",
    question: "Which of the following is a good conductor of electricity?",
    options: [
      "Rubber",
      "Glass",
      "Copper",
      "Plastic"
    ],
    correctAnswer: "Copper",
    explanation: "Copper is an excellent conductor of electricity due to its free electrons that can move easily through the material.",
    difficulty: "easy",
    topic: "conductors-insulators"
  },
  {
    id: "intro-5",
    type: "circuit",
    question: "In the circuit diagram below, which component controls the flow of current?",
    correctAnswer: "switch",
    explanation: "A switch is designed to control the flow of current by opening or closing the circuit path.",
    difficulty: "easy",
    topic: "circuit-components"
  }
];

export const ohmsLawQuiz: QuizQuestion[] = [
  {
    id: "ohm-1",
    type: "calculation",
    question: "A resistor has 6V across it and 2A flowing through it. What is its resistance? (Ω)",
    correctAnswer: 3,
    explanation: "Using Ohm's Law: R = V/I = 6V / 2A = 3Ω",
    difficulty: "medium",
    topic: "ohms-law"
  },
  {
    id: "ohm-2",
    type: "multiple-choice",
    question: "Ohm's Law states that:",
    options: [
      "V = I × R",
      "P = V × I",
      "I = P / V",
      "R = P / I²"
    ],
    correctAnswer: "V = I × R",
    explanation: "Ohm's Law is expressed as V = I × R, where V is voltage, I is current, and R is resistance.",
    difficulty: "easy",
    topic: "ohms-law"
  },
  {
    id: "ohm-3",
    type: "calculation",
    question: "What voltage is needed to push 0.5A through a 24Ω resistor? (V)",
    correctAnswer: 12,
    explanation: "Using Ohm's Law: V = I × R = 0.5A × 24Ω = 12V",
    difficulty: "medium",
    topic: "ohms-law"
  },
  {
    id: "ohm-4",
    type: "true-false",
    question: "If resistance increases while voltage stays constant, current will increase.",
    correctAnswer: false,
    explanation: "If resistance increases while voltage stays constant, current will decrease according to Ohm's Law (I = V/R).",
    difficulty: "medium",
    topic: "ohms-law"
  },
  {
    id: "ohm-5",
    type: "calculation",
    question: "Calculate the power dissipated by a 10Ω resistor with 2A flowing through it. (W)",
    correctAnswer: 40,
    explanation: "Using P = I²R: P = (2A)² × 10Ω = 4 × 10 = 40W",
    difficulty: "hard",
    topic: "power"
  }
];

export const atomicStructureQuiz: QuizQuestion[] = [
  {
    id: "atomic-1",
    type: "multiple-choice",
    question: "What particles make up the nucleus of an atom?",
    options: [
      "Protons and electrons",
      "Protons and neutrons", 
      "Neutrons and electrons",
      "Only protons"
    ],
    correctAnswer: "Protons and neutrons",
    explanation: "The nucleus contains protons (positive charge) and neutrons (no charge). Electrons orbit around the nucleus.",
    difficulty: "easy",
    topic: "atomic-structure"
  },
  {
    id: "atomic-2",
    type: "true-false",
    question: "Free electrons in metals are what allow electrical conduction.",
    correctAnswer: true,
    explanation: "Metals have loosely bound outer electrons called 'free electrons' that can move easily between atoms, enabling electrical conduction.",
    difficulty: "easy",
    topic: "electrical-conduction"
  },
  {
    id: "atomic-3",
    type: "multiple-choice",
    question: "Which type of material has electrons tightly bound to their atoms?",
    options: [
      "Conductors",
      "Semiconductors",
      "Insulators",
      "Superconductors"
    ],
    correctAnswer: "Insulators",
    explanation: "Insulators have electrons tightly bound to their atoms, making it very difficult for electrons to move and conduct electricity.",
    difficulty: "medium",
    topic: "material-properties"
  },
  {
    id: "atomic-4",
    type: "calculation",
    question: "How many electrons does a neutral carbon atom have? (Carbon has 6 protons)",
    correctAnswer: 6,
    explanation: "A neutral atom has equal numbers of protons and electrons. Since carbon has 6 protons, it also has 6 electrons.",
    difficulty: "easy",
    topic: "atomic-structure"
  },
  {
    id: "atomic-5",
    type: "multiple-choice",
    question: "What happens when an atom loses an electron?",
    options: [
      "It becomes negatively charged",
      "It becomes positively charged",
      "It remains neutral",
      "It becomes a different element"
    ],
    correctAnswer: "It becomes positively charged",
    explanation: "When an atom loses an electron, it has more protons than electrons, giving it a net positive charge. This is called a positive ion.",
    difficulty: "medium",
    topic: "ionization"
  },
  {
    id: "atomic-6",
    type: "true-false",
    question: "Semiconductors can act as both conductors and insulators depending on conditions.",
    correctAnswer: true,
    explanation: "Semiconductors like silicon have properties between conductors and insulators. Their conductivity can be controlled by temperature, impurities, or applied voltage.",
    difficulty: "medium",
    topic: "semiconductors"
  },
  {
    id: "atomic-7",
    type: "multiple-choice",
    question: "Which force holds electrons in orbit around the nucleus?",
    options: [
      "Magnetic force",
      "Nuclear force",
      "Electrostatic force",
      "Gravitational force"
    ],
    correctAnswer: "Electrostatic force",
    explanation: "The electrostatic (Coulomb) force of attraction between the positively charged nucleus and negatively charged electrons keeps electrons in orbit.",
    difficulty: "medium",
    topic: "atomic-forces"
  }
];

export const electricalMeasurementsQuiz: QuizQuestion[] = [
  {
    id: "measure-1",
    type: "multiple-choice",
    question: "Which instrument is used to measure electrical current?",
    options: [
      "Voltmeter",
      "Ammeter",
      "Ohmmeter",
      "Wattmeter"
    ],
    correctAnswer: "Ammeter",
    explanation: "An ammeter is specifically designed to measure electrical current (amperes). It must be connected in series with the circuit.",
    difficulty: "easy",
    topic: "measurement-instruments"
  },
  {
    id: "measure-2",
    type: "true-false",
    question: "A voltmeter should be connected in parallel with the component being measured.",
    correctAnswer: true,
    explanation: "Voltmeters measure potential difference and must be connected in parallel to measure the voltage across a component.",
    difficulty: "medium",
    topic: "voltmeter-connection"
  },
  {
    id: "measure-3",
    type: "multiple-choice",
    question: "What does a multimeter NOT typically measure?",
    options: [
      "Voltage",
      "Current",
      "Resistance",
      "Magnetic field strength"
    ],
    correctAnswer: "Magnetic field strength",
    explanation: "A standard multimeter measures voltage, current, and resistance. Magnetic field strength requires a specialized magnetometer.",
    difficulty: "easy",
    topic: "multimeter-functions"
  },
  {
    id: "measure-4",
    type: "calculation",
    question: "If a multimeter reads 3.45V, and it has an accuracy of ±2%, what is the maximum possible actual voltage? (V)",
    correctAnswer: 3.519,
    explanation: "Maximum voltage = 3.45V + (3.45V × 0.02) = 3.45V + 0.069V = 3.519V",
    difficulty: "hard",
    topic: "measurement-accuracy"
  },
  {
    id: "measure-5",
    type: "true-false",
    question: "An ideal ammeter has zero internal resistance.",
    correctAnswer: true,
    explanation: "An ideal ammeter should have zero internal resistance so it doesn't affect the current it's measuring. Real ammeters have very low resistance.",
    difficulty: "medium",
    topic: "ammeter-properties"
  },
  {
    id: "measure-6",
    type: "multiple-choice",
    question: "Which safety precaution is most important when using electrical test equipment?",
    options: [
      "Always use the highest range first",
      "Ensure the circuit is de-energized before connecting",
      "Use only digital meters",
      "Calibrate before each use"
    ],
    correctAnswer: "Ensure the circuit is de-energized before connecting",
    explanation: "Safety is paramount. Always turn off power and verify the circuit is de-energized before connecting test equipment to prevent shock or equipment damage.",
    difficulty: "medium",
    topic: "measurement-safety"
  },
  {
    id: "measure-7",
    type: "circuit",
    question: "To measure the current through a resistor in a circuit, where should the ammeter be placed?",
    options: [
      "In parallel with the resistor",
      "In series with the resistor",
      "Across the power supply",
      "At any point in the circuit"
    ],
    correctAnswer: "In series with the resistor",
    explanation: "To measure current through a specific component, the ammeter must be placed in series with that component so all current flows through the meter.",
    difficulty: "medium",
    topic: "current-measurement"
  }
];

export const powerEnergyQuiz: QuizQuestion[] = [
  {
    id: "power-1",
    type: "calculation",
    question: "Calculate the power consumed by a 12V device drawing 2A of current. (W)",
    correctAnswer: 24,
    explanation: "Using P = V × I: P = 12V × 2A = 24W",
    difficulty: "easy",
    topic: "power-calculation"
  },
  {
    id: "power-2",
    type: "multiple-choice",
    question: "What is the unit of electrical energy?",
    options: [
      "Watt (W)",
      "Joule (J)",
      "Volt (V)",
      "Ampere (A)"
    ],
    correctAnswer: "Joule (J)",
    explanation: "Energy is measured in joules (J). Power is measured in watts (W), which equals joules per second.",
    difficulty: "easy",
    topic: "energy-units"
  },
  {
    id: "power-3",
    type: "true-false",
    question: "A kilowatt-hour (kWh) is a unit of power.",
    correctAnswer: false,
    explanation: "A kilowatt-hour (kWh) is a unit of energy, not power. It represents the energy consumed by using 1 kilowatt for 1 hour.",
    difficulty: "medium",
    topic: "energy-vs-power"
  },
  {
    id: "power-4",
    type: "calculation",
    question: "How much energy does a 100W light bulb consume in 5 hours? (Wh)",
    correctAnswer: 500,
    explanation: "Energy = Power × Time = 100W × 5h = 500Wh or 0.5 kWh",
    difficulty: "medium",
    topic: "energy-calculation"
  },
  {
    id: "power-5",
    type: "multiple-choice",
    question: "Which formula correctly represents electrical power?",
    options: [
      "P = V / I",
      "P = V × I",
      "P = V + I",
      "P = I / V"
    ],
    correctAnswer: "P = V × I",
    explanation: "Electrical power is calculated as P = V × I (voltage times current). This can also be expressed as P = I²R or P = V²/R.",
    difficulty: "easy",
    topic: "power-formulas"
  },
  {
    id: "power-6",
    type: "calculation",
    question: "A resistor dissipates 36W when 3A flows through it. What is its resistance? (Ω)",
    correctAnswer: 4,
    explanation: "Using P = I²R: 36W = (3A)² × R, so R = 36W / 9A² = 4Ω",
    difficulty: "hard",
    topic: "power-resistance"
  },
  {
    id: "power-7",
    type: "true-false",
    question: "Increasing voltage while keeping resistance constant will increase power consumption.",
    correctAnswer: true,
    explanation: "Using P = V²/R, if voltage increases while resistance stays constant, power consumption increases proportionally to the square of voltage.",
    difficulty: "medium",
    topic: "power-relationships"
  }
];

export const electricalSafetyQuiz: QuizQuestion[] = [
  {
    id: "safety-1",
    type: "multiple-choice",
    question: "What is the minimum voltage that can be dangerous to humans?",
    options: [
      "5V",
      "12V",
      "50V",
      "120V"
    ],
    correctAnswer: "50V",
    explanation: "While even lower voltages can be dangerous under certain conditions, 50V is generally considered the threshold where serious harm can occur.",
    difficulty: "medium",
    topic: "voltage-safety"
  },
  {
    id: "safety-2",
    type: "true-false",
    question: "It's safe to work on electrical circuits as long as you're wearing rubber gloves.",
    correctAnswer: false,
    explanation: "Rubber gloves provide some protection, but the safest practice is to de-energize circuits completely before working on them. PPE is an additional precaution, not a primary safety measure.",
    difficulty: "easy",
    topic: "safety-procedures"
  },
  {
    id: "safety-3",
    type: "multiple-choice",
    question: "What does GFCI stand for?",
    options: [
      "Ground Fault Circuit Interrupter",
      "General Fault Current Indicator",
      "Ground Frequency Circuit Isolator",
      "General Fault Connection Interface"
    ],
    correctAnswer: "Ground Fault Circuit Interrupter",
    explanation: "GFCI (Ground Fault Circuit Interrupter) devices detect current imbalances and quickly shut off power to prevent electrocution.",
    difficulty: "medium",
    topic: "protective-devices"
  },
  {
    id: "safety-4",
    type: "true-false",
    question: "Water and electricity should never mix.",
    correctAnswer: true,
    explanation: "Water dramatically reduces electrical resistance, creating extremely dangerous conditions. Always keep electrical equipment away from water.",
    difficulty: "easy",
    topic: "water-safety"
  },
  {
    id: "safety-5",
    type: "multiple-choice",
    question: "What is the first step when someone is being electrocuted?",
    options: [
      "Touch them to check their pulse",
      "Pour water on them",
      "Turn off the power source",
      "Call emergency services immediately"
    ],
    correctAnswer: "Turn off the power source",
    explanation: "First, safely disconnect the power source. Never touch someone being electrocuted as you could become a victim too. Then call emergency services.",
    difficulty: "medium",
    topic: "emergency-procedures"
  },
  {
    id: "safety-6",
    type: "multiple-choice",
    question: "Which is the correct sequence for lockout/tagout procedures?",
    options: [
      "Lock, Tag, Test",
      "Tag, Lock, Test", 
      "Test, Lock, Tag",
      "Lock, Test, Tag"
    ],
    correctAnswer: "Lock, Tag, Test",
    explanation: "Proper lockout/tagout: 1) Lock the energy source, 2) Tag to identify who locked it and why, 3) Test to verify energy is isolated.",
    difficulty: "hard",
    topic: "lockout-tagout"
  },
  {
    id: "safety-7",
    type: "true-false",
    question: "Arc flash incidents can occur even when working on de-energized equipment.",
    correctAnswer: false,
    explanation: "Arc flash occurs when electrical energy jumps across an air gap. If equipment is properly de-energized and verified safe, arc flash cannot occur.",
    difficulty: "medium",
    topic: "arc-flash"
  }
];

export const wiringInstallationQuiz: QuizQuestion[] = [
  {
    id: "wiring-1",
    type: "multiple-choice",
    question: "What is the purpose of the ground wire in electrical wiring?",
    options: [
      "To carry current back to the source",
      "To provide a safe path for fault current",
      "To reduce voltage drop",
      "To increase power efficiency"
    ],
    correctAnswer: "To provide a safe path for fault current",
    explanation: "The ground wire provides a low-resistance path for fault currents to flow safely to earth, protecting people from electrocution.",
    difficulty: "medium",
    topic: "grounding"
  },
  {
    id: "wiring-2",
    type: "true-false",
    question: "Wire nuts are acceptable for permanent electrical connections.",
    correctAnswer: true,
    explanation: "When properly sized and installed, wire nuts provide secure, permanent connections that meet electrical code requirements.",
    difficulty: "easy",
    topic: "connection-methods"
  },
  {
    id: "wiring-3",
    type: "multiple-choice",
    question: "What wire gauge would typically be used for a 20-amp circuit?",
    options: [
      "18 AWG",
      "14 AWG",
      "12 AWG",
      "10 AWG"
    ],
    correctAnswer: "12 AWG",
    explanation: "12 AWG wire is rated for 20 amps. 14 AWG is typically used for 15-amp circuits, while 10 AWG is used for 30-amp circuits.",
    difficulty: "medium",
    topic: "wire-sizing"
  },
  {
    id: "wiring-4",
    type: "true-false",
    question: "All electrical work in homes requires a permit and inspection.",
    correctAnswer: false,
    explanation: "While major electrical work requires permits, simple tasks like replacing switches or outlets often don't. Requirements vary by location and local codes.",
    difficulty: "medium",
    topic: "electrical-codes"
  },
  {
    id: "wiring-5",
    type: "multiple-choice",
    question: "In a standard 120V outlet, which wire is the hot (live) conductor?",
    options: [
      "White wire",
      "Black wire",
      "Green wire",
      "Bare copper wire"
    ],
    correctAnswer: "Black wire",
    explanation: "In standard US wiring: Black = hot (live), White = neutral, Green or bare = ground.",
    difficulty: "easy",
    topic: "wire-colors"
  },
  {
    id: "wiring-6",
    type: "calculation",
    question: "What is the maximum recommended load for a 15-amp circuit? (% of rating)",
    correctAnswer: 80,
    explanation: "Electrical codes typically require circuits to be loaded to no more than 80% of their rating for continuous loads. 15A × 0.8 = 12A maximum.",
    difficulty: "medium",
    topic: "load-calculations"
  },
  {
    id: "wiring-7",
    type: "circuit",
    question: "In a switch-controlled outlet installation, which component controls the power flow?",
    options: [
      "The outlet",
      "The switch",
      "The circuit breaker",
      "The neutral wire"
    ],
    correctAnswer: "The switch",
    explanation: "The switch interrupts the hot wire to control power flow to the outlet. When open, it stops current; when closed, it allows current to flow.",
    difficulty: "easy",
    topic: "switching-circuits"
  }
];

export const electronicComponentsQuiz: QuizQuestion[] = [
  {
    id: "electronic-1",
    type: "multiple-choice",
    question: "What is the primary function of a capacitor?",
    options: [
      "To resist current flow",
      "To store electrical energy",
      "To amplify signals",
      "To convert AC to DC"
    ],
    correctAnswer: "To store electrical energy",
    explanation: "Capacitors store electrical energy in an electric field between two conducting plates separated by an insulator (dielectric).",
    difficulty: "easy",
    topic: "capacitors"
  },
  {
    id: "electronic-2",
    type: "true-false",
    question: "LEDs only allow current to flow in one direction.",
    correctAnswer: true,
    explanation: "LEDs (Light Emitting Diodes) are diodes that only conduct current in one direction (forward bias) and emit light when conducting.",
    difficulty: "easy",
    topic: "diodes"
  },
  {
    id: "electronic-3",
    type: "multiple-choice",
    question: "What does an inductor oppose?",
    options: [
      "Voltage",
      "Changes in current",
      "Power",
      "Resistance"
    ],
    correctAnswer: "Changes in current",
    explanation: "Inductors oppose changes in current flow due to their property of inductance, which generates a back-EMF when current changes.",
    difficulty: "medium",
    topic: "inductors"
  },
  {
    id: "electronic-4",
    type: "calculation",
    question: "If a 100μF capacitor is charged to 12V, how much energy does it store? (mJ)",
    correctAnswer: 7.2,
    explanation: "Energy = ½CV² = ½ × 100×10⁻⁶ × 12² = ½ × 100×10⁻⁶ × 144 = 7.2×10⁻³ J = 7.2 mJ",
    difficulty: "hard",
    topic: "capacitor-energy"
  },
  {
    id: "electronic-5",
    type: "multiple-choice",
    question: "Which component is primarily used for amplification in electronic circuits?",
    options: [
      "Resistor",
      "Capacitor",
      "Transistor",
      "Inductor"
    ],
    correctAnswer: "Transistor",
    explanation: "Transistors can amplify small input signals to produce larger output signals, making them essential for amplification in electronic circuits.",
    difficulty: "easy",
    topic: "transistors"
  },
  {
    id: "electronic-6",
    type: "true-false",
    question: "A transformer can work with DC voltage.",
    correctAnswer: false,
    explanation: "Transformers only work with AC voltage because they rely on changing magnetic fields. DC produces a constant magnetic field that cannot induce voltage in the secondary winding.",
    difficulty: "medium",
    topic: "transformers"
  },
  {
    id: "electronic-7",
    type: "multiple-choice",
    question: "What happens to capacitive reactance as frequency increases?",
    options: [
      "It increases",
      "It decreases", 
      "It stays the same",
      "It becomes infinite"
    ],
    correctAnswer: "It decreases",
    explanation: "Capacitive reactance Xc = 1/(2πfC). As frequency (f) increases, reactance decreases, meaning capacitors conduct AC better at higher frequencies.",
    difficulty: "hard",
    topic: "ac-components"
  }
];

export const circuitAnalysisQuiz: QuizQuestion[] = [
  {
    id: "circuit-1",
    type: "multiple-choice",
    question: "In a series circuit, the current is:",
    options: [
      "Different through each component",
      "The same through all components",
      "Zero through some components",
      "Infinite through all components"
    ],
    correctAnswer: "The same through all components",
    explanation: "In a series circuit, current is the same throughout because there is only one path for current to flow.",
    difficulty: "medium",
    topic: "series-circuits"
  },
  {
    id: "circuit-2",
    type: "true-false",
    question: "In a parallel circuit, voltage is the same across all branches.",
    correctAnswer: true,
    explanation: "In parallel circuits, each branch is connected directly across the voltage source, so voltage is the same across all branches.",
    difficulty: "medium",
    topic: "parallel-circuits"
  },
  {
    id: "circuit-3",
    type: "calculation",
    question: "Two 6Ω resistors are connected in series. What is the total resistance? (Ω)",
    correctAnswer: 12,
    explanation: "In series: R_total = R1 + R2 = 6Ω + 6Ω = 12Ω",
    difficulty: "medium",
    topic: "series-resistance"
  },
  {
    id: "circuit-4",
    type: "calculation",
    question: "Two 12Ω resistors are connected in parallel. What is the total resistance? (Ω)",
    correctAnswer: 6,
    explanation: "In parallel: 1/R_total = 1/R1 + 1/R2 = 1/12 + 1/12 = 2/12, so R_total = 6Ω",
    difficulty: "hard",
    topic: "parallel-resistance"
  },
  {
    id: "circuit-5",
    type: "circuit",
    question: "Which component would you remove to stop all current flow in this circuit?",
    options: [
      "battery",
      "resistor", 
      "wire",
      "switch"
    ],
    correctAnswer: "battery",
    explanation: "Removing the battery (voltage source) would stop all current flow since there would be no driving force for the current.",
    difficulty: "easy",
    topic: "circuit-analysis"
  }
];

// Enhanced quiz questions with hints and points
const enhancedIntroQuiz: QuizQuestion[] = introductionQuiz.map(q => ({
  ...q,
  hints: getHintsForQuestion(q.id),
  points: q.difficulty === 'hard' ? 3 : q.difficulty === 'medium' ? 2 : 1
}));

const enhancedAtomicStructureQuiz: QuizQuestion[] = atomicStructureQuiz.map(q => ({
  ...q,
  hints: getHintsForQuestion(q.id),
  points: q.difficulty === 'hard' ? 3 : q.difficulty === 'medium' ? 2 : 1
}));

const enhancedOhmsLawQuiz: QuizQuestion[] = ohmsLawQuiz.map(q => ({
  ...q,
  hints: getHintsForQuestion(q.id),
  points: q.difficulty === 'hard' ? 3 : q.difficulty === 'medium' ? 2 : 1
}));

const enhancedCircuitQuiz: QuizQuestion[] = circuitAnalysisQuiz.map(q => ({
  ...q,
  hints: getHintsForQuestion(q.id),
  points: q.difficulty === 'hard' ? 3 : q.difficulty === 'medium' ? 2 : 1
}));

const enhancedMeasurementsQuiz: QuizQuestion[] = electricalMeasurementsQuiz.map(q => ({
  ...q,
  hints: getHintsForQuestion(q.id),
  points: q.difficulty === 'hard' ? 3 : q.difficulty === 'medium' ? 2 : 1
}));

const enhancedPowerEnergyQuiz: QuizQuestion[] = powerEnergyQuiz.map(q => ({
  ...q,
  hints: getHintsForQuestion(q.id),
  points: q.difficulty === 'hard' ? 3 : q.difficulty === 'medium' ? 2 : 1
}));

const enhancedSafetyQuiz: QuizQuestion[] = electricalSafetyQuiz.map(q => ({
  ...q,
  hints: getHintsForQuestion(q.id),
  points: q.difficulty === 'hard' ? 3 : q.difficulty === 'medium' ? 2 : 1
}));

const enhancedWiringQuiz: QuizQuestion[] = wiringInstallationQuiz.map(q => ({
  ...q,
  hints: getHintsForQuestion(q.id),
  points: q.difficulty === 'hard' ? 3 : q.difficulty === 'medium' ? 2 : 1
}));

const enhancedElectronicComponentsQuiz: QuizQuestion[] = electronicComponentsQuiz.map(q => ({
  ...q,
  hints: getHintsForQuestion(q.id),
  points: q.difficulty === 'hard' ? 3 : q.difficulty === 'medium' ? 2 : 1
}));

// Function to get hints for questions
function getHintsForQuestion(questionId: string): string[] {
  const hints: Record<string, string[]> = {
    // Introduction hints
    'intro-1': ['Think about what moves through wires when electricity flows'],
    'intro-2': ['Remember: Volts for voltage, Amperes for current'],
    'intro-3': ['Use Ohm\'s Law: I = V/R'],
    'intro-4': ['Metals are typically good conductors'],
    'intro-5': ['Look for the component that can be opened or closed'],
    
    // Atomic Structure hints
    'atomic-1': ['Think about the center of an atom - what particles are there?'],
    'atomic-2': ['Consider why metals conduct electricity so well'],
    'atomic-3': ['These materials don\'t let electrons move easily'],
    'atomic-4': ['In a neutral atom, protons equal electrons'],
    'atomic-5': ['Fewer electrons means fewer negative charges'],
    'atomic-6': ['Think about silicon in computer chips'],
    'atomic-7': ['Opposite charges attract each other'],
    
    // Ohm's Law hints
    'ohm-1': ['Rearrange Ohm\'s Law to solve for R: R = V/I'],
    'ohm-2': ['The basic form relates Voltage, Current, and Resistance'],
    'ohm-3': ['Multiply current by resistance to get voltage'],
    'ohm-4': ['Think about the inverse relationship in I = V/R'],
    'ohm-5': ['Power = Current squared times Resistance'],
    
    // Circuit Analysis hints
    'circuit-1': ['In series, there\'s only one path for current'],
    'circuit-2': ['All parallel branches connect to the same two points'],
    'circuit-3': ['In series: just add the resistances together'],
    'circuit-4': ['In parallel: 1/Total = 1/R1 + 1/R2'],
    'circuit-5': ['What provides the energy to push current through the circuit?'],
    
    // Electrical Measurements hints
    'measure-1': ['Think about what measures "amps"'],
    'measure-2': ['Voltage is measured across components, not through them'],
    'measure-3': ['Think about what a standard electrical meter measures'],
    'measure-4': ['Add the error percentage to get maximum value'],
    'measure-5': ['An ammeter shouldn\'t affect the circuit it\'s measuring'],
    'measure-6': ['Safety first - what could go wrong?'],
    'measure-7': ['Current flows through components in series'],
    
    // Power and Energy hints
    'power-1': ['Power equals voltage times current'],
    'power-2': ['Energy is work done or stored, power is rate of energy use'],
    'power-3': ['kWh = kilowatt × hours, which is energy not power'],
    'power-4': ['Energy = Power × Time'],
    'power-5': ['Think about the basic power formula'],
    'power-6': ['Use P = I²R, rearrange to solve for R'],
    'power-7': ['Check the P = V²/R relationship'],
    
    // Electrical Safety hints
    'safety-1': ['Even relatively low voltages can be dangerous'],
    'safety-2': ['The best protection is no voltage at all'],
    'safety-3': ['This device protects against ground faults'],
    'safety-4': ['Water conducts electricity very well'],
    'safety-5': ['Don\'t touch the victim - eliminate the source first'],
    'safety-6': ['Remember the proper sequence: Lock, Tag, Test'],
    'safety-7': ['Arc flash needs electrical energy to occur'],
    
    // Wiring and Installation hints
    'wiring-1': ['The ground wire is for safety, not normal operation'],
    'wiring-2': ['Wire nuts are standard connectors when properly used'],
    'wiring-3': ['Larger current needs larger wire (lower AWG number)'],
    'wiring-4': ['Small repairs often don\'t need permits'],
    'wiring-5': ['Think about standard wire color codes'],
    'wiring-6': ['Circuits shouldn\'t be loaded to 100% of capacity'],
    'wiring-7': ['What component interrupts the circuit?'],
    
    // Electronic Components hints
    'electronic-1': ['Capacitors store energy like a battery, but differently'],
    'electronic-2': ['LEDs are diodes - they have polarity'],
    'electronic-3': ['Inductors create back-EMF when current changes'],
    'electronic-4': ['Use the capacitor energy formula: E = ½CV²'],
    'electronic-5': ['Think about what makes signals bigger'],
    'electronic-6': ['Transformers need changing magnetic fields'],
    'electronic-7': ['Higher frequency means lower capacitive reactance']
  };
  return hints[questionId] || ['Take your time and think through the fundamentals'];
}

// Create comprehensive Quiz objects
export const comprehensiveQuizzes: Record<string, Quiz> = {
  'introduction': {
    id: 'introduction-quiz',
    sectionId: 'introduction',
    title: 'Introduction to Electricity',
    description: 'Test your understanding of basic electrical concepts',
    questions: enhancedIntroQuiz,
    timeLimit: 10, // 10 minutes
    passingScore: 70,
    allowRetake: true,
    showExplanations: true
  },
  'section-1': {
    id: 'atomic-structure-quiz',
    sectionId: 'section-1',
    title: 'Atomic Structure and Electrical Fundamentals',
    description: 'Master the atomic basis of electricity and material properties',
    questions: enhancedAtomicStructureQuiz,
    timeLimit: 12,
    passingScore: 70,
    allowRetake: true,
    showExplanations: true
  },
  'section-2': {
    id: 'ohms-law-quiz',
    sectionId: 'section-2',
    title: 'Ohm\'s Law Mastery',
    description: 'Master the fundamental relationship between voltage, current, and resistance',
    questions: enhancedOhmsLawQuiz,
    timeLimit: 15,
    passingScore: 75,
    allowRetake: true,
    showExplanations: true
  },
  'section-3': {
    id: 'circuit-analysis-quiz',
    sectionId: 'section-3',
    title: 'Circuit Analysis',
    description: 'Analyze series and parallel circuits like a pro',
    questions: enhancedCircuitQuiz,
    timeLimit: 20,
    passingScore: 75,
    allowRetake: true,
    showExplanations: true
  },
  'section-4': {
    id: 'electrical-measurements-quiz',
    sectionId: 'section-4',
    title: 'Electrical Measurements and Testing',
    description: 'Learn to use electrical test equipment safely and accurately',
    questions: enhancedMeasurementsQuiz,
    timeLimit: 15,
    passingScore: 75,
    allowRetake: true,
    showExplanations: true
  },
  'section-5': {
    id: 'power-energy-quiz',
    sectionId: 'section-5',
    title: 'Power and Energy Concepts',
    description: 'Understand electrical power calculations and energy consumption',
    questions: enhancedPowerEnergyQuiz,
    timeLimit: 15,
    passingScore: 75,
    allowRetake: true,
    showExplanations: true
  },
  'section-6': {
    id: 'electrical-safety-quiz',
    sectionId: 'section-6',
    title: 'Electrical Safety',
    description: 'Essential safety knowledge for working with electricity',
    questions: enhancedSafetyQuiz,
    timeLimit: 12,
    passingScore: 80, // Higher passing score for safety
    allowRetake: true,
    showExplanations: true
  },
  'section-7': {
    id: 'wiring-installation-quiz',
    sectionId: 'section-7',
    title: 'Wiring and Installation',
    description: 'Practical knowledge of electrical wiring and installation practices',
    questions: enhancedWiringQuiz,
    timeLimit: 15,
    passingScore: 75,
    allowRetake: true,
    showExplanations: true
  },
  'section-8': {
    id: 'electronic-components-quiz',
    sectionId: 'section-8',
    title: 'Electronic Components and Circuits',
    description: 'Understand electronic components and their behavior in circuits',
    questions: enhancedElectronicComponentsQuiz,
    timeLimit: 18,
    passingScore: 75,
    allowRetake: true,
    showExplanations: true
  }
};

// Export all quizzes by section (legacy support)
export const sectionQuizzes: Record<string, QuizQuestion[]> = {
  "introduction": enhancedIntroQuiz,
  "section-1": enhancedAtomicStructureQuiz,
  "section-2": enhancedOhmsLawQuiz,
  "section-3": enhancedCircuitQuiz,
  "section-4": enhancedMeasurementsQuiz,
  "section-5": enhancedPowerEnergyQuiz,
  "section-6": enhancedSafetyQuiz,
  "section-7": enhancedWiringQuiz,
  "section-8": enhancedElectronicComponentsQuiz,
};

// Function to get random questions from a quiz
export function getRandomQuestions(sectionId: string, count: number = 5): QuizQuestion[] {
  const quiz = sectionQuizzes[sectionId];
  if (!quiz) return [];
  
  const shuffled = [...quiz].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, quiz.length));
}

// Function to get questions by difficulty
export function getQuestionsByDifficulty(
  sectionId: string, 
  difficulty: "easy" | "medium" | "hard"
): QuizQuestion[] {
  const quiz = sectionQuizzes[sectionId];
  if (!quiz) return [];
  
  return quiz.filter(q => q.difficulty === difficulty);
}

// Function to get a complete quiz for a section
export function getQuizForSection(sectionId: string): Quiz | null {
  return comprehensiveQuizzes[sectionId] || null;
}

// Function to create a custom quiz with mixed difficulties
export function createMixedDifficultyQuiz(
  sectionId: string,
  easyCount: number = 2,
  mediumCount: number = 2,
  hardCount: number = 1
): Quiz | null {
  const baseQuiz = comprehensiveQuizzes[sectionId];
  if (!baseQuiz) return null;

  const easyQuestions = getQuestionsByDifficulty(sectionId, 'easy').slice(0, easyCount);
  const mediumQuestions = getQuestionsByDifficulty(sectionId, 'medium').slice(0, mediumCount);
  const hardQuestions = getQuestionsByDifficulty(sectionId, 'hard').slice(0, hardCount);

  const mixedQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions]
    .sort(() => Math.random() - 0.5); // Shuffle questions

  return {
    ...baseQuiz,
    id: `${baseQuiz.id}-mixed`,
    title: `${baseQuiz.title} - Mixed Practice`,
    questions: mixedQuestions,
    timeLimit: Math.ceil(mixedQuestions.length * 1.5), // 1.5 minutes per question
  };
}