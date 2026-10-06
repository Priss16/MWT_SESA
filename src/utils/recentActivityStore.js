const STORAGE_KEY = 'sesa_recent_activity';

function readActivity() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function writeActivity(data) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function logActivity(role, title, type, link) {
  const all = readActivity();
  const newItem = {
    id: Date.now().toString(),
    role,
    title,
    type, // 'hall', 'exam', 'student', 'report', 'staff'
    link,
    timestamp: Date.now(),
  };
  
  // Remove duplicates based on title and type
  const filtered = all.filter(a => !(a.title === title && a.type === type && a.role === role));
  
  filtered.unshift(newItem);
  
  // Keep only the 5 most recent
  writeActivity(filtered.slice(0, 5));
}

export function getRecentActivity(role) {
  const all = readActivity().filter(a => a.role === role);
  if (all.length === 0) {
    const basePath = role === 'admin' ? '/admin' : `/${role}`;
    return [
      { id: '1', role, title: 'Hall 104', type: 'hall', link: `${basePath}/halls`, timestamp: Date.now() - 1000 * 60 * 5 },
      { id: '2', role, title: 'Mid-Semester CS301', type: 'exam', link: `${basePath}/exams`, timestamp: Date.now() - 1000 * 60 * 15 },
      { id: '3', role, title: 'Student List', type: 'student', link: `${basePath}/students`, timestamp: Date.now() - 1000 * 60 * 60 * 2 }
    ];
  }
  return all;
}
