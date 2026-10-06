import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

// Department IDs from the current departments table:
// 1 CSE, 2 ECE, 3 EEE, 4 MECH, 5 CIVIL, 6 IT, 7 AIDS
const DEPARTMENT_IDS = {
  CSE: 1,
  ECE: 2,
  EEE: 3,
  MECH: 4,
  CIVIL: 5,
  IT: 6,
  AIDS: 7,
};

const SEMESTER_MAP = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
  V: 5,
  VI: 6,
  VII: 7,
  VIII: 8,
};

const SEMESTER_REVERSE_MAP = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
  6: 'VI',
  7: 'VII',
  8: 'VIII',
};

const EMPTY_SUBJECT_FORM = {
  code: '',
  name: '',
  dept: 'CSE',
  semester: 'V',
  credits: '4.0',
};

export default function Subjects() {
  const { t } = useSettings();

  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);

  const [newSubject, setNewSubject] =
    useState(EMPTY_SUBJECT_FORM);

  const [editingSubject, setEditingSubject] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // --------------------------------------------------
  // LOAD SUBJECTS
  // --------------------------------------------------

  const loadSubjects = useCallback(async () => {
    const token =
      window.localStorage.getItem('sesa_token');

    if (!token) {
      setLoading(false);
      setErrorMessage(
        'Your session has expired. Please log in again.'
      );
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');

      const response = await fetch(
        'http://localhost:5000/api/subjects',
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            'Failed to load subjects'
        );
      }

      const normalizedSubjects =
        Array.isArray(result.data)
          ? result.data.map((subject) => ({
              id: subject.id,
              code: subject.code,
              name: subject.name,
              dept:
                subject.department_code ||
                'Unknown',

              semester:
                SEMESTER_REVERSE_MAP[
                  Number(subject.semester)
                ] ||
                String(
                  subject.semester || ''
                ),

              credits:
                subject.credits !== null &&
                subject.credits !== undefined
                  ? Number(subject.credits)
                  : null,

              enrolled: 0,
            }))
          : [];

      setSubjects(normalizedSubjects);
    } catch (error) {
      console.error(
        'Failed to load subjects:',
        error
      );

      setErrorMessage(
        error.message ||
          'Failed to load subjects'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filtered = useMemo(() => {
    const term =
      search.trim().toLowerCase();

    if (!term) {
      return subjects;
    }

    return subjects.filter(
      (subject) =>
        subject.name
          .toLowerCase()
          .includes(term) ||
        subject.code
          .toLowerCase()
          .includes(term)
    );
  }, [subjects, search]);

  // --------------------------------------------------
  // ADD SUBJECT
  // --------------------------------------------------

  const handleAdd = useCallback(
    async (e) => {
      e.preventDefault();

      if (
        !newSubject.code.trim() ||
        !newSubject.name.trim()
      ) {
        setErrorMessage(
          'Subject code and subject name are required.'
        );
        return;
      }

      const departmentId =
        DEPARTMENT_IDS[newSubject.dept];

      if (!departmentId) {
        setErrorMessage(
          'Invalid department selected.'
        );
        return;
      }

      const credits = Number(
        newSubject.credits
      );

      if (
        !Number.isFinite(credits) ||
        credits <= 0
      ) {
        setErrorMessage(
          'Please enter a valid credit value.'
        );
        return;
      }

      const token =
        window.localStorage.getItem(
          'sesa_token'
        );

      if (!token) {
        setErrorMessage(
          'Your session has expired. Please log in again.'
        );
        return;
      }

      try {
        setSaving(true);
        setErrorMessage('');

        const response = await fetch(
          'http://localhost:5000/api/subjects',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
              Authorization:
                'Bearer ' + token,
            },

            body: JSON.stringify({
              code: newSubject.code
                .trim()
                .toUpperCase(),

              name:
                newSubject.name.trim(),

              department_id:
                departmentId,

              semester:
                SEMESTER_MAP[
                  newSubject.semester
                ],

              credits,
            }),
          }
        );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              'Failed to create subject'
          );
        }

        await loadSubjects();

        setNewSubject({
          ...EMPTY_SUBJECT_FORM,
        });

        setShowForm(false);
      } catch (error) {
        console.error(
          'Create subject error:',
          error
        );

        setErrorMessage(
          error.message ||
            'Failed to create subject'
        );
      } finally {
        setSaving(false);
      }
    },
    [newSubject, loadSubjects]
  );

  // --------------------------------------------------
  // START EDITING
  // --------------------------------------------------

  const handleEdit = useCallback(
    (subject) => {
      setErrorMessage('');

      setEditingSubject({
        id: subject.id,
        code: subject.code || '',
        name: subject.name || '',
        dept: subject.dept || 'CSE',
        semester:
          subject.semester || 'I',
        credits:
          subject.credits !== null &&
          subject.credits !== undefined
            ? String(subject.credits)
            : '4.0',
      });
    },
    []
  );

  // --------------------------------------------------
  // CANCEL EDIT
  // --------------------------------------------------

  const handleCancelEdit = useCallback(() => {
    setEditingSubject(null);
    setErrorMessage('');
  }, []);

  // --------------------------------------------------
  // SAVE EDIT
  // --------------------------------------------------

  const handleUpdate = useCallback(
    async (e) => {
      e.preventDefault();

      if (!editingSubject) {
        return;
      }

      if (
        !editingSubject.code.trim() ||
        !editingSubject.name.trim()
      ) {
        setErrorMessage(
          'Subject code and subject name are required.'
        );
        return;
      }

      const departmentId =
        DEPARTMENT_IDS[
          editingSubject.dept
        ];

      if (!departmentId) {
        setErrorMessage(
          'Invalid department selected.'
        );
        return;
      }

      const credits = Number(
        editingSubject.credits
      );

      if (
        !Number.isFinite(credits) ||
        credits <= 0
      ) {
        setErrorMessage(
          'Please enter a valid credit value.'
        );
        return;
      }

      const semesterNumber =
        SEMESTER_MAP[
          editingSubject.semester
        ];

      if (!semesterNumber) {
        setErrorMessage(
          'Invalid semester selected.'
        );
        return;
      }

      const token =
        window.localStorage.getItem(
          'sesa_token'
        );

      if (!token) {
        setErrorMessage(
          'Your session has expired. Please log in again.'
        );
        return;
      }

      try {
        setSaving(true);
        setErrorMessage('');

        const response = await fetch(
          'http://localhost:5000/api/subjects/' +
            editingSubject.id,
          {
            method: 'PUT',
            headers: {
              'Content-Type':
                'application/json',
              Authorization:
                'Bearer ' + token,
            },

            body: JSON.stringify({
              code: editingSubject.code
                .trim()
                .toUpperCase(),

              name:
                editingSubject.name.trim(),

              department_id:
                departmentId,

              semester:
                semesterNumber,

              credits,
            }),
          }
        );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              'Failed to update subject'
          );
        }

        await loadSubjects();

        setEditingSubject(null);
      } catch (error) {
        console.error(
          'Update subject error:',
          error
        );

        setErrorMessage(
          error.message ||
            'Failed to update subject'
        );
      } finally {
        setSaving(false);
      }
    },
    [editingSubject, loadSubjects]
  );

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-content">
        <Header
          title={t('subjects')}
          subtitle={`${t('subjects')} / ${t('allSubjects')}`}
        />

        <div className="page-body">
          {/* ---------------------------------------- */}
          {/* SEARCH + ADD */}
          {/* ---------------------------------------- */}

          <div className="page-title-row">
            <input
              className="input"
              style={{ maxWidth: 320 }}
              placeholder="Search by subject code or name"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                setShowForm(
                  (prev) => !prev
                )
              }
              disabled={
                saving ||
                editingSubject !== null
              }
            >
              {showForm
                ? 'Cancel'
                : '+ Add Subject'}
            </button>
          </div>

          {/* ---------------------------------------- */}
          {/* ADD SUBJECT FORM */}
          {/* ---------------------------------------- */}

          {showForm && (
            <form
              className="card"
              onSubmit={handleAdd}
              style={{
                marginBottom: 20,
              }}
            >
              <h3
                style={{
                  marginBottom: 16,
                }}
              >
                New Subject
              </h3>

              <div
                className="grid-3"
                style={{
                  marginBottom: 16,
                }}
              >
                <div>
                  <label className="field-label">
                    Subject Code *
                  </label>

                  <input
                    className="input"
                    required
                    value={
                      newSubject.code
                    }
                    onChange={(e) =>
                      setNewSubject({
                        ...newSubject,
                        code:
                          e.target.value,
                      })
                    }
                    placeholder="e.g. CS306"
                  />
                </div>

                <div>
                  <label className="field-label">
                    Subject Name *
                  </label>

                  <input
                    className="input"
                    required
                    value={
                      newSubject.name
                    }
                    onChange={(e) =>
                      setNewSubject({
                        ...newSubject,
                        name:
                          e.target.value,
                      })
                    }
                    placeholder="e.g. Operating Systems"
                  />
                </div>

                <div>
                  <label className="field-label">{t('department')}</label>

                  <select
                    className="input"
                    value={
                      newSubject.dept
                    }
                    onChange={(e) =>
                      setNewSubject({
                        ...newSubject,
                        dept:
                          e.target.value,
                      })
                    }
                  >
                    <option value="CSE">
                      CSE
                    </option>
                    <option value="ECE">
                      ECE
                    </option>
                    <option value="EEE">
                      EEE
                    </option>
                    <option value="MECH">
                      MECH
                    </option>
                    <option value="CIVIL">
                      CIVIL
                    </option>
                    <option value="IT">
                      IT
                    </option>
                    <option value="AIDS">
                      AIDS
                    </option>
                  </select>
                </div>
              </div>

              <div
                className="grid-3"
                style={{
                  marginBottom: 16,
                }}
              >
                <div>
                  <label className="field-label">{t('semester')}</label>

                  <select
                    className="input"
                    value={
                      newSubject.semester
                    }
                    onChange={(e) =>
                      setNewSubject({
                        ...newSubject,
                        semester:
                          e.target.value,
                      })
                    }
                  >
                    {[
                      'I',
                      'II',
                      'III',
                      'IV',
                      'V',
                      'VI',
                      'VII',
                      'VIII',
                    ].map(
                      (semester) => (
                        <option
                          key={
                            semester
                          }
                          value={
                            semester
                          }
                        >
                          {semester}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="field-label">
                    Credits *
                  </label>

                  <input
                    className="input"
                    type="number"
                    min="0.5"
                    step="0.5"
                    required
                    value={
                      newSubject.credits
                    }
                    onChange={(e) =>
                      setNewSubject({
                        ...newSubject,
                        credits:
                          e.target.value,
                      })
                    }
                    placeholder="e.g. 4.0"
                  />
                </div>
              </div>

              {errorMessage && (
                <p
                  className="field-error"
                  style={{
                    marginBottom: 16,
                  }}
                >
                  {errorMessage}
                </p>
              )}

              <div
                style={{
                  textAlign: 'right',
                }}
              >
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : 'Save Subject'}
                </button>
              </div>
            </form>
          )}

          {/* ---------------------------------------- */}
          {/* GLOBAL ERROR */}
          {/* ---------------------------------------- */}

          {errorMessage &&
            !showForm &&
            !editingSubject && (
              <p
                className="field-error"
                style={{
                  marginBottom: 16,
                }}
              >
                {errorMessage}
              </p>
            )}

          {/* ---------------------------------------- */}
          {/* SUBJECT TABLE */}
          {/* ---------------------------------------- */}

          <div className="card">
            {loading ? (
              <p
                className="muted text-sm"
                style={{
                  padding: 20,
                }}
              >
                Loading subjects...
              </p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>{t('subjectName')}</th>
                    <th>{t('department')}</th>
                    <th>{t('semester')}</th>
                    <th>{t('credits')}</th>
                    <th>Enrolled</th>
                    <th>{t('action')}</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map(
                    (subject) => {
                      const isEditing =
                        editingSubject &&
                        editingSubject.id ===
                          subject.id;

                      if (isEditing) {
                        return (
                          <tr
                            key={
                              subject.id
                            }
                          >
                            <td>
                              <input
                                className="input"
                                value={
                                  editingSubject.code
                                }
                                onChange={(e) =>
                                  setEditingSubject(
                                    {
                                      ...editingSubject,
                                      code:
                                        e.target
                                          .value,
                                    }
                                  )
                                }
                              />
                            </td>

                            <td>
                              <input
                                className="input"
                                value={
                                  editingSubject.name
                                }
                                onChange={(e) =>
                                  setEditingSubject(
                                    {
                                      ...editingSubject,
                                      name:
                                        e.target
                                          .value,
                                    }
                                  )
                                }
                              />
                            </td>

                            <td>
                              <select
                                className="input"
                                value={
                                  editingSubject.dept
                                }
                                onChange={(e) =>
                                  setEditingSubject(
                                    {
                                      ...editingSubject,
                                      dept:
                                        e.target
                                          .value,
                                    }
                                  )
                                }
                              >
                                <option value="CSE">
                                  CSE
                                </option>
                                <option value="ECE">
                                  ECE
                                </option>
                                <option value="EEE">
                                  EEE
                                </option>
                                <option value="MECH">
                                  MECH
                                </option>
                                <option value="CIVIL">
                                  CIVIL
                                </option>
                                <option value="IT">
                                  IT
                                </option>
                                <option value="AIDS">
                                  AIDS
                                </option>
                              </select>
                            </td>

                            <td>
                              <select
                                className="input"
                                value={
                                  editingSubject.semester
                                }
                                onChange={(e) =>
                                  setEditingSubject(
                                    {
                                      ...editingSubject,
                                      semester:
                                        e.target
                                          .value,
                                    }
                                  )
                                }
                              >
                                {[
                                  'I',
                                  'II',
                                  'III',
                                  'IV',
                                  'V',
                                  'VI',
                                  'VII',
                                  'VIII',
                                ].map(
                                  (
                                    semester
                                  ) => (
                                    <option
                                      key={
                                        semester
                                      }
                                      value={
                                        semester
                                      }
                                    >
                                      {
                                        semester
                                      }
                                    </option>
                                  )
                                )}
                              </select>
                            </td>

                            <td>
                              <input
                                className="input"
                                type="number"
                                min="0.5"
                                step="0.5"
                                value={
                                  editingSubject.credits
                                }
                                onChange={(e) =>
                                  setEditingSubject(
                                    {
                                      ...editingSubject,
                                      credits:
                                        e.target
                                          .value,
                                    }
                                  )
                                }
                              />
                            </td>

                            <td>
                              {
                                subject.enrolled
                              }{' '}
                              students
                            </td>

                            <td>
                              <div
                                style={{
                                  display:
                                    'flex',
                                  gap: 8,
                                  flexWrap:
                                    'wrap',
                                }}
                              >
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={
                                    handleUpdate
                                  }
                                  disabled={
                                    saving
                                  }
                                >
                                  {saving
                                    ? 'Saving...'
                                    : 'Save'}
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-ghost"
                                  onClick={
                                    handleCancelEdit
                                  }
                                  disabled={
                                    saving
                                  }
                                >{t('cancel')}</button>
                              </div>
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <tr
                          key={
                            subject.id ||
                            subject.code
                          }
                        >
                          <td>
                            {subject.code}
                          </td>

                          <td>
                            {subject.name}
                          </td>

                          <td>
                            {subject.dept}
                          </td>

                          <td>
                            {subject.semester}
                          </td>

                          <td>
                            {subject.credits !==
                              null &&
                            subject.credits !==
                              undefined
                              ? Number(
                                  subject.credits
                                ).toFixed(1)
                              : '-'}
                          </td>

                          <td>
                            {
                              subject.enrolled
                            }{' '}
                            students
                          </td>

                          <td>
                            <button
                              type="button"
                              className="btn btn-ghost"
                              onClick={() =>
                                handleEdit(
                                  subject
                                )
                              }
                              disabled={
                                saving ||
                                editingSubject !==
                                  null
                              }
                            >{t('edit')}</button>
                          </td>
                        </tr>
                      );
                    }
                  )}

                  {filtered.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          textAlign:
                            'center',
                          color:
                            'var(--text-muted)',
                        }}
                      >
                        {search
                          ? `No subjects match "${search}"`
                          : 'No subjects available'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

