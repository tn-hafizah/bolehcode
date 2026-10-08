import { MiniGameMeta } from '../types';

export const MINI_GAMES_LIST: MiniGameMeta[] = [
  {
    id: 'flowchart',
    topicNumber: 1,
    title: 'Flowchart Connector',
    subtitle: 'Topic 1: Fundamental of Algorithms',
    concept: 'Connect algorithmic logic blocks (Start -> Input -> Process -> Decision -> Output -> End) in correct sequence.',
    icon: 'GitFork',
    accentColor: '#00f0ff',
    instructions: [
      'Click the blocks in the correct program execution order.',
      'Identify symbol types: Terminal (Start/End), Parallelogram (Input/Output), Rectangle (Process), Diamond (Decision).',
      'Each correct connection awards 15 XP.',
      'Complete the algorithm flowchart before the 35-second timer expires!'
    ]
  },
  {
    id: 'modularization',
    topicNumber: 2,
    title: 'Modularization Stacker',
    subtitle: 'Topic 2: Problem Solving & Top-Down Design',
    concept: 'Stack modular function blocks (sub-problems) with architectural precision and balance.',
    icon: 'Layers',
    accentColor: '#60a5fa',
    instructions: [
      'Tap the screen or press [SPACE] / [CLICK] to drop the oscillating function module.',
      'Align the incoming block carefully with the base to avoid trimming overhangs.',
      'Each stacked block represents an abstraction layer in software architecture.',
      'Build the tower as high as possible to accumulate maximum points!'
    ]
  },
  {
    id: 'datatype',
    topicNumber: 3,
    title: 'Data Type Sorting',
    subtitle: 'Topic 3: Structured Programming Language',
    concept: 'Sort falling values (e.g., 42, 3.14, \'A\', true, "BolehCode") into their corresponding memory type bins.',
    icon: 'Cpu',
    accentColor: '#a855f7',
    instructions: [
      'Use the bottom buttons or keyboard keys [1]-[5] to direct memory bins.',
      'int: 42, 100, -5 | double: 3.14, 0.75 | boolean: true, false | char: \'A\', \'Z\' | String: "BolehCode".',
      'Sorting a value into an incompatible bin triggers a Type Mismatch Error!',
      'Fall velocity accelerates as your streak increases.'
    ]
  },
  {
    id: 'looprunner',
    topicNumber: 4,
    title: 'Loop Runner',
    subtitle: 'Topic 4: Selection & Repetition (Loops)',
    concept: 'Guide the Java runner over infinite loop obstacles while collecting "i++" iteration tokens.',
    icon: 'Repeat',
    accentColor: '#ec4899',
    instructions: [
      'Press [SPACE] or tap the screen to jump over runtime hazards.',
      'Collect `i++` and `count++` tokens to increment your loop iteration score.',
      'Avoid colliding with `while(true)` infinite traps and OutOfMemory spikes!',
      'Reaching 100 iterations unlocks the exclusive Loop Ninja achievement badge!'
    ]
  },
  {
    id: 'array2d',
    topicNumber: 5,
    title: 'Array 2D Shooter',
    subtitle: 'Topic 5: Array & String Manipulation',
    concept: 'Target and blast requested `matrix[row][col]` indices on the 2D grid before the radar recalibrates.',
    icon: 'Target',
    accentColor: '#f43f5e',
    instructions: [
      'The radar displays target coordinates such as `matrix[1][2]` or `matrix[0][3]`.',
      'Click or tap the exact corresponding cell on the 2D grid.',
      'Remember: Both row and column indices start at zero (0)!',
      'React quickly to build consecutive target combos.'
    ]
  },
  {
    id: 'recursion',
    topicNumber: 6,
    title: 'Recursion Call Stack',
    subtitle: 'Topic 6: Function Method',
    concept: 'Control call stack frames. PUSH when functions recurse and POP when the Base Case is satisfied before a StackOverflow occurs!',
    icon: 'Code2',
    accentColor: '#f59e0b',
    instructions: [
      'Follow the two phases: Winding Phase (Pushing call frames) and Unwinding Phase (Popping return values).',
      'Press [PUSH] to add function frames as recursion descends.',
      'Press [POP / RETURN] immediately when "Base Case Reached!" lights up.',
      'Exceeding maximum memory capacity triggers a fatal StackOverflowError!'
    ]
  },
  {
    id: 'guibuilder',
    topicNumber: 7,
    title: 'GUI Builder',
    subtitle: 'Topic 7: Pre-defined Object & GUI',
    concept: 'Mount Java Swing components (JButton, JLabel, JTextField) into their respective BorderLayout regions.',
    icon: 'Layout',
    accentColor: '#10b981',
    instructions: [
      'Select a Swing component from the palette and click the destination slot in the JFrame.',
      'Match standard layout regions: NORTH (Title Label), CENTER (Content Fields), and SOUTH (Action Button).',
      'Assemble the window layout to match technical specifications.',
      'Each accurately placed component awards GUI design points.'
    ]
  },
  {
    id: 'filestream',
    topicNumber: 8,
    title: 'File Stream Catch',
    subtitle: 'Topic 8: Text File Manipulation',
    concept: 'Steer the BufferedReader buffer to catch incoming character stream packets while dodging IOException bugs.',
    icon: 'FileText',
    accentColor: '#14b8a6',
    instructions: [
      'Move the BufferedReader paddle left and right using touch gestures or mouse/arrow keys.',
      'Catch green stream packets (`char`, `line`, `EOF`).',
      'Evade red hazard packets (`IOException`, `NullPointerException`, `BadBlock`).',
      'Fill the buffer capacity to ensure robust file I/O integrity!'
    ]
  }
];
