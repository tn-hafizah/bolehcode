export const PAST_YEAR_CONFIG = {
  driveUrl: 'https://drive.google.com/drive/folders/1laOT2Fwx68KXuIcB-wbF3blRBPTSxptv?usp=sharing',
  folderName: 'Java & Problem Solving Past Year Question Archive',
  curator: 'Computer Science Faculty & Dr. Tuan',
  totalSets: '8+ Complete Question Sets with Marking Schemes'
};

export interface PastPaperItem {
  id: string;
  session: string;
  title: string;
  type: 'Final Exam' | 'Mid-Term Test' | 'Lab Assessment';
  difficulty: 'Standard' | 'Challenging' | 'Advanced';
  description: string;
  topicsCovered: string[];
  fileFormat: string;
}

export const PAST_PAPERS_LIST: PastPaperItem[] = [
  {
    id: 'py-2023-sem2',
    session: '2023/2024 Session (Semester 2)',
    title: 'Final Exam: Structured Programming in Java',
    type: 'Final Exam',
    difficulty: 'Standard',
    description: 'Features 4 structured sections: Loop tracing, method overloading design, 2D matrix operations, and text file persistence module.',
    topicsCovered: ['Topic 3', 'Topic 4', 'Topic 5', 'Topic 6', 'Topic 8'],
    fileFormat: 'PDF + Solution Scheme'
  },
  {
    id: 'py-2023-sem1',
    session: '2023/2024 Session (Semester 1)',
    title: 'Final Exam: Computer Problem Solving & Java',
    type: 'Final Exam',
    difficulty: 'Advanced',
    description: 'Focuses on complex problem solving: IPO charts, String manipulation, and buffered writer file logs.',
    topicsCovered: ['Topic 1', 'Topic 2', 'Topic 4', 'Topic 5', 'Topic 7'],
    fileFormat: 'PDF + Solution Scheme'
  },
  {
    id: 'py-2022-sem2',
    session: '2022/2023 Session (Semester 2)',
    title: 'Mid-Term Test: Fundamental Algorithms to Loops',
    type: 'Mid-Term Test',
    difficulty: 'Challenging',
    description: 'Midterm assessment: Nested if-else selection, nested while loop tracing, and data type casting.',
    topicsCovered: ['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4'],
    fileFormat: 'PDF Question Paper'
  },
  {
    id: 'py-2022-lab',
    session: '2022/2023 Session (Lab Test)',
    title: 'Practical Coding Test: Array & File Handling',
    type: 'Lab Assessment',
    difficulty: 'Advanced',
    description: 'Practical lab exam: Developing a complete Java program reading student records from input.txt and writing an analysis report.txt.',
    topicsCovered: ['Topic 5', 'Topic 6', 'Topic 8'],
    fileFormat: 'PDF + .java Reference Code'
  }
];

export interface ExamTip {
  title: string;
  trap: string;
  fix: string;
  snippet: string;
}

export const EXAM_TIPS: ExamTip[] = [
  {
    title: 'Integer Division Trap',
    trap: 'Calculating an average with int operands: `int a = 5, b = 2; double avg = a / b;` yields 2.0 instead of 2.5!',
    fix: 'Use explicit type casting or decimal literals: `double avg = (double) a / b;` or `double avg = a / 2.0;`.',
    snippet: `int a = 5, b = 2;\n// WRONG: double avg = a / b; // Yields: 2.0\n// CORRECT:\ndouble avg = (double) a / b; // Yields: 2.5`
  },
  {
    title: 'String Comparison using `==` Operator',
    trap: 'Using `if (str1 == str2)` only compares memory references, not the actual text characters.',
    fix: 'Always use `.equals()` or `.equalsIgnoreCase()` for value comparison.',
    snippet: `String s1 = new String("Java");\nString s2 = "Java";\n// WRONG: if (s1 == s2) { ... }\n// CORRECT:\nif (s1.equals(s2)) {\n    System.out.println("Equal!");\n}`
  },
  {
    title: 'Accidental Semicolon on Loop Header',
    trap: 'Placing `;` right after a for or while header: `for(int i = 0; i < 5; i++);` causes the loop body to be empty!',
    fix: 'Never place a semicolon at the end of loop declaration headers.',
    snippet: `// WRONG: for (int i = 0; i < 5; i++); {\n// CORRECT:\nfor (int i = 0; i < 5; i++) {\n    System.out.println(i);\n}`
  },
  {
    title: 'Missing `break` in `switch-case` Statements',
    trap: 'Without a `break;` statement, execution falls through unconditionally to the following cases.',
    fix: 'Terminate every `case` with `break;` unless deliberate fall-through behavior is required.',
    snippet: `switch (grade) {\n    case 'A':\n        System.out.println("Excellent");\n        break; // Mandatory!\n    default:\n        System.out.println("Pass");\n}`
  }
];
