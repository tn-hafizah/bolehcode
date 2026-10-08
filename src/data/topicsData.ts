import { TopicModule } from '../types';

export const TOPICS_DATA: TopicModule[] = [
  {
    id: 1,
    slug: 'topic-1-fundamentals',
    title: 'Topic 1: Fundamental of Algorithms & Introduction to Java',
    shortTitle: 'Algorithms & Java Intro',
    description: 'Fundamentals of algorithms, flowcharts, pseudocode, Java history & ecosystem, JVM, JRE, JDK, and your first Java program anatomy.',
    icon: 'Terminal',
    color: 'from-cyan-500 to-blue-600',
    keyConcepts: [
      'Algorithm Concepts & Characteristics (Input, Output, Definiteness, Finiteness, Effectiveness)',
      'Standard Flowchart Symbols (Terminal, Input/Output, Process, Decision, Flow Line)',
      'Pseudocode vs Programming Language',
      'Java Ecosystem: JVM (Java Virtual Machine), JRE, & JDK',
      'Java Program Anatomy: class, main method, statements, braces {}',
      'Compilation Process: .java -> javac -> .class (Bytecode) -> java interpreter'
    ],
    codeSnippet: {
      title: 'Basic Java Program Anatomy',
      code: `// The public class name must match the filename (HelloWorld.java)
public class HelloWorld {
    // The entry point for any standard Java application execution
    public static void main(String[] args) {
        System.out.println("Hello, Computer Science Students!");
        System.out.println("Tagline: Slow-slow, Lama-lama Pro!");
    }
}`
    },
    drTuanVideos: [
      {
        id: 't1-dt-1',
        title: "Dr. Tuan's Lecture: Part 1 - Algorithms & Problem Analysis",
        url: 'https://youtu.be/zKxaYexm_lA',
        youtubeId: 'zKxaYexm_lA',
        type: 'lecture',
        speaker: 'Dr. Tuan',
        description: 'Detailed explanation by Dr. Tuan covering algorithms, computational problem-solving logic, and flowcharts.'
      },
      {
        id: 't1-dt-2',
        title: "Dr. Tuan's Lecture: Part 2 - Translating Logic to Java",
        url: 'https://youtu.be/CSHOgDG3ago',
        youtubeId: 'CSHOgDG3ago',
        type: 'lecture',
        speaker: 'Dr. Tuan',
        description: 'Continuing lecture: Translating algorithmic flow logic directly into Java syntax.'
      }
    ],
    youtubeVideos: [
      {
        id: 't1-yt-1',
        title: 'Algorithm & Flowchart (Short 1)',
        url: 'https://youtube.com/shorts/WhIhV9pNcnU',
        youtubeId: 'WhIhV9pNcnU',
        type: 'short',
        speaker: 'YouTube',
        description: 'Quick summary of flowchart symbols and input/output concepts.'
      },
      {
        id: 't1-yt-2',
        title: 'Algorithm & Flowchart (Short 2)',
        url: 'https://youtube.com/shorts/eeE3UqhJtHE',
        youtubeId: 'eeE3UqhJtHE',
        type: 'short',
        speaker: 'YouTube',
        description: 'Quick visual guide for drawing decision and process blocks.'
      },
      {
        id: 't1-yt-3',
        title: 'What is Java',
        url: 'https://youtube.com/shorts/bP8ZGwkNXRw',
        youtubeId: 'bP8ZGwkNXRw',
        type: 'short',
        speaker: 'YouTube',
        description: 'Quick introduction to the Write Once, Run Anywhere (WORA) paradigm.'
      },
      {
        id: 't1-yt-4',
        title: 'Introduction to Java',
        url: 'https://youtu.be/t54pgbVy6t0',
        youtubeId: 't54pgbVy6t0',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'Comprehensive beginner tutorial covering Java environment setup and basics.'
      },
      {
        id: 't1-yt-5',
        title: 'Anatomy of Java',
        url: 'https://youtu.be/vsxYucdzimA',
        youtubeId: 'vsxYucdzimA',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'Dissecting Java code structure: static, void, String[] args, System.out.'
      }
    ]
  },
  {
    id: 2,
    slug: 'topic-2-problem-solving',
    title: 'Topic 2: Introduction to Problem Solving Using Computer',
    shortTitle: 'Problem Solving & Modularization',
    description: 'Structured problem solving methodology, functional modularization, encapsulation concepts, variables, and standard Java syntax.',
    icon: 'Layers',
    color: 'from-blue-600 to-indigo-600',
    keyConcepts: [
      'Problem Solving Phases: Analysis, Design (IPO Chart), Coding, Testing',
      'Input - Process - Output (IPO) Chart Structure',
      'Modularization: Top-Down Design & Functional Decomposition',
      'Introduction to Encapsulation & Data Hiding',
      'Variable Concepts & RAM Allocation',
      'Java Syntax Conventions: camelCase, PascalCase, semicolons (;)'
    ],
    codeSnippet: {
      title: 'Problem Decomposition Example (IPO Model)',
      code: `import java.util.Scanner;

public class DiscountCalculator {
    public static void main(String[] args) {
        // INPUT: Original price & discount percentage
        Scanner input = new Scanner(System.in);
        System.out.print("Enter item price ($): ");
        double originalPrice = input.nextDouble();
        
        // PROCESS: Discount calculation
        double discount = originalPrice * 0.15; // 15% discount
        double netPrice = originalPrice - discount;
        
        // OUTPUT
        System.out.printf("Net Price after discount: $%.2f\\n", netPrice);
        input.close();
    }
}`
    },
    drTuanVideos: [
      {
        id: 't2-dt-1',
        title: "Dr. Tuan's Lecture: Problem Solving Concepts",
        url: 'https://youtu.be/Z9vFdYcJ4LM',
        youtubeId: 'Z9vFdYcJ4LM',
        type: 'lecture',
        speaker: 'Dr. Tuan',
        description: 'Special lecture by Dr. Tuan exploring computational thinking techniques.'
      }
    ],
    youtubeVideos: [
      {
        id: 't2-yt-1',
        title: 'Modularization',
        url: 'https://youtu.be/7xIn2R1AUZM',
        youtubeId: '7xIn2R1AUZM',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'How to break large, complex problems down into smaller modular functions.'
      },
      {
        id: 't2-yt-2',
        title: 'Encapsulation (Short 1)',
        url: 'https://youtube.com/shorts/Qw2Vh8pgI28',
        youtubeId: 'Qw2Vh8pgI28',
        type: 'short',
        speaker: 'YouTube',
        description: 'Data bundling concept and information security principles.'
      },
      {
        id: 't2-yt-3',
        title: 'Encapsulation (Short 2)',
        url: 'https://youtube.com/shorts/lgKEnHuLNvk',
        youtubeId: 'lgKEnHuLNvk',
        type: 'short',
        speaker: 'YouTube',
        description: 'Visual demonstration of getters & setters in encapsulation.'
      },
      {
        id: 't2-yt-4',
        title: 'Variables Concept',
        url: 'https://youtube.com/shorts/_L9r7BEVnpA',
        youtubeId: '_L9r7BEVnpA',
        type: 'short',
        speaker: 'YouTube',
        description: 'Memory box analogy for understanding computer variables.'
      },
      {
        id: 't2-yt-5',
        title: 'Java Syntax',
        url: 'https://youtu.be/VR9IZcPOijY',
        youtubeId: 'VR9IZcPOijY',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'Syntax rules, reserved keywords, and formatting conventions.'
      }
    ]
  },
  {
    id: 3,
    slug: 'topic-3-structured-programming',
    title: 'Topic 3: Structured Programming Language',
    shortTitle: 'Data Types, Input/Output & Operators',
    description: 'Primitive and reference data types, Scanner input, printf output formatting, comments, type casting, arithmetic/logical operators, and String basics.',
    icon: 'Cpu',
    color: 'from-indigo-600 to-purple-600',
    keyConcepts: [
      'Primitive Data Types: byte, short, int, long, float, double, boolean, char',
      'Using Scanner: nextInt(), nextDouble(), nextLine(), next()',
      'Output Methods: print(), println(), printf() with format specifiers (%d, %.2f, %s)',
      'Type Casting: Implicit (Widening: int -> double) vs Explicit (Narrowing: (int) double)',
      'Arithmetic (+, -, *, /, %), Relational (<, >, ==, !=), and Logical Operators (&&, ||, !)',
      'Unary Operators (++i vs i--) and Compound Assignments (+=, -=)'
    ],
    codeSnippet: {
      title: 'Input/Output & Type Casting Example',
      code: `import java.util.Scanner;

public class StructuredDemo {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Enter grade (char): ");
        char grade = scanner.next().charAt(0);
        
        System.out.print("Enter raw score (int): ");
        int score = scanner.nextInt();
        
        // Explicit casting int to double
        double percentage = (double) score / 100.0 * 50.0;
        
        System.out.printf("Student Grade '%c' | Scaled Score: %.2f%%\\n", grade, percentage);
        scanner.close();
    }
}`
    },
    drTuanVideos: [
      {
        id: 't3-dt-1',
        title: "Dr. Tuan's Lecture: Part 1 - Data Types & Operators",
        url: 'https://youtu.be/-2S0uG7-7tk',
        youtubeId: '-2S0uG7-7tk',
        type: 'lecture',
        speaker: 'Dr. Tuan',
        description: 'In-depth coverage of data types, memory size limits, and operator usage.'
      },
      {
        id: 't3-dt-2',
        title: "Dr. Tuan's Lecture: Part 2 - Expressions & Casting",
        url: 'https://youtu.be/8di-T-4-90Y',
        youtubeId: '8di-T-4-90Y',
        type: 'lecture',
        speaker: 'Dr. Tuan',
        description: 'Operator precedence rules and data type conversion considerations.'
      }
    ],
    youtubeVideos: [
      {
        id: 't3-yt-1',
        title: 'Data Types',
        url: 'https://youtu.be/D3DqJrlckbs',
        youtubeId: 'D3DqJrlckbs',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'Understanding the 8 primitive data types in Java.'
      },
      {
        id: 't3-yt-2',
        title: 'Output in Java',
        url: 'https://youtu.be/BP3d7meXCmc',
        youtubeId: 'BP3d7meXCmc',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'Mastering System.out.println and formatted string printing.'
      },
      {
        id: 't3-yt-3',
        title: 'Input in Java',
        url: 'https://youtu.be/huZ1neRqNho',
        youtubeId: 'huZ1neRqNho',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'Capturing user input from the console using Scanner.'
      },
      {
        id: 't3-yt-4',
        title: 'Comments in Java',
        url: 'https://youtu.be/mgWktMxvL7g',
        youtubeId: 'mgWktMxvL7g',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'Single-line //, Multi-line /* */, and Javadoc /** */ comments.'
      },
      {
        id: 't3-yt-5',
        title: 'Variables in Java',
        url: 'https://youtu.be/YF59k3gZeb4',
        youtubeId: 'YF59k3gZeb4',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'Variable declaration, initialization, and variable scope.'
      },
      {
        id: 't3-yt-6',
        title: 'Type Casting',
        url: 'https://youtu.be/kFUqkaicfDw',
        youtubeId: 'kFUqkaicfDw',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'Widening vs Narrowing casting and data truncation risks.'
      },
      {
        id: 't3-yt-7',
        title: 'Operators',
        url: 'https://youtu.be/RbjB3SIaabM',
        youtubeId: 'RbjB3SIaabM',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'Mathematical, boolean logic, and modulus % operators.'
      },
      {
        id: 't3-yt-8',
        title: 'String Basics',
        url: 'https://youtu.be/SkKmN9k5_mY',
        youtubeId: 'SkKmN9k5_mY',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'String object fundamentals, length(), charAt(), and concatenation.'
      }
    ]
  },
  {
    id: 4,
    slug: 'topic-4-selection-repetition',
    title: 'Topic 4: Selection & Repetition (Loops)',
    shortTitle: 'Selection & Loops',
    description: 'Control flow structures: nested if-else, switch-case, for loops, while, do-while, break and continue statements, and preventing infinite loops.',
    icon: 'Repeat',
    color: 'from-purple-600 to-pink-600',
    keyConcepts: [
      'Selection Structures: if, if-else, nested if-else, and switch-case',
      'Switch Statements: case, break, default, and supported types (int, char, String)',
      'For Loops: Initialization, condition check, step update (for(int i = 0; i < n; i++))',
      'While Loops: Pre-test condition evaluation',
      'Do-While Loops: Post-test condition evaluation (always executes at least once)',
      'Loop Controls: break (exit loop) vs continue (skip to next iteration)'
    ],
    codeSnippet: {
      title: 'Loops & Selection Combined Example',
      code: `public class LoopControlDemo {
    public static void main(String[] args) {
        System.out.println("Finding odd numbers between 1 and 10:");
        
        for (int i = 1; i <= 10; i++) {
            if (i % 2 == 0) {
                continue; // Skip even numbers
            }
            if (i > 7) {
                System.out.println("Reached upper threshold, terminating loop with break!");
                break;
            }
            System.out.println("Odd Number: " + i);
        }
    }
}`
    },
    drTuanVideos: [],
    youtubeVideos: [
      {
        id: 't4-yt-1',
        title: 'Sequence, Selection & Loops',
        url: 'https://youtu.be/eSYeHlwDCNA',
        youtubeId: 'eSYeHlwDCNA',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'The three fundamental control structures in Computer Science.'
      },
      {
        id: 't4-yt-2',
        title: 'While & Do-While Loops',
        url: 'https://youtu.be/v-K-4KuA8mQ',
        youtubeId: 'v-K-4KuA8mQ',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'Core differences between while and do-while loops with code examples.'
      },
      {
        id: 't4-yt-3',
        title: 'Switch Statement',
        url: 'https://youtu.be/frSpkF-sPYk',
        youtubeId: 'frSpkF-sPYk',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'A clean alternative to nested if-else for multi-branch menu logic.'
      },
      {
        id: 't4-yt-4',
        title: 'Conditional Statements',
        url: 'https://youtu.be/HQ3dCWjfRZ4',
        youtubeId: 'HQ3dCWjfRZ4',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'Mastering if, else-if branching and the ternary operator (? :).'
      },
      {
        id: 't4-yt-5',
        title: 'For Statement',
        url: 'https://youtu.be/-mZdKRKXoko',
        youtubeId: '-mZdKRKXoko',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'Complete syntax of standard for-loops and nested loop iterations.'
      },
      {
        id: 't4-yt-6',
        title: 'Break & Continue',
        url: 'https://youtu.be/iGo1Syv4YuM',
        youtubeId: 'iGo1Syv4YuM',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'Directing loop flow dynamically using break and continue.'
      }
    ]
  },
  {
    id: 5,
    slug: 'topic-5-array-string',
    title: 'Topic 5: Array & String Manipulation',
    shortTitle: 'Array & Strings',
    description: '1D & 2D array data structures, memory indexing, enhanced for-each loops, and String object methods (substring, toUpperCase, equals, split).',
    icon: 'Grid',
    color: 'from-pink-600 to-rose-600',
    keyConcepts: [
      'Array Concepts: Fixed size, homogeneous data type, zero-based indexing',
      'Declaration & Initialization: int[] scores = new int[5]; int[] nums = {10, 20, 30};',
      '2D Arrays (Matrix / Tables): int[][] matrix = new int[rows][cols];',
      'Preventing ArrayIndexOutOfBoundsException errors',
      'String Methods: .length(), .charAt(i), .substring(), .equals(), .compareTo()',
      'String Equality: .equals() vs == operator (Content comparison vs Memory reference)'
    ],
    codeSnippet: {
      title: '2D Matrix & String Manipulation Example',
      code: `public class ArrayMatrixDemo {
    public static void main(String[] args) {
        // 3x3 Matrix Table
        int[][] table = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9}
        };

        // Summing all elements in the matrix
        int total = 0;
        for (int r = 0; r < table.length; r++) {
            for (int c = 0; c < table[r].length; c++) {
                total += table[r][c];
            }
        }
        System.out.println("Sum of 3x3 matrix: " + total);

        // String manipulation
        String text = "Computer Science Java";
        System.out.println("Uppercase: " + text.toUpperCase());
        System.out.println("Substring: " + text.substring(0, 8));
    }
}`
    },
    drTuanVideos: [],
    youtubeVideos: [
      {
        id: 't5-yt-1',
        title: 'Array Tutorial',
        url: 'https://youtu.be/9dr2mHYYoug',
        youtubeId: '9dr2mHYYoug',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'Comprehensive introduction to one-dimensional arrays in Java.'
      },
      {
        id: 't5-yt-2',
        title: 'Array (Short 1)',
        url: 'https://youtube.com/shorts/X9M9OCAh8Ck',
        youtubeId: 'X9M9OCAh8Ck',
        type: 'short',
        speaker: 'YouTube',
        description: 'Quick tip for remembering zero-based index numbering.'
      },
      {
        id: 't5-yt-3',
        title: 'Array (Short 2)',
        url: 'https://youtube.com/shorts/ZEc7MpdHqu0',
        youtubeId: 'ZEc7MpdHqu0',
        type: 'short',
        speaker: 'YouTube',
        description: 'Array declarations explained in 60 seconds.'
      },
      {
        id: 't5-yt-4',
        title: '2D Array',
        url: 'https://youtu.be/Gbz3Ao2xq_4',
        youtubeId: 'Gbz3Ao2xq_4',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'Understanding rows and columns in two-dimensional arrays.'
      },
      {
        id: 't5-yt-5',
        title: 'String Manipulation (Short 1)',
        url: 'https://youtube.com/shorts/3RcbBwGQ8hM',
        youtubeId: '3RcbBwGQ8hM',
        type: 'short',
        speaker: 'YouTube',
        description: 'Quick introduction to String length() & charAt() methods.'
      },
      {
        id: 't5-yt-6',
        title: 'String Manipulation (Short 2)',
        url: 'https://youtube.com/shorts/yn9J87VT7B8',
        youtubeId: 'yn9J87VT7B8',
        type: 'short',
        speaker: 'YouTube',
        description: 'The critical difference between str.equals() and str == str2.'
      },
      {
        id: 't5-yt-7',
        title: 'String Manipulation Tutorial',
        url: 'https://youtu.be/BMuy7i_u6ag',
        youtubeId: 'BMuy7i_u6ag',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'In-depth tutorial exploring built-in String utility methods.'
      }
    ]
  },
  {
    id: 6,
    slug: 'topic-6-function-method',
    title: 'Topic 6: Function Method',
    shortTitle: 'Methods & Functions',
    description: 'Method creation, access modifiers (public, private), static vs instance methods, pass-by-value parameters, passing references, and method overloading.',
    icon: 'Code2',
    color: 'from-amber-500 to-orange-600',
    keyConcepts: [
      'Method Signature: Access Modifier, Return Type, Method Name, Parameter List',
      'The static Keyword: Allows methods to be invoked without creating object instances',
      'Pass by Value vs Pass by Reference for arrays and object instances',
      'Method Overloading: Same method name with different parameter signatures',
      'Access Modifiers: public, private, protected, and package-default',
      'Recursion Concepts: Self-referential functions paired with an essential Base Case'
    ],
    codeSnippet: {
      title: 'Method Overloading & Static Function Example',
      code: `public class MethodDemo {
    // Method 1: Adds 2 integer numbers
    public static int add(int a, int b) {
        return a + b;
    }

    // Method 2 (Overloaded): Adds 2 double numbers
    public static double add(double a, double b) {
        return a + b;
    }

    public static void main(String[] args) {
        int intResult = add(15, 25);
        double doubleResult = add(12.5, 4.3);
        
        System.out.println("Integer Result: " + intResult);
        System.out.println("Double Result: " + doubleResult);
    }
}`
    },
    drTuanVideos: [],
    youtubeVideos: [
      {
        id: 't6-yt-1',
        title: 'Java Packages & Methods',
        url: 'https://youtu.be/mgixJYEZ1Fk',
        youtubeId: 'mgixJYEZ1Fk',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'Package organization and method structure in Java.'
      },
      {
        id: 't6-yt-2',
        title: 'Access Modifiers',
        url: 'https://youtu.be/SITEc4DWwsQ',
        youtubeId: 'SITEc4DWwsQ',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'Visibility scopes for variables and methods: public, private, protected.'
      },
      {
        id: 't6-yt-3',
        title: 'Methods (Short 1)',
        url: 'https://youtube.com/shorts/-JMyI7ZIOAk',
        youtubeId: '-JMyI7ZIOAk',
        type: 'short',
        speaker: 'YouTube',
        description: 'What is a method and how method signatures work.'
      },
      {
        id: 't6-yt-4',
        title: 'Static Methods Short',
        url: 'https://youtube.com/shorts/5bsXVWjEgsQ',
        youtubeId: '5bsXVWjEgsQ',
        type: 'short',
        speaker: 'YouTube',
        description: 'When and why to use the static keyword in method definitions.'
      },
      {
        id: 't6-yt-5',
        title: 'Java Methods Tutorial',
        url: 'https://youtu.be/JKecvKiNX2I',
        youtubeId: 'JKecvKiNX2I',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'Comprehensive guide to designing reusable modular methods.'
      },
      {
        id: 't6-yt-6',
        title: 'Overloaded Method',
        url: 'https://youtu.be/nhnAx79gxCM',
        youtubeId: 'nhnAx79gxCM',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'Overloading techniques for streamlining multi-type functions.'
      },
      {
        id: 't6-yt-7',
        title: 'Method (Short 2)',
        url: 'https://youtube.com/shorts/1w2Qkl-G_r0',
        youtubeId: '1w2Qkl-G_r0',
        type: 'short',
        speaker: 'YouTube',
        description: 'Understanding return types vs void methods in 60 seconds.'
      },
      {
        id: 't6-yt-8',
        title: 'Passing Argument by Value',
        url: 'https://youtu.be/H71vRa86AGg',
        youtubeId: 'H71vRa86AGg',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'How copy values are passed into methods in Java.'
      },
      {
        id: 't6-yt-9',
        title: 'Passing Argument by Reference',
        url: 'https://youtu.be/q_q-6KuP91c',
        youtubeId: 'q_q-6KuP91c',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'Effects of mutating array and object parameters inside methods.'
      },
      {
        id: 't6-yt-10',
        title: 'Access Modifier Short',
        url: 'https://youtube.com/shorts/4cfL8D2HkJc',
        youtubeId: '4cfL8D2HkJc',
        type: 'short',
        speaker: 'YouTube',
        description: 'Visual map of access modifier visibility in 30 seconds.'
      }
    ]
  },
  {
    id: 7,
    slug: 'topic-7-gui-objects',
    title: 'Topic 7: Pre-defined Object & Introduction to GUI',
    shortTitle: 'Objects & GUI (AWT/Swing)',
    description: 'Pre-defined Java objects, Object-Oriented Programming basics (Classes, Objects, Constructors), and Graphical User Interfaces (GUI Swing/AWT/NetBeans).',
    icon: 'Layout',
    color: 'from-emerald-500 to-teal-600',
    keyConcepts: [
      'Classes (Blueprint) vs Objects (Concrete Instances)',
      'Constructors: Automated initialization methods',
      'Core GUI Components: JFrame, JPanel, JButton, JLabel, JTextField',
      'Layout Managers: FlowLayout, BorderLayout, GridLayout',
      'Event Handling: ActionListener and actionPerformed()',
      'Building Interactive GUIs using NetBeans GUI Builder or pure Java code'
    ],
    codeSnippet: {
      title: 'Basic GUI Example with Java Swing',
      code: `import javax.swing.*;
import java.awt.event.*;

public class SimpleGUIDemo {
    public static void main(String[] args) {
        JFrame frame = new JFrame("BolehCode - Login Window");
        frame.setSize(350, 200);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLayout(null);

        JLabel label = new JLabel("Username:");
        label.setBounds(20, 20, 120, 25);
        frame.add(label);

        JTextField textField = new JTextField();
        textField.setBounds(140, 20, 160, 25);
        frame.add(textField);

        JButton button = new JButton("Login");
        button.setBounds(100, 80, 130, 30);
        button.addActionListener(e -> {
            JOptionPane.showMessageDialog(frame, "Welcome, " + textField.getText() + "!");
        });
        frame.add(button);

        frame.setVisible(true);
    }
}`
    },
    drTuanVideos: [],
    youtubeVideos: [
      {
        id: 't7-yt-1',
        title: 'GUI with Netbeans',
        url: 'https://youtu.be/YSpqHOwYrk4',
        youtubeId: 'YSpqHOwYrk4',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'Building drag-and-drop interfaces with NetBeans IDE.'
      },
      {
        id: 't7-yt-2',
        title: 'Class, Object & GUI',
        url: 'https://youtu.be/Kk6dlF59yGg',
        youtubeId: 'Kk6dlF59yGg',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'Connecting fundamental Java objects with visual screen elements.'
      },
      {
        id: 't7-yt-3',
        title: 'Login GUI',
        url: 'https://youtu.be/uEp-XJCEZqg',
        youtubeId: 'uEp-XJCEZqg',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'Step-by-step tutorial constructing a graphical login form.'
      },
      {
        id: 't7-yt-4',
        title: 'AWT Components Short',
        url: 'https://youtube.com/shorts/rrTYO07OqF8',
        youtubeId: 'rrTYO07OqF8',
        type: 'short',
        speaker: 'YouTube',
        description: 'Quick introduction to Abstract Window Toolkit elements.'
      },
      {
        id: 't7-yt-5',
        title: 'Class & Objects Short',
        url: 'https://youtube.com/shorts/qcNxWtOXhwI',
        youtubeId: 'qcNxWtOXhwI',
        type: 'short',
        speaker: 'YouTube',
        description: 'House blueprint analogy for understanding classes and objects.'
      },
      {
        id: 't7-yt-6',
        title: 'GUI Tutorial',
        url: 'https://youtu.be/MHU2IifkqOU',
        youtubeId: 'MHU2IifkqOU',
        type: 'tutorial',
        speaker: 'YouTube',
        description: 'Full tutorial implementing JButton click event listeners.'
      }
    ]
  },
  {
    id: 8,
    slug: 'topic-8-file-manipulation',
    title: 'Topic 8: Text File Manipulation',
    shortTitle: 'Text File I/O',
    description: 'Handling text files with BufferedReader, BufferedWriter, FileReader, FileWriter, and handling exception errors (IOException & FileNotFoundException).',
    icon: 'FileText',
    color: 'from-cyan-600 to-teal-500',
    keyConcepts: [
      'File Streams: Input Streams vs Output Streams',
      'Reading Files: Pairing FileReader with BufferedReader (readLine() method)',
      'Writing Files: Pairing FileWriter with BufferedWriter or PrintWriter',
      'Append Mode: FileWriter(file, true) to append data without overwriting',
      'Exception Handling: try-catch-finally blocks or try-with-resources',
      'Closing Streams: br.close() and bw.close() to prevent memory leaks'
    ],
    codeSnippet: {
      title: 'Reading & Writing Text Files Example',
      code: `import java.io.*;

public class FileIODemo {
    public static void main(String[] args) {
        String filename = "students.txt";

        // Writing into a file (BufferedWriter)
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(filename))) {
            bw.write("Alice Smith - 95%");
            bw.newLine();
            bw.write("Bob Johnson - 98%");
            System.out.println("Records successfully saved to file!");
        } catch (IOException e) {
            System.err.println("Error writing to file: " + e.getMessage());
        }

        // Reading file contents (BufferedReader)
        try (BufferedReader br = new BufferedReader(new FileReader(filename))) {
            String line;
            System.out.println("Reading data:");
            while ((line = br.readLine()) != null) {
                System.out.println("-> " + line);
            }
        } catch (IOException e) {
            System.err.println("Error reading file: " + e.getMessage());
        }
    }
}`
    },
    drTuanVideos: [],
    youtubeVideos: [
      {
        id: 't8-yt-1',
        title: 'BufferedReader Short',
        url: 'https://youtube.com/shorts/3VAsYnx-Wig',
        youtubeId: '3VAsYnx-Wig',
        type: 'short',
        speaker: 'YouTube',
        description: 'The fastest way to read lines of text using BufferedReader.'
      },
      {
        id: 't8-yt-2',
        title: 'BufferedWriter Short',
        url: 'https://youtube.com/shorts/MvzzBvbiwjk',
        youtubeId: 'MvzzBvbiwjk',
        type: 'short',
        speaker: 'YouTube',
        description: 'Efficient techniques for writing data output into text files.'
      }
    ]
  }
];
