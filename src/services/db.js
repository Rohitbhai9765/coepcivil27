import { getStudentsForSubject } from '../data/studentsData';
import { openDB } from 'idb';

const API_URL = import.meta.env.VITE_API_URL || '';
let cachedRecords = {};

const DB_NAME = 'attendance-db';
const DB_VERSION = 1;
const CACHE_STORE = 'attendanceCache';
const SYNC_QUEUE_STORE = 'syncQueue';

// Initialize IndexedDB
const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(CACHE_STORE)) {
        db.createObjectStore(CACHE_STORE);
      }
      if (!db.objectStoreNames.contains(SYNC_QUEUE_STORE)) {
        db.createObjectStore(SYNC_QUEUE_STORE, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

// Get all attendance records
export const getAttendanceRecords = async (subjectId) => {
  if (!subjectId) return {};
  
  try {
    const response = await fetch(`${API_URL}/api/attendance?subjectId=${subjectId}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    
    // Update local variables and IndexedDB cache
    cachedRecords[subjectId] = data;
    const db = await initDB();
    await db.put(CACHE_STORE, data, subjectId);
    
    return data;
  } catch (error) {
    console.warn("Network fetch failed, falling back to offline cache:", error);
    const db = await initDB();
    const cachedData = await db.get(CACHE_STORE, subjectId);
    
    if (cachedData) {
      cachedRecords[subjectId] = cachedData;
      return cachedData;
    }
    
    return cachedRecords[subjectId] || {};
  }
};

// Save attendance for a specific date
export const saveAttendance = async (dateStr, subjectId, presentStudents, lectureConducted = false) => {
  if (!subjectId) return;
  
  const payload = { date: dateStr, subjectId, presentStudents, lectureConducted };

  // Optimistically update local cache
  if (!cachedRecords[subjectId]) {
    cachedRecords[subjectId] = {};
  }
  cachedRecords[subjectId][dateStr] = { presentStudents, lectureConducted };
  
  const db = await initDB();
  await db.put(CACHE_STORE, cachedRecords[subjectId], subjectId);

  try {
    const response = await fetch(`${API_URL}/api/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Failed to save to server');
  } catch (error) {
    console.warn("Offline or network error, queueing for sync:", error);
    await db.add(SYNC_QUEUE_STORE, payload);
  }
};

// Sync offline data
export const syncOfflineData = async () => {
  const db = await initDB();
  const tx = db.transaction(SYNC_QUEUE_STORE, 'readonly');
  const store = tx.objectStore(SYNC_QUEUE_STORE);
  const allPending = await store.getAll();
  
  if (allPending.length === 0) return;
  
  console.log(`Attempting to sync ${allPending.length} records...`);
  
  for (const record of allPending) {
    try {
      const response = await fetch(`${API_URL}/api/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: record.date,
          subjectId: record.subjectId,
          presentStudents: record.presentStudents,
          lectureConducted: record.lectureConducted
        }),
      });
      
      if (response.ok) {
        const deleteTx = db.transaction(SYNC_QUEUE_STORE, 'readwrite');
        await deleteTx.objectStore(SYNC_QUEUE_STORE).delete(record.id);
        await deleteTx.done;
      }
    } catch (error) {
      console.error("Sync failed for record", record, error);
      // Stop syncing if we hit a network error again
      break; 
    }
  }
};

// Get statistics for each student
export const getStudentStatistics = async (subjectId) => {
  if (!subjectId) return [];
  const records = await getAttendanceRecords(subjectId);
  const dates = Object.keys(records);
  
  // Only count dates where lecture was actually conducted
  const conductedDates = dates.filter(date => records[date]?.lectureConducted === true);
  const totalClasses = conductedDates.length;

  const currentStudents = getStudentsForSubject(subjectId);

  return currentStudents.map(student => {
    const classesAttended = conductedDates.reduce((count, date) => {
      const isPresent = records[date]?.presentStudents?.includes(student.mis);
      return isPresent ? count + 1 : count;
    }, 0);

    const percentage = totalClasses === 0 ? 0 : Math.round((classesAttended / totalClasses) * 100);

    return {
      ...student,
      classesAttended,
      totalClasses,
      percentage
    };
  });
};
