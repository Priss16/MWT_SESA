# SESA — Full React Build (51 pages, role-based access, i18n, hooks)

A complete React (Vite) implementation of the Smart Examination Seating
Arrangement Portal — every page from the Figma design as a real, working
React component, with strict role-based routing, a language switcher,
a font-size control, and all 6 core React hooks used throughout.

## How to run

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Logging in

There are now **three separate login pages**, matching the three
separate SVG login screens (not just tabs on one page):

- `/login` — Admin Login
- `/login/staff` — Staff Login
- `/login/student` — Student Login

Each has its own headline, tagline, and identifier field (Email for
Admin, Staff ID for Staff, Register Number for Student). The role tabs
at the top of the form navigate BETWEEN these pages (real route
changes), not just local state. Any text in the ID/password fields
works — this is a front-end demo with simulated login.

## Role-based access is enforced

`ProtectedRoute` takes an `allowedRoles` prop. Log in as Student, then
manually edit the URL to `/admin/dashboard` or `/staff/dashboard` —
you'll be redirected straight back to `/student/dashboard`. Same for
the other two roles. Not logged in at all → redirected to `/login`.

## New in this version

- **Separate Admin / Staff / Student login pages** (`LoginAdmin.jsx`,
  `LoginStaff.jsx`, `LoginStudent.jsx`), sharing one `LoginLayout.jsx`
  component so the visuals stay consistent without three copies of
  the same 100+ lines of form code.
- **Consistent top nav on every Student page.** All 9 student pages
  (Dashboard, Search Hall, Hall Search Result, Hall Slip, Download
  Hall Slip, Exam Schedule, Notifications, Profile, Settings, Change
  Password) render the exact same `StudentNav.jsx` — same links, same
  order, same active-state highlighting.
- **Home link** (🏠) added to every logged-in nav bar (admin/staff
  Header, Student top nav, Admin/Staff Sidebar) so you can always get
  back to the public marketing site.
- **Explicit Logout button** on every role now — not just "click your
  avatar." Admin/Staff have a red Logout item at the bottom of the
  sidebar; Student has a visible "Logout" button in the top nav.
- **Language switcher (English / Tamil)** via a new `SettingsContext`
  + `translations.js` dictionary. Covers all shared chrome — sidebar
  nav, top nav, login form labels, settings labels. Switching
  language in the Preferences menu (⚙ icon, present on every page)
  relabels every nav item instantly. Extending translation to a
  page's body content follows the same `t('key')` pattern.
- **Font size control (Small / Medium / Large)** in the same
  Preferences menu — scales the whole app via a CSS zoom factor
  applied in `SettingsContext`, persisted to localStorage.
- **New Settings pages for Staff and Student** (`StaffSettings.jsx`,
  `StudentSettings.jsx`), matching the Admin `Settings.jsx` pattern —
  language/font controls plus role-relevant notification toggles,
  using a shared `Toggle.jsx` component.

## Pages (51 total)

**Public (9):** Splash, Home, About, Features, Contact, Admin Login,
Staff Login, Student Login, Forgot Password

**Admin (24):** Dashboard, Manage/Add/Edit Students, Student Details,
Manage/Add Staff, Staff Details, Departments, Subjects, Exams, Add/Edit
Exam, Hall Management, Add Hall, Invigilators, Seating Preview, Manual
Seat Editor, Assign Invigilators, Notifications, Reports Dashboard,
Hall Report, Student Report, Audit Logs, Profile, Settings

**Staff (6):** Dashboard, Assigned Halls, Student List, Notifications,
Profile, Settings

**Student (10):** Dashboard, Search Hall, Hall Search Result, Hall
Slip, Download Hall Slip, Exam Schedule, Notifications, Profile,
Settings, Change Password

## Where each hook is used (verified by grep across the codebase)

| Hook | Files using it | Examples |
|---|---|---|
| `useState` | 33 files | every form, every toggle, every filter |
| `useEffect` | 10 files | `AuthContext.jsx` (session restore + persist), `SettingsContext.jsx` (persist + apply zoom), `LoginLayout.jsx` (redirect if already logged in), `EditStudent.jsx`/`EditExam.jsx` (reload record on `:id` change), `AdminDashboard.jsx` (simulated fetch), `SeatingPreview.jsx` (multi-dependency), `Splash.jsx` (auto-redirect), `PreferencesMenu.jsx` (outside-click listener) |
| `useContext` | `AuthContext.jsx` + `useAuth()` (9 consuming files), `SettingsContext.jsx` + `useSettings()` (10 consuming files) | shares logged-in user and language/font-size across every page without prop drilling |
| `useRef` | `PreferencesMenu.jsx` (outside-click detection), `AdminDashboard.jsx` (render counter), `ManageStudents.jsx` (auto-focus search input) | |
| `useMemo` | 10 files | `AddHall.jsx` (live capacity), `ChangePassword.jsx` (password strength), `SeatingPreview.jsx`/`ManualSeatEditor.jsx` (seat counts), `ManageStudents.jsx`/`Subjects.jsx`/`ManageStaff.jsx`/`StaffStudentList.jsx` (filtered lists), `AdminDashboard.jsx` (department breakdown), `HallManagement.jsx` (block filter) |
| `useCallback` | `SeatingPreview.jsx`, `ManualSeatEditor.jsx` (paired with `React.memo` on `SeatCell.jsx`), `ManageStudents.jsx`, `AssignInvigilators.jsx` | stable handlers so memoized children don't re-render unnecessarily |

## Project structure

```
sesa-react/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx                 # wraps App in SettingsProvider + BrowserRouter
│   ├── App.jsx                  # all 51 routes, role-guarded
│   ├── index.css
│   ├── context/
│   │   ├── AuthContext.jsx      # useContext + useState + useEffect
│   │   └── SettingsContext.jsx  # language + font size (useContext + useState + useEffect)
│   ├── components/
│   │   ├── Sidebar.jsx          # role-aware, translation-aware
│   │   ├── Header.jsx           # admin/staff top bar
│   │   ├── StudentNav.jsx       # student top bar (same on all 10 student pages)
│   │   ├── PublicNav.jsx / PublicFooter.jsx
│   │   ├── PreferencesMenu.jsx  # language + font size dropdown (useRef + useEffect)
│   │   ├── LoginLayout.jsx      # shared shell for the 3 separate login pages
│   │   ├── Toggle.jsx           # shared switch used by all 3 Settings pages
│   │   ├── SeatCell.jsx         # React.memo child, pairs with useCallback
│   │   └── ProtectedRoute.jsx   # role-based guard
│   ├── data/
│   │   ├── mockData.js
│   │   └── translations.js      # English/Tamil dictionary
│   └── pages/
│       ├── public/   (Splash, Home, About, Features, Contact, LoginAdmin, LoginStaff, LoginStudent, ForgotPassword)
│       ├── admin/    (24 pages)
│       ├── staff/    (6 pages)
│       ├── student/  (10 pages)
│       ├── AdminDashboard.jsx, ManageStudents.jsx, SeatingPreview.jsx
```

## Notes

- All data is mocked in `src/data/mockData.js` — there's no real
  backend. Forms "save" by navigating back to the relevant list page.
- Font-size scaling uses the CSS `zoom` property, which is well
  supported in Chromium-based browsers (Chrome, Edge) and recent
  Firefox. If you need broader cross-browser support, swap the
  `document.documentElement.style.zoom` line in `SettingsContext.jsx`
  for a `transform: scale()` wrapper instead.
- This was built and verified with `npm run build` after every round
  of changes — it compiles cleanly with Vite (99 modules, no errors).
