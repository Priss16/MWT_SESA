export const DEMO_DEPARTMENTS = [
  'CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS'
];

export const DEMO_PRINCIPAL = {
  id: 'principal',
  name: 'Principal',
  role: 'principal',
};

export const DEMO_HODS = DEMO_DEPARTMENTS.map(dept => ({
  id: `hod_${dept.toLowerCase()}`,
  name: `HOD ${dept}`,
  role: 'hod',
  department: dept
}));

// Mock Data logic for complete features
function safeJSON(key, defaultVal) {
    try {
        const raw = window.localStorage.getItem(key);
        if (raw) return JSON.parse(raw);
    } catch(e) {}
    return defaultVal;
}

export function getDemoInvigilation() {
  const seed = [
    { id: 1, staffId: '1001', staffName: 'Staff A', exam: 'CS101', subject: 'Programming Fundamentals', department: 'CSE', date: '20 Sep 2026', time: '09:30 AM', hall: 'F7', status: 'Assigned' },
    { id: 2, staffId: '1002', staffName: 'Staff B', exam: 'CS201', subject: 'Data Structures', department: 'CSE', date: '21 Sep 2026', time: '09:30 AM', hall: 'F8', status: 'Substitution Pending' },
    { id: 3, staffId: '1003', staffName: 'Staff C', exam: 'EC101', subject: 'Digital Logic', department: 'ECE', date: '22 Sep 2026', time: '14:00 PM', hall: 'S1', status: 'Assigned' }
  ];
  const data = safeJSON('sesa_demo_invigilation', seed);
  return data;
}

export function saveDemoInvigilation(data) {
  window.localStorage.setItem('sesa_demo_invigilation', JSON.stringify(data));
}

export function getSubstitutionRequests() {
  const seed = [
    { id: 1, department: 'CSE', originalStaff: 'Staff A', replacementStaff: 'Staff X', exam: 'CS101', subject: 'Programming', date: '20 Sep 2026', time: '09:30 AM', hall: 'F7', reason: 'Medical Leave', hodStatus: 'Pending HOD Approval', principalStatus: 'Pending', finalStatus: 'Pending HOD Approval', letter: 'Sample letter text' },
    { id: 2, department: 'ECE', originalStaff: 'Staff B', replacementStaff: 'Staff Y', exam: 'EC101', subject: 'Digital Logic', date: '22 Sep 2026', time: '14:00 PM', hall: 'S1', reason: 'Personal Leave', hodStatus: 'HOD Approved', principalStatus: 'Pending Principal Approval', finalStatus: 'Pending Principal Approval', letter: 'Sample letter text' }
  ];
  return safeJSON('sesa_substitution_requests', seed);
}

export function saveSubstitutionRequests(requests) {
  window.localStorage.setItem('sesa_substitution_requests', JSON.stringify(requests));
}

export function requestSubstitution(request) {
  const reqs = getSubstitutionRequests();
  const newReq = {
    ...request,
    id: reqs.length ? Math.max(...reqs.map(r => r.id)) + 1 : 1,
    hodStatus: 'Pending HOD Approval',
    principalStatus: 'Pending',
    finalStatus: 'Pending HOD Approval',
    submittedDate: new Date().toISOString()
  };
  saveSubstitutionRequests([...reqs, newReq]);
  return newReq;
}

export function updateSubstitutionStatus(id, role, status) {
  const reqs = getSubstitutionRequests();
  const updatedReqs = reqs.map(req => {
    if (req.id === id) {
      const updated = { ...req };
      if (role === 'hod') {
        updated.hodStatus = status;
        if (status === 'HOD Approved') {
          updated.principalStatus = 'Pending Principal Approval';
          updated.finalStatus = 'Pending Principal Approval';
        } else if (status === 'HOD Rejected') {
          updated.finalStatus = 'HOD Rejected';
        }
      } else if (role === 'principal') {
        updated.principalStatus = status;
        updated.finalStatus = status;
      }
      return updated;
    }
    return req;
  });
  saveSubstitutionRequests(updatedReqs);
}
