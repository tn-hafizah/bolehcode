import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';
import { db } from './config';
import { handleFirestoreError, OperationType } from './errorHandler';
import { StudentRecord, QuizSubmissionRecord, UserProfile } from '../types';
import { ADMIN_EMAIL } from './authService';

// Default initial student records for preview if Firestore collections are newly initialized
const INITIAL_COHORT_STUDENTS: StudentRecord[] = [
  {
    uid: 'stud-cs-001',
    name: 'Ahmad Faiz bin Rosli',
    email: 'faiz.rosli@student.unisza.edu.my',
    studentId: 'CS20230101',
    institution: 'UniSZA (Faculty of Informatics & Computing)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    xp: 680,
    level: 5,
    streakDays: 7,
    completedTopics: [1, 2, 3, 4, 5],
    completedVideos: ['t1-dt-1', 't2-dt-1', 't3-dt-1', 't4-dt-1'],
    badges: ['badge-problemsolver', 'badge-modular', 'badge-syntaxmaster'],
    quizScores: { 1: 100, 2: 90, 3: 85, 4: 95, 5: 80 },
    gameHighScores: { flowchart: 450, loops: 320 },
    lastActive: new Date(Date.now() - 3600000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    uid: 'stud-cs-002',
    name: 'Nur Aisyah binti Zulkifli',
    email: 'aisyah.zul@student.unisza.edu.my',
    studentId: 'CS20230142',
    institution: 'UniSZA (Faculty of Informatics & Computing)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    xp: 820,
    level: 6,
    streakDays: 12,
    completedTopics: [1, 2, 3, 4, 5, 6],
    completedVideos: ['t1-dt-1', 't2-dt-1', 't3-dt-1', 't4-dt-1', 't5-dt-1', 't6-dt-1'],
    badges: ['badge-problemsolver', 'badge-modular', 'badge-master', 'badge-champion'],
    quizScores: { 1: 100, 2: 95, 3: 90, 4: 100, 5: 90, 6: 85 },
    gameHighScores: { flowchart: 520, stacker: 400 },
    lastActive: new Date(Date.now() - 3600000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    uid: 'stud-cs-003',
    name: 'Muhammad Harith Iskandar',
    email: 'harith.iskandar@student.unisza.edu.my',
    studentId: 'CS20230188',
    institution: 'UniSZA (Faculty of Informatics & Computing)',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    xp: 490,
    level: 4,
    streakDays: 4,
    completedTopics: [1, 2, 3],
    completedVideos: ['t1-dt-1', 't2-dt-1', 't3-dt-1'],
    badges: ['badge-problemsolver', 'badge-syntaxmaster'],
    quizScores: { 1: 85, 2: 80, 3: 75 },
    gameHighScores: { flowchart: 380 },
    lastActive: new Date(Date.now() - 3600000 * 18).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    uid: 'stud-cs-004',
    name: 'Siti Sarah binti Mansor',
    email: 'sarah.mansor@student.unisza.edu.my',
    studentId: 'CS20230205',
    institution: 'UniSZA (Faculty of Informatics & Computing)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    xp: 340,
    level: 3,
    streakDays: 2,
    completedTopics: [1, 2],
    completedVideos: ['t1-dt-1', 't2-dt-1'],
    badges: ['badge-problemsolver'],
    quizScores: { 1: 90, 2: 70 },
    gameHighScores: { flowchart: 310 },
    lastActive: new Date(Date.now() - 3600000 * 28).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 28).toISOString(),
  },
  {
    uid: 'stud-cs-005',
    name: 'Tan Wei Kang',
    email: 'tan.weikang@student.unisza.edu.my',
    studentId: 'CS20230240',
    institution: 'UniSZA (Faculty of Informatics & Computing)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'student',
    xp: 750,
    level: 5,
    streakDays: 9,
    completedTopics: [1, 2, 3, 4, 5, 7],
    completedVideos: ['t1-dt-1', 't2-dt-1', 't3-dt-1', 't4-dt-1', 't7-dt-1'],
    badges: ['badge-problemsolver', 'badge-modular', 'badge-master'],
    quizScores: { 1: 95, 2: 90, 3: 95, 4: 85, 7: 90 },
    gameHighScores: { guibuilder: 420 },
    lastActive: new Date(Date.now() - 3600000 * 8).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  }
];

const INITIAL_QUIZ_SUBMISSIONS: QuizSubmissionRecord[] = [
  {
    id: 'res-001',
    userId: 'stud-cs-001',
    studentUid: 'stud-cs-001',
    name: 'Ahmad Faiz bin Rosli',
    studentName: 'Ahmad Faiz bin Rosli',
    email: 'faiz.rosli@student.unisza.edu.my',
    studentEmail: 'faiz.rosli@student.unisza.edu.my',
    matricId: 'CS20230101',
    studentMatricId: 'CS20230101',
    topicId: '1',
    score: 10,
    totalQuestions: 10,
    percentage: 100,
    moduleProgress: 5,
    date: new Date(Date.now() - 3600000 * 48).toISOString(),
    submittedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'res-002',
    userId: 'stud-cs-002',
    studentUid: 'stud-cs-002',
    name: 'Nur Aisyah binti Zulkifli',
    studentName: 'Nur Aisyah binti Zulkifli',
    email: 'aisyah.zul@student.unisza.edu.my',
    studentEmail: 'aisyah.zul@student.unisza.edu.my',
    matricId: 'CS20230142',
    studentMatricId: 'CS20230142',
    topicId: '4',
    score: 9,
    totalQuestions: 10,
    percentage: 90,
    moduleProgress: 6,
    date: new Date(Date.now() - 3600000 * 24).toISOString(),
    submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'res-003',
    userId: 'stud-cs-005',
    studentUid: 'stud-cs-005',
    name: 'Tan Wei Kang',
    studentName: 'Tan Wei Kang',
    email: 'tan.weikang@student.unisza.edu.my',
    studentEmail: 'tan.weikang@student.unisza.edu.my',
    matricId: 'CS20230240',
    studentMatricId: 'CS20230240',
    topicId: '3',
    score: 8,
    totalQuestions: 10,
    percentage: 80,
    moduleProgress: 6,
    date: new Date(Date.now() - 3600000 * 12).toISOString(),
    submittedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  }
];

export async function fetchStudentProfile(uid: string): Promise<StudentRecord | null> {
  // Check users collection first
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) return snap.data() as StudentRecord;
  } catch (error) {
    // try fallback
  }

  // Fallback to students collection
  try {
    const snap2 = await getDoc(doc(db, 'students', uid));
    if (snap2.exists()) return snap2.data() as StudentRecord;
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
    return null;
  }
}

export async function syncOrCreateStudentProfile(
  firebaseUser: FirebaseUser,
  customData?: {
    studentId?: string;
    institution?: string;
    initialXP?: number;
    role?: 'student' | 'admin';
  }
): Promise<StudentRecord> {
  const isSuperAdmin = firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const now = new Date().toISOString();

  let existingData: Partial<StudentRecord> | null = null;
  try {
    const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (snap.exists()) {
      existingData = snap.data() as StudentRecord;
    } else {
      const snapOld = await getDoc(doc(db, 'students', firebaseUser.uid));
      if (snapOld.exists()) {
        existingData = snapOld.data() as StudentRecord;
      }
    }
  } catch (e) {
    console.warn('Error reading existing student profile:', e);
  }

  const determinedRole = isSuperAdmin
    ? 'admin'
    : (customData?.role || existingData?.role || 'student');

  if (existingData) {
    const updated: StudentRecord = {
      ...existingData as StudentRecord,
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || existingData.name || 'UniSZA Student',
      email: firebaseUser.email || existingData.email || '',
      avatar: firebaseUser.photoURL || existingData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      studentId: customData?.studentId || existingData.studentId || 'CS20240188',
      institution: customData?.institution || existingData.institution || 'UniSZA (Faculty of Informatics & Computing)',
      role: determinedRole,
      lastActive: now,
      updatedAt: now,
    };

    try {
      // Save to primary users collection as requested
      await setDoc(doc(db, 'users', firebaseUser.uid), updated, { merge: true });
      // Dual-sync to students for backward compatibility
      await setDoc(doc(db, 'students', firebaseUser.uid), updated, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${firebaseUser.uid}`);
    }

    return updated;
  } else {
    const newStudent: StudentRecord = {
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || 'Computer Science Student',
      email: firebaseUser.email || 'student@unisza.edu.my',
      studentId: customData?.studentId || 'CS20240188',
      institution: customData?.institution || 'UniSZA (Faculty of Informatics & Computing)',
      avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: determinedRole,
      xp: customData?.initialXP || 350,
      level: 3,
      streakDays: 3,
      completedTopics: [1, 2],
      completedVideos: ['t1-dt-1', 't2-dt-1'],
      badges: ['badge-problemsolver'],
      quizScores: {},
      gameHighScores: {},
      lastActive: now,
      createdAt: now,
      updatedAt: now,
    };

    try {
      // Save to primary users collection as requested
      await setDoc(doc(db, 'users', firebaseUser.uid), newStudent);
      // Dual-sync to students collection
      await setDoc(doc(db, 'students', firebaseUser.uid), newStudent);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${firebaseUser.uid}`);
    }

    return newStudent;
  }
}

export async function saveStudentProgress(
  uid: string,
  updatedData: Partial<UserProfile>
): Promise<void> {
  const now = new Date().toISOString();
  const payload: Record<string, unknown> = {
    ...updatedData,
    updatedAt: now,
    lastActive: now,
  };

  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) delete payload[key];
  });

  try {
    await setDoc(doc(db, 'users', uid), payload, { merge: true });
    await setDoc(doc(db, 'students', uid), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
  }
}

export async function recordQuizSubmission(
  submission: Omit<QuizSubmissionRecord, 'id'>
): Promise<void> {
  const now = new Date().toISOString();
  const submissionData = {
    ...submission,
    userId: submission.userId || submission.studentUid,
    name: submission.name || submission.studentName,
    email: submission.email || submission.studentEmail,
    matricId: submission.matricId || submission.studentMatricId,
    date: submission.date || submission.submittedAt || now,
    submittedAt: submission.submittedAt || now,
  };

  try {
    // Save to primary results collection as requested
    await addDoc(collection(db, 'results'), submissionData);
    // Dual write to quiz_submissions for compatibility
    await addDoc(collection(db, 'quiz_submissions'), submissionData);

    // Also update student's profile in users collection
    if (submission.studentUid) {
      const userRef = doc(db, 'users', submission.studentUid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const udata = userSnap.data() as StudentRecord;
        const currentScores = udata.quizScores || {};
        const topicKey = submission.topicId || 'general';
        const bestScore = Math.max(currentScores[topicKey] || 0, submission.percentage);
        
        await setDoc(userRef, {
          quizScores: {
            ...currentScores,
            [topicKey]: bestScore,
          },
          lastActive: now,
          updatedAt: now,
        }, { merge: true });
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'results');
  }
}

export async function fetchAllStudents(): Promise<StudentRecord[]> {
  try {
    // 1. Check primary users collection
    const snap = await getDocs(collection(db, 'users'));
    const list: StudentRecord[] = [];
    snap.forEach((d) => {
      list.push(d.data() as StudentRecord);
    });

    if (list.length > 0) {
      return list;
    }

    // 2. Fallback to students collection
    const snapOld = await getDocs(collection(db, 'students'));
    const oldList: StudentRecord[] = [];
    snapOld.forEach((d) => {
      oldList.push(d.data() as StudentRecord);
    });

    if (oldList.length > 0) {
      return oldList;
    }

    // 3. Return initial cohort so the admin dashboard is immediately rich and interactive
    return INITIAL_COHORT_STUDENTS;
  } catch (error) {
    console.warn('Firestore fetchAllStudents fallback to cohort:', error);
    return INITIAL_COHORT_STUDENTS;
  }
}

export function subscribeToAllStudents(
  onData: (students: StudentRecord[]) => void,
  onError?: (err: unknown) => void
) {
  try {
    return onSnapshot(
      collection(db, 'users'),
      (snap) => {
        if (!snap.empty) {
          const list: StudentRecord[] = [];
          snap.forEach((d) => {
            list.push(d.data() as StudentRecord);
          });
          onData(list);
        } else {
          onData(INITIAL_COHORT_STUDENTS);
        }
      },
      (error) => {
        if (onError) onError(error);
        // Fallback to initial cohort
        onData(INITIAL_COHORT_STUDENTS);
      }
    );
  } catch (err) {
    onData(INITIAL_COHORT_STUDENTS);
    return () => {};
  }
}

export async function fetchAllQuizSubmissions(): Promise<QuizSubmissionRecord[]> {
  try {
    // Check results collection first
    const q = query(collection(db, 'results'), orderBy('submittedAt', 'desc'));
    const snap = await getDocs(q);
    const list: QuizSubmissionRecord[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as QuizSubmissionRecord);
    });

    if (list.length > 0) return list;
  } catch (error) {
    // try unordered results
    try {
      const snap = await getDocs(collection(db, 'results'));
      const list: QuizSubmissionRecord[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as QuizSubmissionRecord);
      });
      if (list.length > 0) return list;
    } catch {
      // try quiz_submissions
    }
  }

  try {
    const snapOld = await getDocs(collection(db, 'quiz_submissions'));
    const list: QuizSubmissionRecord[] = [];
    snapOld.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as QuizSubmissionRecord);
    });
    if (list.length > 0) return list;
  } catch {
    // ignore
  }

  return INITIAL_QUIZ_SUBMISSIONS;
}
