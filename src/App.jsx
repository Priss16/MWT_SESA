import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import IdleGuard from './components/IdleGuard';

// Public
import Splash from './pages/public/Splash';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Features from './pages/public/Features';
import Contact from './pages/public/Contact';
import ForgotPassword from './pages/public/ForgotPassword';
import ResetPassword from './pages/public/ResetPassword';
import LoginAdmin from './pages/public/LoginAdmin';
import LoginPrincipal from './pages/public/LoginPrincipal';
import LoginHod from './pages/public/LoginHod';
import LoginStaff from './pages/public/LoginStaff';
import LoginStudent from './pages/public/LoginStudent';

// Principal
import PrincipalDashboard from './pages/principal/PrincipalDashboard';
import PrincipalDepartments from './pages/principal/PrincipalDepartments';
import PrincipalExams from './pages/principal/PrincipalExams';
import PrincipalHalls from './pages/principal/PrincipalHalls';
import PrincipalInvigilation from './pages/principal/PrincipalInvigilation';
import PrincipalSubstitutions from './pages/principal/PrincipalSubstitutions';
import PrincipalSettings from './pages/principal/PrincipalSettings';

// HOD
import HodDashboard from './pages/hod/HodDashboard';
import HodExams from './pages/hod/HodExams';
import HodHalls from './pages/hod/HodHalls';
import HodStaff from './pages/hod/HodStaff';
import HodInvigilation from './pages/hod/HodInvigilation';
import HodSubstitutions from './pages/hod/HodSubstitutions';
import HodSettings from './pages/hod/HodSettings';

// Admin
import AdminDashboard from './pages/AdminDashboard';
import ManageStudents from './pages/ManageStudents';
import AddStudent from './pages/admin/AddStudent';
import EditStudent from './pages/admin/EditStudent';
import StudentDetails from './pages/admin/StudentDetails';
import ManageStaff from './pages/admin/ManageStaff';
import AddStaff from './pages/admin/AddStaff';
import StaffDetails from './pages/admin/StaffDetails';
import Departments from './pages/admin/Departments';
import Subjects from './pages/admin/Subjects';
import Exams from './pages/admin/Exams';
import AddExam from './pages/admin/AddExam';
import EditExam from './pages/admin/EditExam';
import HallManagement from './pages/admin/HallManagement';
import HallPlan from './pages/admin/HallPlan';
import AddHall from './pages/admin/AddHall';
import Invigilators from './pages/admin/Invigilators';
import AssignInvigilators from './pages/admin/AssignInvigilators';
import AdminNotifications from './pages/admin/AdminNotifications';

import AuditLogs from './pages/admin/AuditLogs';
import Profile from './pages/admin/Profile';
import Settings from './pages/admin/Settings';

// Staff
import StaffDashboard from './pages/staff/StaffDashboard';
import MyInvigilation from './pages/staff/MyInvigilation';
import MySubstitutionRequests from './pages/staff/MySubstitutionRequests';
import RequestSubstitute from './pages/staff/RequestSubstitute';
import AssignedHalls from './pages/staff/AssignedHalls';
import StaffStudentList from './pages/staff/StaffStudentList';
import StaffNotifications from './pages/staff/StaffNotifications';
import StaffProfile from './pages/staff/StaffProfile';
import StaffSettings from './pages/staff/StaffSettings';
import StaffSeatingView from './pages/staff/StaffSeatingView';

// Student
import StudentDashboard from './pages/student/StudentDashboard';
import SearchHall from './pages/student/SearchHall';
import HallSearchResult from './pages/student/HallSearchResult';
import HallSlip from './pages/student/HallSlip';
import DownloadHallSlip from './pages/student/DownloadHallSlip';
import ExamSchedule from './pages/student/ExamSchedule';
import StudentNotifications from './pages/student/StudentNotifications';
import StudentProfile from './pages/student/StudentProfile';
import StudentSettings from './pages/student/StudentSettings';
import ChangePassword from './pages/student/ChangePassword';

function PrincipalRoute({ children }) {
  return (
    <ProtectedRoute allowedRoles={['principal']}>
      {children}
    </ProtectedRoute>
  );
}

function HodRoute({ children }) {
  return (
    <ProtectedRoute allowedRoles={['hod']}>
      {children}
    </ProtectedRoute>
  );
}

// Role-scoped wrappers
function AdminRoute({ children }) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      {children}
    </ProtectedRoute>
  );
}

function StaffRoute({ children }) {
  return (
    <ProtectedRoute allowedRoles={['staff']}>
      {children}
    </ProtectedRoute>
  );
}

function StudentRoute({ children }) {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      {children}
    </ProtectedRoute>
  );
}

import NotificationPoller from './components/NotificationPoller';

export default function App() {
  // Show splash screen on initial app load.
  const [booting, setBooting] = useState(true);

  if (booting) {
    return (
      <Splash
        onFinish={() => setBooting(false)}
      />
    );
  }

  return (
    <>
      <IdleGuard />
      <NotificationPoller />

      <Routes>
        {/* ================= PUBLIC ================= */}

        <Route
          path="/splash"
          element={<Splash />}
        />

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/features"
          element={<Features />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/login"
          element={<LoginAdmin />}
        />

        <Route
          path="/login/principal"
          element={<LoginPrincipal />}
        />

        <Route
          path="/login/hod"
          element={<LoginHod />}
        />

        <Route
          path="/login/staff"
          element={<LoginStaff />}
        />

        <Route
          path="/login/student"
          element={<LoginStudent />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/students"
          element={
            <AdminRoute>
              <ManageStudents />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/students/add"
          element={
            <AdminRoute>
              <AddStudent />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/students/:id/edit"
          element={
            <AdminRoute>
              <EditStudent />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/students/:id"
          element={
            <AdminRoute>
              <StudentDetails />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/staff"
          element={
            <AdminRoute>
              <ManageStaff />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/staff/add"
          element={
            <AdminRoute>
              <AddStaff />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/staff/:id"
          element={
            <AdminRoute>
              <StaffDetails />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/departments"
          element={
            <AdminRoute>
              <Departments />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/subjects"
          element={
            <AdminRoute>
              <Subjects />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/exams"
          element={
            <AdminRoute>
              <Exams />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/exams/add"
          element={
            <AdminRoute>
              <AddExam />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/exams/:id/edit"
          element={
            <AdminRoute>
              <EditExam />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/halls"
          element={
            <AdminRoute>
              <HallManagement />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/halls/add"
          element={
            <AdminRoute>
              <AddHall />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/hall-plan"
          element={
            <AdminRoute>
              <HallPlan />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/invigilators"
          element={
            <AdminRoute>
              <Invigilators />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/notifications"
          element={
            <AdminRoute>
              <AdminNotifications />
            </AdminRoute>
          }
        />



        <Route
          path="/admin/audit-logs"
          element={
            <AdminRoute>
              <AuditLogs />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <AdminRoute>
              <Profile />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <Settings />
            </AdminRoute>
          }
        />

        {/* ================= STAFF ================= */}

        <Route
          path="/staff/dashboard"
          element={
            <StaffRoute>
              <StaffDashboard />
            </StaffRoute>
          }
        />

        <Route
          path="/staff/invigilation"
          element={
            <StaffRoute>
              <MyInvigilation />
            </StaffRoute>
          }
        />

        <Route
          path="/staff/substitution-requests"
          element={
            <StaffRoute>
              <MySubstitutionRequests />
            </StaffRoute>
          }
        />

        <Route
          path="/staff/substitution-requests/new"
          element={
            <StaffRoute>
              <RequestSubstitute />
            </StaffRoute>
          }
        />

        <Route
          path="/staff/halls"
          element={
            <StaffRoute>
              <AssignedHalls />
            </StaffRoute>
          }
        />

        <Route
          path="/staff/students"
          element={
            <StaffRoute>
              <StaffStudentList />
            </StaffRoute>
          }
        />

        <Route
          path="/staff/notifications"
          element={
            <StaffRoute>
              <StaffNotifications />
            </StaffRoute>
          }
        />

        <Route
          path="/staff/profile"
          element={
            <StaffRoute>
              <StaffProfile />
            </StaffRoute>
          }
        />

        <Route
  path="/staff/settings"
  element={
    <StaffRoute>
      <StaffSettings />
    </StaffRoute>
  }
/>

        <Route
          path="/staff/seating"
          element={
            <StaffRoute>
              <StaffSeatingView />
            </StaffRoute>
          }
        />

        {/* ================= PRINCIPAL ================= */}

        <Route path="/principal/dashboard" element={<PrincipalRoute><PrincipalDashboard /></PrincipalRoute>} />
        <Route path="/principal/departments" element={<PrincipalRoute><PrincipalDepartments /></PrincipalRoute>} />
        <Route path="/principal/exams" element={<PrincipalRoute><PrincipalExams /></PrincipalRoute>} />
        <Route path="/principal/halls" element={<PrincipalRoute><PrincipalHalls /></PrincipalRoute>} />
        <Route path="/principal/invigilation" element={<PrincipalRoute><PrincipalInvigilation /></PrincipalRoute>} />
        <Route path="/principal/substitution-requests" element={<PrincipalRoute><PrincipalSubstitutions /></PrincipalRoute>} />
        <Route path="/principal/settings" element={<PrincipalRoute><PrincipalSettings /></PrincipalRoute>} />

        {/* ================= HOD ================= */}

        <Route path="/hod/dashboard" element={<HodRoute><HodDashboard /></HodRoute>} />
        <Route path="/hod/exams" element={<HodRoute><HodExams /></HodRoute>} />
        <Route path="/hod/halls" element={<HodRoute><HodHalls /></HodRoute>} />
        <Route path="/hod/staff" element={<HodRoute><HodStaff /></HodRoute>} />
        <Route path="/hod/invigilation" element={<HodRoute><HodInvigilation /></HodRoute>} />
        <Route path="/hod/substitution-requests" element={<HodRoute><HodSubstitutions /></HodRoute>} />
        <Route path="/hod/settings" element={<HodRoute><HodSettings /></HodRoute>} />

        {/* ================= STUDENT ================= */}

        <Route
          path="/student/dashboard"
          element={
            <StudentRoute>
              <StudentDashboard />
            </StudentRoute>
          }
        />

        <Route
          path="/student/search-hall"
          element={
            <StudentRoute>
              <SearchHall />
            </StudentRoute>
          }
        />

        <Route
          path="/student/search-hall/result"
          element={
            <StudentRoute>
              <HallSearchResult />
            </StudentRoute>
          }
        />

        <Route
          path="/student/hall-slip"
          element={
            <StudentRoute>
              <HallSlip />
            </StudentRoute>
          }
        />

        <Route
          path="/student/download-hall-slip"
          element={
            <StudentRoute>
              <DownloadHallSlip />
            </StudentRoute>
          }
        />

        <Route
          path="/student/exam-schedule"
          element={
            <StudentRoute>
              <ExamSchedule />
            </StudentRoute>
          }
        />

        <Route
          path="/student/notifications"
          element={
            <StudentRoute>
              <StudentNotifications />
            </StudentRoute>
          }
        />

        <Route
          path="/student/profile"
          element={
            <StudentRoute>
              <StudentProfile />
            </StudentRoute>
          }
        />

        <Route
          path="/student/settings"
          element={
            <StudentRoute>
              <StudentSettings />
            </StudentRoute>
          }
        />

        <Route
          path="/student/change-password"
          element={
            <StudentRoute>
              <ChangePassword />
            </StudentRoute>
          }
        />

        {/* ================= FALLBACK ================= */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </>
  );
}