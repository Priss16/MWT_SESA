import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Restore the saved frontend session + backend JWT.
  useEffect(() => {
    try {
      const savedUser = window.localStorage.getItem('sesa_user');
      const savedToken = window.localStorage.getItem('sesa_token');

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      if (savedToken) {
        setToken(savedToken);
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
      window.localStorage.removeItem('sesa_user');
      window.localStorage.removeItem('sesa_token');
    } finally {
      setCheckingSession(false);
    }
  }, []);

  // Keep user session persisted.
  useEffect(() => {
    if (user) {
      window.localStorage.setItem('sesa_user', JSON.stringify(user));
    } else {
      window.localStorage.removeItem('sesa_user');
    }
  }, [user]);

  // Keep JWT persisted.
  useEffect(() => {
    if (token) {
      window.localStorage.setItem('sesa_token', token);
    } else {
      window.localStorage.removeItem('sesa_token');
    }
  }, [token]);

  function deriveDisplayName(identifier, role) {
    if (!identifier) {
      return role === 'admin'
        ? 'Admin User'
        : role === 'principal'
        ? 'Principal'
        : role === 'hod'
        ? 'Head of Department'
        : role === 'staff'
        ? 'Staff Member'
        : 'Student';
    }

    const local = identifier.includes('@')
      ? identifier.split('@')[0]
      : identifier;

    const looksLikeWords =
      /[a-zA-Z]/.test(local) && !/^\d+$/.test(local);

    if (!looksLikeWords) {
      return identifier;
    }

    return local
      .replace(/[._-]+/g, ' ')
      .trim()
      .split(' ')
      .filter(Boolean)
      .map(
        (word) =>
          word[0].toUpperCase() + word.slice(1)
      )
      .join(' ');
  }

  function login(role, identifier, options = {}) {
    const {
      name: displayName,
      email,
      dept,
      year,
      semester,
      designation,
      mustChangePassword,
      token: backendToken,
    } = options;

    const defaultLabels = {
      admin: 'Examination Cell Admin',
      staff: 'Invigilator',
      principal: 'College Principal',
      hod: 'Head of Department',
    };

    const label =
      role === 'student'
        ? dept && year && semester
          ? `B.E. ${dept} · Year ${year} · Semester ${semester}`
          : 'Student'
        : role === 'staff'
        ? designation
          ? dept
            ? `${designation} · ${dept}`
            : designation
          : defaultLabels.staff
        : role === 'hod'
        ? dept
          ? `HOD · ${dept}`
          : defaultLabels.hod
        : defaultLabels[role];

    setUser({
      role,
      id: identifier,
      name: displayName?.trim()
        ? displayName.trim()
        : deriveDisplayName(identifier, role),
      label,
      email: email?.trim() || null,
      dept: dept || null,
      year: year || null,
      semester: semester || null,
      designation: designation || null,
      mustChangePassword: !!mustChangePassword,
    });

    let jwtToken = backendToken;
    if (!jwtToken) {
      console.warn("No backend token provided to login() - this is no longer supported in production.");
    }
    setToken(jwtToken);
  }

  function updateUser(patch) {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  function logout() {
    setUser(null);
    setToken(null);
  }

  const value = {
    user,
    token,
    checkingSession,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contextValue = useContext(AuthContext);

  if (!contextValue) {
    throw new Error(
      'useAuth must be used inside an <AuthProvider>'
    );
  }

  return contextValue;
}