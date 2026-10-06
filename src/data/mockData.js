export const initialStudents = [
  { id: 1, regNo: '7124102CS101', name: 'Aarthi Balasubramaniam', dept: 'CSE', year: 'III', email: 'aarthi.b@nec.edu.in', status: 'Active' },
  { id: 2, regNo: '7124102EC114', name: 'Bharath Kumar S', dept: 'ECE', year: 'II', email: 'bharath.k@nec.edu.in', status: 'Active' },
  { id: 3, regNo: '7124102ME045', name: 'Charumathi R', dept: 'MECH', year: 'IV', email: 'charumathi.r@nec.edu.in', status: 'Inactive' },
  { id: 4, regNo: '7124102IT078', name: 'Devika Sri M', dept: 'IT', year: 'III', email: 'devika.m@nec.edu.in', status: 'Active' },
  { id: 5, regNo: '7124102EEE032', name: 'Elangovan T', dept: 'EEE', year: 'I', email: 'elangovan.t@nec.edu.in', status: 'Active' },
  { id: 6, regNo: '7124102CS104', name: 'Farhan K', dept: 'CSE', year: 'III', email: 'farhan.k@nec.edu.in', status: 'Active' },
  { id: 7, regNo: '7124102EC117', name: 'Gowtham S', dept: 'ECE', year: 'II', email: 'gowtham.s@nec.edu.in', status: 'Active' },
];

// A small 3x6 seat grid used by the Seating Preview page.
// null = vacant seat, otherwise the register number occupying it.
export const initialSeatGrid = [
  ['7124102CS101', '7124102CS102', null, '7124102CS104', '7124102CS105', '7124102CS106'],
  ['7124102EC110', null, '7124102EC112', '7124102EC113', '7124102EC114', null],
  ['7124102ME050', '7124102ME051', '7124102ME052', null, '7124102ME054', '7124102ME055'],
];

export const dashboardStatsSeed = {
  totalStudents: 4812,
  activeHalls: 36,
  upcomingExams: 12,
  conflicts: 0,
};

export const initialStaff = [
  { id: 1, staffId: 'STF-1042', name: 'Dr. K. Meenakshi', dept: 'CSE', designation: 'Professor', email: 'meenakshi.k@nec.edu.in', status: 'Active', dutiesThisWeek: 2 },
  { id: 2, staffId: 'STF-1108', name: 'Mr. R. Selvam', dept: 'ECE', designation: 'Assoc. Professor', email: 'selvam.r@nec.edu.in', status: 'Active', dutiesThisWeek: 1 },
  { id: 3, staffId: 'STF-1211', name: 'Ms. P. Devi', dept: 'MECH', designation: 'Asst. Professor', email: 'devi.p@nec.edu.in', status: 'Active', dutiesThisWeek: 3 },
  { id: 4, staffId: 'STF-1305', name: 'Dr. N. Rajendran', dept: 'IT', designation: 'Professor', email: 'rajendran.n@nec.edu.in', status: 'Active', dutiesThisWeek: 0 },
  { id: 5, staffId: 'STF-1390', name: 'Mr. V. Karthik', dept: 'EEE', designation: 'Asst. Professor', email: 'karthik.v@nec.edu.in', status: 'Active', dutiesThisWeek: 5 },
];

export const departments = [
  { code: 'CSE', name: 'Computer Science & Engineering', students: 1240, staff: 42, hod: 'Dr. K. Meenakshi' },
  { code: 'ECE', name: 'Electronics & Communication', students: 980, staff: 34, hod: 'Dr. R. Anbarasan' },
  { code: 'EEE', name: 'Electrical & Electronics', students: 760, staff: 28, hod: 'Dr. S. Palaniappan' },
  { code: 'MECH', name: 'Mechanical Engineering', students: 890, staff: 30, hod: 'Dr. M. Vignesh' },
  { code: 'CIVIL', name: 'Civil Engineering', students: 520, staff: 22, hod: 'Dr. T. Suresh' },
  { code: 'IT', name: 'Information Technology', students: 422, staff: 18, hod: 'Dr. J. Arun' },
  { code: 'AIDS', name: 'Artificial Intelligence & Data Science', students: 186, staff: 12, hod: 'Dr. P. Lakshmi' },
];

export const subjects = [
  { code: 'CS301', name: 'Data Structures', dept: 'CSE', semester: 'V', enrolled: 210 },
  { code: 'EC302', name: 'Digital Electronics', dept: 'ECE', semester: 'V', enrolled: 186 },
  { code: 'ME303', name: 'Thermodynamics', dept: 'MECH', semester: 'V', enrolled: 164 },
  { code: 'IT304', name: 'Database Management Systems', dept: 'IT', semester: 'V', enrolled: 92 },
  { code: 'EE305', name: 'Power Electronics', dept: 'EEE', semester: 'V', enrolled: 78 },
];

export const initialExams = [
  { id: 1, code: 'CS301', subject: 'Data Structures', date: '25 Jul 2026', time: '10:00 AM', halls: 6, students: 210, status: 'Published' },
  { id: 2, code: 'EC302', subject: 'Digital Electronics', date: '27 Jul 2026', time: '10:00 AM', halls: 4, students: 186, status: 'Draft' },
  { id: 3, code: 'ME303', subject: 'Thermodynamics', date: '29 Jul 2026', time: '2:00 PM', halls: 5, students: 164, status: 'Published' },
  { id: 4, code: 'IT304', subject: 'Database Management Systems', date: '31 Jul 2026', time: '10:00 AM', halls: 3, students: 92, status: 'Not started' },
  { id: 5, code: 'EE305', subject: 'Power Electronics', date: '02 Aug 2026', time: '2:00 PM', halls: 2, students: 78, status: 'Not started' },
];

// `depts` lists every department a hall is allocated to. Most halls
// belong to a single department (e.g. the CSE-block classrooms), but a
// few shared seminar halls (like S6) are used by more than one dept -
// hence an array instead of a single `dept` string.
export const halls = [
  // ---------------- CSE ----------------
  { name: 'F7', block: 'Block A', floor: 'Ground Floor', capacity: 60, rows: 6, cols: 10, status: 'Free', depts: ['CSE'] },
  { name: 'F8', block: 'Block A', floor: 'Ground Floor', capacity: 60, rows: 6, cols: 10, status: 'Assigned', depts: ['CSE'] },
  { name: 'F9', block: 'Block A', floor: 'Ground Floor', capacity: 60, rows: 6, cols: 10, status: 'Free', depts: ['CSE'] },
  { name: 'F12', block: 'Block A', floor: 'First Floor', capacity: 54, rows: 6, cols: 9, status: 'Free', depts: ['CSE'] },
  { name: 'F14', block: 'Block A', floor: 'First Floor', capacity: 54, rows: 6, cols: 9, status: 'Assigned', depts: ['CSE'] },
  { name: 'F15', block: 'Block A', floor: 'First Floor', capacity: 54, rows: 6, cols: 9, status: 'Free', depts: ['CSE'] },
  { name: 'F16', block: 'Block A', floor: 'First Floor', capacity: 54, rows: 6, cols: 9, status: 'Free', depts: ['CSE'] },
  { name: 'S3', block: 'Block B', floor: 'Second Floor', capacity: 72, rows: 8, cols: 9, status: 'Free', depts: ['CSE'] },
  { name: 'S4', block: 'Block B', floor: 'Second Floor', capacity: 72, rows: 8, cols: 9, status: 'Assigned', depts: ['CSE'] },

  // ---------------- IT ----------------
  { name: 'UG Lab 1', block: 'Block C', floor: 'Ground Floor', capacity: 48, rows: 6, cols: 8, status: 'Free', depts: ['IT'] },
  { name: 'UG Lab 2', block: 'Block C', floor: 'Ground Floor', capacity: 48, rows: 6, cols: 8, status: 'Assigned', depts: ['IT'] },
  { name: 'UG Lab 3', block: 'Block C', floor: 'Ground Floor', capacity: 48, rows: 6, cols: 8, status: 'Free', depts: ['IT'] },
  { name: 'S8', block: 'Block B', floor: 'Second Floor', capacity: 72, rows: 8, cols: 9, status: 'Free', depts: ['IT'] },

  // ---------------- Shared between CSE and IT ----------------
  { name: 'S6', block: 'Block B', floor: 'Second Floor', capacity: 72, rows: 8, cols: 9, status: 'Assigned', depts: ['CSE', 'IT'] },

  // ---------------- EEE ----------------
  // EEE doesn't run a full standalone timetable per semester - instead
  // odd semesters (3rd + 5th) share a slot, and even semesters
  // (2nd + 4th + 6th) share another, so these 5 rooms cover EEE's
  // whole semester range across just two sessions. See hallPlanSeed
  // below for how each room splits between the paired semesters.
  { name: 'L1', block: 'EEE Block', floor: 'Ground Floor', capacity: 35, rows: 5, cols: 7, status: 'Free', depts: ['EEE'] },
  { name: 'L2', block: 'EEE Block', floor: 'Ground Floor', capacity: 35, rows: 5, cols: 7, status: 'Assigned', depts: ['EEE'] },
  { name: 'L3', block: 'EEE Block', floor: 'Ground Floor', capacity: 35, rows: 5, cols: 7, status: 'Free', depts: ['EEE'] },
  { name: 'L6', block: 'EEE Block', floor: 'First Floor', capacity: 30, rows: 5, cols: 6, status: 'Free', depts: ['EEE'] },
  { name: 'L7', block: 'EEE Block', floor: 'First Floor', capacity: 30, rows: 5, cols: 6, status: 'Assigned', depts: ['EEE'] },

  // ---------------- ECE ----------------
  { name: 'LH1', block: 'ECE Block', floor: 'Ground Floor', capacity: 35, rows: 5, cols: 7, status: 'Free', depts: ['ECE'] },
  { name: 'LH13', block: 'ECE Block', floor: 'First Floor', capacity: 35, rows: 5, cols: 7, status: 'Assigned', depts: ['ECE'] },
  { name: 'LH8', block: 'ECE Block', floor: 'First Floor', capacity: 30, rows: 5, cols: 6, status: 'Free', depts: ['ECE'] },
  { name: 'LH9', block: 'ECE Block', floor: 'First Floor', capacity: 30, rows: 5, cols: 6, status: 'Free', depts: ['ECE'] },
  { name: 'LH2', block: 'ECE Block', floor: 'Ground Floor', capacity: 35, rows: 5, cols: 7, status: 'Assigned', depts: ['ECE'] },
  { name: 'Elec. Lab 1', block: 'ECE Block', floor: 'Ground Floor', capacity: 24, rows: 4, cols: 6, status: 'Free', depts: ['ECE'] },

  // ---------------- AIDS ----------------
  { name: 'H1', block: 'AIDS Block', floor: 'Ground Floor', capacity: 30, rows: 5, cols: 6, status: 'Free', depts: ['AIDS'] },
  { name: 'H3', block: 'AIDS Block', floor: 'Ground Floor', capacity: 30, rows: 5, cols: 6, status: 'Assigned', depts: ['AIDS'] },
  { name: 'H6', block: 'AIDS Block', floor: 'First Floor', capacity: 24, rows: 4, cols: 6, status: 'Free', depts: ['AIDS'] },
  { name: 'H2', block: 'AIDS Block', floor: 'Ground Floor', capacity: 30, rows: 5, cols: 6, status: 'Free', depts: ['AIDS'] },
  { name: 'H5', block: 'AIDS Block', floor: 'First Floor', capacity: 24, rows: 4, cols: 6, status: 'Assigned', depts: ['AIDS'] },
  { name: 'AI&DL Lab', block: 'AIDS Block', floor: 'First Floor', capacity: 20, rows: 4, cols: 5, status: 'Free', depts: ['AIDS'] },

  // ---------------- CIVIL ----------------
  { name: 'LH1', block: 'Civil Block', floor: 'Ground Floor', capacity: 35, rows: 5, cols: 7, status: 'Free', depts: ['CIVIL'] },
  { name: 'LH2', block: 'Civil Block', floor: 'Ground Floor', capacity: 35, rows: 5, cols: 7, status: 'Assigned', depts: ['CIVIL'] },
  { name: 'LH7', block: 'Civil Block', floor: 'First Floor', capacity: 30, rows: 5, cols: 6, status: 'Free', depts: ['CIVIL'] },
  { name: 'LH8', block: 'Civil Block', floor: 'First Floor', capacity: 30, rows: 5, cols: 6, status: 'Free', depts: ['CIVIL'] },
  { name: 'LH9', block: 'Civil Block', floor: 'First Floor', capacity: 30, rows: 5, cols: 6, status: 'Assigned', depts: ['CIVIL'] },
];

// ---------------------------------------------------------------------
// Hall Plan (branch-wise abstract, mirroring the college's official
// "Abstract of Seating Plan" sheet). EEE, ECE, and AIDS don't get a
// dedicated slot per semester - instead they run TWO exam sessions
// that each pair up semesters sharing a timetable slot:
//   Session A: 5th Sem <-> 3rd Sem
//   Session B: 6th Sem <-> 4th Sem <-> 2nd Sem
// Within each session, every hall in a department is split between the
// paired semesters, each with its own contiguous register-number
// range - same idea as the reference PDF, where a hall lists multiple
// register-number bands with a student count against each.
//
// NOTE: the register-number ranges below are illustrative sample data
// (sequential placeholders), not real student records - swap them out
// once real student lists per semester are available.
export const hallPlanSeed = [
  {
    "id": "session-odd",
    "label": "5th Sem \u2194 3rd Sem",
    "date": "22 May 2026",
    "time": "10:00 AM - 01:00 PM",
    "depts": {
      "EEE": [
        { "name": "L1", "capacity": 35, "splits": [
          { "semester": "3rd Sem", "count": 16, "regFrom": "7124102EEE301", "regTo": "7124102EEE316" },
          { "semester": "5th Sem", "count": 19, "regFrom": "7124102EEE501", "regTo": "7124102EEE519" }
        ] },
        { "name": "L2", "capacity": 35, "splits": [
          { "semester": "3rd Sem", "count": 16, "regFrom": "7124102EEE317", "regTo": "7124102EEE332" },
          { "semester": "5th Sem", "count": 19, "regFrom": "7124102EEE520", "regTo": "7124102EEE538" }
        ] },
        { "name": "L3", "capacity": 35, "splits": [
          { "semester": "3rd Sem", "count": 16, "regFrom": "7124102EEE333", "regTo": "7124102EEE348" },
          { "semester": "5th Sem", "count": 19, "regFrom": "7124102EEE539", "regTo": "7124102EEE557" }
        ] },
        { "name": "L6", "capacity": 30, "splits": [
          { "semester": "3rd Sem", "count": 14, "regFrom": "7124102EEE349", "regTo": "7124102EEE362" },
          { "semester": "5th Sem", "count": 16, "regFrom": "7124102EEE558", "regTo": "7124102EEE573" }
        ] },
        { "name": "L7", "capacity": 30, "splits": [
          { "semester": "3rd Sem", "count": 14, "regFrom": "7124102EEE363", "regTo": "7124102EEE376" },
          { "semester": "5th Sem", "count": 16, "regFrom": "7124102EEE574", "regTo": "7124102EEE589" }
        ] }
      ],
      "ECE": [
        { "name": "LH1", "capacity": 35, "splits": [
          { "semester": "3rd Sem", "count": 16, "regFrom": "7124102EC301", "regTo": "7124102EC316" },
          { "semester": "5th Sem", "count": 19, "regFrom": "7124102EC501", "regTo": "7124102EC519" }
        ] },
        { "name": "LH13", "capacity": 35, "splits": [
          { "semester": "3rd Sem", "count": 16, "regFrom": "7124102EC317", "regTo": "7124102EC332" },
          { "semester": "5th Sem", "count": 19, "regFrom": "7124102EC520", "regTo": "7124102EC538" }
        ] },
        { "name": "LH8", "capacity": 30, "splits": [
          { "semester": "3rd Sem", "count": 14, "regFrom": "7124102EC333", "regTo": "7124102EC346" },
          { "semester": "5th Sem", "count": 16, "regFrom": "7124102EC539", "regTo": "7124102EC554" }
        ] },
        { "name": "LH9", "capacity": 30, "splits": [
          { "semester": "3rd Sem", "count": 14, "regFrom": "7124102EC347", "regTo": "7124102EC360" },
          { "semester": "5th Sem", "count": 16, "regFrom": "7124102EC555", "regTo": "7124102EC570" }
        ] },
        { "name": "LH2", "capacity": 35, "splits": [
          { "semester": "3rd Sem", "count": 16, "regFrom": "7124102EC361", "regTo": "7124102EC376" },
          { "semester": "5th Sem", "count": 19, "regFrom": "7124102EC571", "regTo": "7124102EC589" }
        ] },
        { "name": "Elec. Lab 1", "capacity": 24, "splits": [
          { "semester": "3rd Sem", "count": 11, "regFrom": "7124102EC377", "regTo": "7124102EC387" },
          { "semester": "5th Sem", "count": 13, "regFrom": "7124102EC590", "regTo": "7124102EC602" }
        ] }
      ],
      "AIDS": [
        { "name": "H1", "capacity": 30, "splits": [
          { "semester": "3rd Sem", "count": 14, "regFrom": "7124102AD301", "regTo": "7124102AD314" },
          { "semester": "5th Sem", "count": 16, "regFrom": "7124102AD501", "regTo": "7124102AD516" }
        ] },
        { "name": "H3", "capacity": 30, "splits": [
          { "semester": "3rd Sem", "count": 14, "regFrom": "7124102AD315", "regTo": "7124102AD328" },
          { "semester": "5th Sem", "count": 16, "regFrom": "7124102AD517", "regTo": "7124102AD532" }
        ] },
        { "name": "H6", "capacity": 24, "splits": [
          { "semester": "3rd Sem", "count": 11, "regFrom": "7124102AD329", "regTo": "7124102AD339" },
          { "semester": "5th Sem", "count": 13, "regFrom": "7124102AD533", "regTo": "7124102AD545" }
        ] },
        { "name": "H2", "capacity": 30, "splits": [
          { "semester": "3rd Sem", "count": 14, "regFrom": "7124102AD340", "regTo": "7124102AD353" },
          { "semester": "5th Sem", "count": 16, "regFrom": "7124102AD546", "regTo": "7124102AD561" }
        ] },
        { "name": "H5", "capacity": 24, "splits": [
          { "semester": "3rd Sem", "count": 11, "regFrom": "7124102AD354", "regTo": "7124102AD364" },
          { "semester": "5th Sem", "count": 13, "regFrom": "7124102AD562", "regTo": "7124102AD574" }
        ] },
        { "name": "AI&DL Lab", "capacity": 20, "splits": [
          { "semester": "3rd Sem", "count": 9, "regFrom": "7124102AD365", "regTo": "7124102AD373" },
          { "semester": "5th Sem", "count": 11, "regFrom": "7124102AD575", "regTo": "7124102AD585" }
        ] }
      ]
    }
  },
  {
    "id": "session-even",
    "label": "6th Sem \u2194 4th Sem \u2194 2nd Sem",
    "date": "25 May 2026",
    "time": "10:00 AM - 01:00 PM",
    "depts": {
      "EEE": [
        { "name": "L1", "capacity": 35, "splits": [
          { "semester": "6th Sem", "count": 12, "regFrom": "7124102EEE601", "regTo": "7124102EEE612" },
          { "semester": "4th Sem", "count": 12, "regFrom": "7124102EEE401", "regTo": "7124102EEE412" },
          { "semester": "2nd Sem", "count": 11, "regFrom": "7124102EEE201", "regTo": "7124102EEE211" }
        ] },
        { "name": "L2", "capacity": 35, "splits": [
          { "semester": "6th Sem", "count": 12, "regFrom": "7124102EEE613", "regTo": "7124102EEE624" },
          { "semester": "4th Sem", "count": 12, "regFrom": "7124102EEE413", "regTo": "7124102EEE424" },
          { "semester": "2nd Sem", "count": 11, "regFrom": "7124102EEE212", "regTo": "7124102EEE222" }
        ] },
        { "name": "L3", "capacity": 35, "splits": [
          { "semester": "6th Sem", "count": 12, "regFrom": "7124102EEE625", "regTo": "7124102EEE636" },
          { "semester": "4th Sem", "count": 12, "regFrom": "7124102EEE425", "regTo": "7124102EEE436" },
          { "semester": "2nd Sem", "count": 11, "regFrom": "7124102EEE223", "regTo": "7124102EEE233" }
        ] },
        { "name": "L6", "capacity": 30, "splits": [
          { "semester": "6th Sem", "count": 10, "regFrom": "7124102EEE637", "regTo": "7124102EEE646" },
          { "semester": "4th Sem", "count": 10, "regFrom": "7124102EEE437", "regTo": "7124102EEE446" },
          { "semester": "2nd Sem", "count": 10, "regFrom": "7124102EEE234", "regTo": "7124102EEE243" }
        ] },
        { "name": "L7", "capacity": 30, "splits": [
          { "semester": "6th Sem", "count": 10, "regFrom": "7124102EEE647", "regTo": "7124102EEE656" },
          { "semester": "4th Sem", "count": 10, "regFrom": "7124102EEE447", "regTo": "7124102EEE456" },
          { "semester": "2nd Sem", "count": 10, "regFrom": "7124102EEE244", "regTo": "7124102EEE253" }
        ] }
      ],
      "ECE": [
        { "name": "LH1", "capacity": 35, "splits": [
          { "semester": "6th Sem", "count": 12, "regFrom": "7124102EC601", "regTo": "7124102EC612" },
          { "semester": "4th Sem", "count": 12, "regFrom": "7124102EC401", "regTo": "7124102EC412" },
          { "semester": "2nd Sem", "count": 11, "regFrom": "7124102EC201", "regTo": "7124102EC211" }
        ] },
        { "name": "LH13", "capacity": 35, "splits": [
          { "semester": "6th Sem", "count": 12, "regFrom": "7124102EC613", "regTo": "7124102EC624" },
          { "semester": "4th Sem", "count": 12, "regFrom": "7124102EC413", "regTo": "7124102EC424" },
          { "semester": "2nd Sem", "count": 11, "regFrom": "7124102EC212", "regTo": "7124102EC222" }
        ] },
        { "name": "LH8", "capacity": 30, "splits": [
          { "semester": "6th Sem", "count": 10, "regFrom": "7124102EC625", "regTo": "7124102EC634" },
          { "semester": "4th Sem", "count": 10, "regFrom": "7124102EC425", "regTo": "7124102EC434" },
          { "semester": "2nd Sem", "count": 10, "regFrom": "7124102EC223", "regTo": "7124102EC232" }
        ] },
        { "name": "LH9", "capacity": 30, "splits": [
          { "semester": "6th Sem", "count": 10, "regFrom": "7124102EC635", "regTo": "7124102EC644" },
          { "semester": "4th Sem", "count": 10, "regFrom": "7124102EC435", "regTo": "7124102EC444" },
          { "semester": "2nd Sem", "count": 10, "regFrom": "7124102EC233", "regTo": "7124102EC242" }
        ] },
        { "name": "LH2", "capacity": 35, "splits": [
          { "semester": "6th Sem", "count": 12, "regFrom": "7124102EC645", "regTo": "7124102EC656" },
          { "semester": "4th Sem", "count": 12, "regFrom": "7124102EC445", "regTo": "7124102EC456" },
          { "semester": "2nd Sem", "count": 11, "regFrom": "7124102EC243", "regTo": "7124102EC253" }
        ] },
        { "name": "Elec. Lab 1", "capacity": 24, "splits": [
          { "semester": "6th Sem", "count": 8, "regFrom": "7124102EC657", "regTo": "7124102EC664" },
          { "semester": "4th Sem", "count": 8, "regFrom": "7124102EC457", "regTo": "7124102EC464" },
          { "semester": "2nd Sem", "count": 8, "regFrom": "7124102EC254", "regTo": "7124102EC261" }
        ] }
      ],
      "AIDS": [
        { "name": "H1", "capacity": 30, "splits": [
          { "semester": "6th Sem", "count": 10, "regFrom": "7124102AD601", "regTo": "7124102AD610" },
          { "semester": "4th Sem", "count": 10, "regFrom": "7124102AD401", "regTo": "7124102AD410" },
          { "semester": "2nd Sem", "count": 10, "regFrom": "7124102AD201", "regTo": "7124102AD210" }
        ] },
        { "name": "H3", "capacity": 30, "splits": [
          { "semester": "6th Sem", "count": 10, "regFrom": "7124102AD611", "regTo": "7124102AD620" },
          { "semester": "4th Sem", "count": 10, "regFrom": "7124102AD411", "regTo": "7124102AD420" },
          { "semester": "2nd Sem", "count": 10, "regFrom": "7124102AD211", "regTo": "7124102AD220" }
        ] },
        { "name": "H6", "capacity": 24, "splits": [
          { "semester": "6th Sem", "count": 8, "regFrom": "7124102AD621", "regTo": "7124102AD628" },
          { "semester": "4th Sem", "count": 8, "regFrom": "7124102AD421", "regTo": "7124102AD428" },
          { "semester": "2nd Sem", "count": 8, "regFrom": "7124102AD221", "regTo": "7124102AD228" }
        ] },
        { "name": "H2", "capacity": 30, "splits": [
          { "semester": "6th Sem", "count": 10, "regFrom": "7124102AD629", "regTo": "7124102AD638" },
          { "semester": "4th Sem", "count": 10, "regFrom": "7124102AD429", "regTo": "7124102AD438" },
          { "semester": "2nd Sem", "count": 10, "regFrom": "7124102AD229", "regTo": "7124102AD238" }
        ] },
        { "name": "H5", "capacity": 24, "splits": [
          { "semester": "6th Sem", "count": 8, "regFrom": "7124102AD639", "regTo": "7124102AD646" },
          { "semester": "4th Sem", "count": 8, "regFrom": "7124102AD439", "regTo": "7124102AD446" },
          { "semester": "2nd Sem", "count": 8, "regFrom": "7124102AD239", "regTo": "7124102AD246" }
        ] },
        { "name": "AI&DL Lab", "capacity": 20, "splits": [
          { "semester": "6th Sem", "count": 7, "regFrom": "7124102AD647", "regTo": "7124102AD653" },
          { "semester": "4th Sem", "count": 7, "regFrom": "7124102AD447", "regTo": "7124102AD453" },
          { "semester": "2nd Sem", "count": 6, "regFrom": "7124102AD247", "regTo": "7124102AD252" }
        ] }
      ]
    }
  }
];

// Every notification carries an `audience` ('admin' | 'staff' | 'student')
// so each role's Notifications page shows only its own slice of one
// shared, live list. A `userId` targets one specific person (their
// login id - Staff ID or Register No); omitting it means "broadcast to
// everyone in that audience." This used to be three separate hardcoded
// per-role arrays that nothing ever added to - now it's one seed that
// DataContext's addNotification() adds real entries onto (a duty
// assignment, a published exam, etc).
export const notificationsSeed = [
  { id: 1, audience: 'admin', title: '2 invigilators unassigned for Digital Electronics (EC302)', body: 'Hall 210 and Hall 212 still need invigilators before publishing.', tag: 'HIGH', time: '10 minutes ago', unread: true },
  { id: 2, audience: 'admin', title: 'Seating generated for Data Structures (CS301)', body: '54 of 60 seats allocated across Hall 104. Ready for review.', tag: 'SEATING', time: '1 hour ago', unread: true },
  { id: 3, audience: 'admin', title: 'Duplicate register number flagged in Hall 108', body: 'Seat A4 and C6 both list 7124102ME050. Resolve before publishing.', tag: 'CONFLICT', time: '2 hours ago', unread: true },
  { id: 4, audience: 'admin', title: 'Hall plan published for Thermodynamics (ME303)', body: 'Students have been notified and can now download hall slips.', tag: 'PUBLISHED', time: '2 days ago', unread: false },
  { id: 5, audience: 'staff', userId: 'STF-1042', title: 'New duty assigned: Thermodynamics (ME303)', body: "You've been assigned as Chief Invigilator for Hall 108 on 29 Jul.", tag: 'DUTY', time: '12 minutes ago', unread: true },
  { id: 6, audience: 'staff', userId: 'STF-1042', title: 'Reminder: Duty tomorrow at Hall 104', body: 'Data Structures (CS301) exam begins 10:00 AM. Please arrive 30 minutes early.', tag: 'REMINDER', time: '3 hours ago', unread: true },
  { id: 7, audience: 'staff', userId: 'STF-1042', title: 'Student list updated for Hall 104', body: '2 new students added to your assigned hall for CS301.', tag: 'UPDATE', time: 'Yesterday', unread: false },
  { id: 8, audience: 'staff', title: 'Hall plan published for Digital Electronics (EC302)', body: 'Your invigilation duty for EC302 is now complete.', tag: 'PUBLISHED', time: '2 days ago', unread: false },
  { id: 9, audience: 'student', title: 'Hall slip ready for Digital Electronics (EC302)', body: 'Your seat is D3 in Block B, Hall 210. Download it now.', tag: 'HALL SLIP', time: '1 hour ago', unread: true },
  { id: 10, audience: 'student', title: 'Data Structures exam is in 2 days', body: '25 Jul, 10:00 AM at Hall 104. Please arrive 30 minutes early.', tag: 'REMINDER', time: '3 hours ago', unread: true },
  { id: 11, audience: 'student', title: 'Semester V timetable published', body: 'Your full exam schedule for Semester V is now available.', tag: 'SCHEDULE', time: 'Yesterday', unread: false },
  { id: 12, audience: 'student', title: 'Hall slip ready for Data Structures (CS301)', body: 'Your seat is B7 in Block A, Hall 104.', tag: 'HALL SLIP', time: '2 days ago', unread: false },
];

export const auditLogsSeed = [
  { id: 1, timestamp: '25 Jul 2026, 09:42 AM', user: 'J. Arun (Admin)', action: 'Seating', details: 'Published hall plan for CS301' },
  { id: 2, timestamp: '25 Jul 2026, 09:10 AM', user: 'J. Arun (Admin)', action: 'Invigilators', details: 'Assigned Dr. Meenakshi to Hall 104' },
  { id: 3, timestamp: '24 Jul 2026, 04:55 PM', user: 'System', action: 'Backup', details: 'Weekly backup completed' },
  { id: 4, timestamp: '24 Jul 2026, 02:20 PM', user: 'J. Arun (Admin)', action: 'Students', details: 'Edited student 7124102CS101' },
  { id: 5, timestamp: '24 Jul 2026, 11:05 AM', user: 'J. Arun (Admin)', action: 'Students', details: 'Imported 1,240 student records' },
];

export const studentExamSchedule = [
  { subject: 'Data Structures (CS301)', date: '25 Jul 2026, 10:00 AM', hall: 'Hall 104', seat: 'B7', status: 'Published' },
  { subject: 'Digital Electronics (EC302)', date: '27 Jul 2026, 10:00 AM', hall: 'Hall 210', seat: 'D3', status: 'Pending' },
  { subject: 'Thermodynamics (ME303)', date: '29 Jul 2026, 2:00 PM', hall: 'Hall 108', seat: '—', status: 'Published' },
  { subject: 'Database Management Systems (IT304)', date: '31 Jul 2026, 10:00 AM', hall: '—', seat: '—', status: 'Pending' },
];

// Attendance per exam, broken down by department, for the Reports
// Dashboard's "Attendance % by department/exam" panel - a real exam
// cell tracks this to spot no-show patterns and to feed the absentee
// list the Controller of Examinations submits after every exam.
export const attendanceSeed = [
  { examCode: 'CS301', dept: 'CSE', present: 198, total: 210 },
  { examCode: 'EC302', dept: 'ECE', present: 171, total: 186 },
  { examCode: 'ME303', dept: 'MECH', present: 150, total: 164 },
  { examCode: 'IT304', dept: 'IT', present: 84, total: 92 },
  { examCode: 'EE305', dept: 'EEE', present: 70, total: 78 },
];

// Hall utilization (seats actually used vs total capacity offered)
// sampled across the term's exam dates, for the Reports Dashboard's
// "over the term" trend - distinct from the live Free/Assigned status
// elsewhere, which only reflects right now.
export const hallUtilizationTrendSeed = [
  { date: '05 Jul', seatsUsed: 612, capacity: 760 },
  { date: '12 Jul', seatsUsed: 684, capacity: 760 },
  { date: '19 Jul', seatsUsed: 590, capacity: 760 },
  { date: '25 Jul', seatsUsed: 730, capacity: 760 },
  { date: '29 Jul', seatsUsed: 650, capacity: 760 },
];

// Invigilation duties for staff, one list per staff member (keyed by
// staffId). 'session' is FN (forenoon) / AN (afternoon) - the two
// exam sessions used college-wide, alongside the plain time. status:
// 'completed' = hall already attended, 'current' = today's duty,
// 'upcoming' = a future assigned duty. No staff-side confirmation
// step - once admin assigns a duty it just shows up here.
//
// IMPORTANT: a staff member is only ever in charge of ONE hall at a
// time, so at most one entry per staffId should carry status:
// 'current'. hall names below are real rooms from the `halls` list
// above (not the old placeholder "Hall 210" style names), so Staff ->
// View Seating can look the room up against hallPlanSeed and render
// it in the same style as Admin's Hall Plan page.
export const staffDutiesSeed = [
  { id: 1, staffId: 'STF-1042', hall: 'LH9', block: 'ECE Block', dept: 'ECE', examName: 'Digital Electronics', code: 'EC302', semester: 'V', date: '18 Jul 2026', session: 'FN', time: '10:00 AM', studentsAssigned: 28, capacity: 30, regFrom: '7124102EC401', regTo: '7124102EC428', role: 'Invigilator', coInvigilator: null, status: 'completed' },
  { id: 2, staffId: 'STF-1042', hall: 'L3', block: 'EEE Block', dept: 'EEE', examName: 'Power Electronics', code: 'EE305', semester: 'V', date: '15 Jul 2026', session: 'AN', time: '2:00 PM', studentsAssigned: 32, capacity: 35, regFrom: '7124102EEE401', regTo: '7124102EEE432', role: 'Invigilator', coInvigilator: 'Ms. P. Devi', status: 'completed' },
  { id: 3, staffId: 'STF-1042', hall: 'F9', block: 'Block A', dept: 'CSE', examName: 'Data Structures', code: 'CS301', semester: 'V', date: '25 Jul 2026', session: 'FN', time: '10:00 AM', studentsAssigned: 54, capacity: 60, regFrom: '7124102CS501', regTo: '7124102CS554', role: 'Invigilator', coInvigilator: 'Mr. R. Selvam', status: 'current' },
  { id: 4, staffId: 'STF-1042', hall: 'H2', block: 'AIDS Block', dept: 'MECH', examName: 'Thermodynamics', code: 'ME303', semester: 'V', date: '29 Jul 2026', session: 'AN', time: '2:00 PM', studentsAssigned: 26, capacity: 30, regFrom: '7124102ME401', regTo: '7124102ME426', role: 'Chief Invigilator', coInvigilator: null, status: 'upcoming' },
];

// Looks up a hall (by name) inside hallPlanSeed and returns its full
// session + department + hall entry, so any page can render a hall in
// the same "split by group, register-no range per group" style as
// Admin's Hall Plan - without duplicating that data per feature.
// Returns null when the hall isn't part of the paired-semester scheme
// (e.g. a dedicated CSE/IT hall), so callers can fall back to
// whatever single-exam info they already have.
export function findHallPlanEntry(hallName) {
  for (const session of hallPlanSeed) {
    for (const dept of Object.keys(session.depts)) {
      const hall = session.depts[dept].find((h) => h.name === hallName);
      if (hall) return { session, dept, hall };
    }
  }
  return null;
}
