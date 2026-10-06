import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';

import {
  initialExams as seedExams,
  notificationsSeed as seedNotifications,
} from '../data/mockData';

import {
  loadStaffDirectory,
  saveStaffDirectory,
} from '../utils/staffDirectoryStore';

import {
  loadAuditLogs,
  saveAuditLogs,
} from '../utils/auditLogStore';

const DataContext = createContext(null);

function floorLabel(floor) {
  if (floor === 0) return 'Ground Floor';
  if (floor === 1) return 'First Floor';
  if (floor === 2) return 'Second Floor';
  if (floor === 3) return 'Third Floor';

  if (floor === null || floor === undefined || floor === '') {
    return 'Unknown Floor';
  }

  return String(floor);
}

function statusLabel(status) {
  if (!status) return 'Free';

  const normalized = String(status).toLowerCase();

  if (
    normalized === 'available' ||
    normalized === 'free'
  ) {
    return 'Free';
  }

  if (normalized === 'assigned') {
    return 'Assigned';
  }

  return status;
}

function normalizeHall(hall) {
  const departmentCodes =
    typeof hall.department_codes === 'string'
      ? hall.department_codes
          .split(',')
          .map((code) => code.trim())
          .filter(Boolean)
      : [];

  return {
    id: hall.id,
    name: hall.name || hall.hall_number,
    hallNumber: hall.hall_number,

    block: hall.building || '',
    building: hall.building || '',

    floor: floorLabel(hall.floor),

    status: statusLabel(hall.status),

    depts: departmentCodes,

    capacity: Number(hall.capacity) || 0,

    rows: Number(hall.row_count) || 0,
    cols: Number(hall.column_count) || 0,

    rowCount: Number(hall.row_count) || 0,
    columnCount: Number(hall.column_count) || 0,
  };
}

export function DataProvider({ children }) {
  const [staff, setStaff] = useState(() =>
    loadStaffDirectory()
  );

  const [halls, setHalls] = useState([]);

  const [auditLogs, setAuditLogs] = useState(() =>
    loadAuditLogs()
  );

  const [exams, setExams] = useState(() => {
    try {
      const raw =
        window.localStorage.getItem('sesa_exams');

      if (raw) return JSON.parse(raw);
    } catch {
      // Ignore invalid localStorage.
    }

    return seedExams;
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const raw =
        window.localStorage.getItem(
          'sesa_notifications'
        );

      if (raw) return JSON.parse(raw);
    } catch {
      // Ignore invalid localStorage.
    }

    return seedNotifications;
  });

  // --------------------------------------------------
  // LOAD HALLS FROM BACKEND
  // --------------------------------------------------

  const loadHalls = useCallback(async () => {
    const token =
      window.localStorage.getItem('sesa_token');

    if (!token) {
      console.warn(
        'No backend token found. Halls were not loaded.'
      );
      setHalls([]);
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:5000/api/halls',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'Failed to load halls'
        );
      }

      const normalizedHalls = Array.isArray(result.data)
        ? result.data.map(normalizeHall)
        : [];

      setHalls(normalizedHalls);
    } catch (error) {
      console.error(
        'Failed to load halls from backend:',
        error
      );

      setHalls([]);
    }
  }, []);

  useEffect(() => {
    loadHalls();
  }, [loadHalls]);

  // --------------------------------------------------
  // STAFF
  // --------------------------------------------------

  useEffect(() => {
    saveStaffDirectory(staff);
  }, [staff]);

  // --------------------------------------------------
  // AUDIT LOGS
  // --------------------------------------------------

  useEffect(() => {
    saveAuditLogs(auditLogs);
  }, [auditLogs]);

  // --------------------------------------------------
  // NOTIFICATIONS
  // --------------------------------------------------

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'sesa_notifications',
        JSON.stringify(notifications)
      );
    } catch {
      // Ignore localStorage errors.
    }
  }, [notifications]);

  // --------------------------------------------------
  // EXAMS
  // --------------------------------------------------

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'sesa_exams',
        JSON.stringify(exams)
      );
    } catch {
      // Ignore localStorage errors.
    }
  }, [exams]);

  // --------------------------------------------------
  // STAFF ACTIONS
  // --------------------------------------------------

  const addStaff = useCallback((newStaff) => {
    setStaff((prev) => [
      ...prev,
      {
        id: prev.length
          ? Math.max(...prev.map((s) => s.id)) + 1
          : 1,
        ...newStaff,
      },
    ]);
  }, []);

  // --------------------------------------------------
  // HALL ACTIONS
  // --------------------------------------------------

  const addHall = useCallback((newHall) => {
    setHalls((prev) => [...prev, newHall]);
  }, []);

  const setHallStatus = useCallback(
    (hallName, status, dept) => {
      setHalls((prev) =>
        prev.map((h) =>
          h.name === hallName &&
          (!dept || h.depts?.includes(dept))
            ? { ...h, status }
            : h
        )
      );
    },
    []
  );

  // --------------------------------------------------
  // AUDIT LOG ACTIONS
  // --------------------------------------------------

  const addAuditLog = useCallback((entry) => {
    setAuditLogs((prev) => [
      {
        id: prev.length
          ? Math.max(...prev.map((l) => l.id)) + 1
          : 1,

        timestamp: new Date().toLocaleString(
          'en-IN',
          {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          }
        ),

        ...entry,
      },
      ...prev,
    ]);
  }, []);

  // --------------------------------------------------
  // NOTIFICATION ACTIONS
  // --------------------------------------------------

  const addNotification = useCallback((entry) => {
    setNotifications((prev) => [
      {
        id: prev.length
          ? Math.max(...prev.map((n) => n.id)) + 1
          : 1,

        time: 'Just now',
        unread: true,

        ...entry,
      },
      ...prev,
    ]);
  }, []);

  const markNotificationsRead = useCallback(
    (ids) => {
      setNotifications((prev) =>
        prev.map((n) =>
          ids.includes(n.id)
            ? { ...n, unread: false }
            : n
        )
      );
    },
    []
  );

  // --------------------------------------------------
  // EXAM PUBLISH
  // --------------------------------------------------

  const publishExam = useCallback(
    (examId) => {
      const exam = exams.find(
        (e) => e.id === examId
      );

      if (
        !exam ||
        exam.status === 'Published'
      ) {
        return;
      }

      setExams((prev) =>
        prev.map((e) =>
          e.id === examId
            ? { ...e, status: 'Published' }
            : e
        )
      );

      addNotification({
        audience: 'student',
        title: `Hall plan published for ${exam.subject} (${exam.code})`,
        body:
          'Seating is finalized - your hall slip is now available to download.',
        tag: 'PUBLISHED',
      });
    },
    [exams, addNotification]
  );

  const value = {
    staff,
    addStaff,

    halls,
    addHall,
    setHallStatus,
    loadHalls,

    auditLogs,
    addAuditLog,

    exams,
    publishExam,

    notifications,
    addNotification,
    markNotificationsRead,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);

  if (!ctx) {
    throw new Error(
      'useData must be used inside a <DataProvider>'
    );
  }

  return ctx;
}