import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const statusBadge = {
  Published: 'badge-success',
  Draft: 'badge-warning',
  'Not started': 'badge-muted',
  Completed: 'badge-success',
  Cancelled: 'badge-muted',
};

const STATUS_LABELS = {
  draft: 'Draft',
  scheduled: 'Not started',
  published: 'Published',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

function formatDate(value) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(value) {
  if (!value) return '—';

  const parts = String(value).split(':');

  if (parts.length < 2) {
    return String(value);
  }

  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);

  if (
    !Number.isFinite(hours) ||
    !Number.isFinite(minutes)
  ) {
    return String(value);
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;

  return (
    String(displayHour).padStart(2, '0') +
    ':' +
    String(minutes).padStart(2, '0') +
    ' ' +
    period
  );
}

export default function Exams() {
  const { t } = useSettings();
  const { addAuditLog } = useData();
  const { user } = useAuth();

  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterSem, setFilterSem] = useState('');
  const [filterYear, setFilterYear] = useState('');

  const [loading, setLoading] = useState(true);
  const [publishingId, setPublishingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // --------------------------------------------------
  // LOAD EXAMS FROM BACKEND
  // --------------------------------------------------

  const loadExams = useCallback(async () => {
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
        'http://localhost:5000/api/exams',
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
          'Failed to load exams'
        );
      }

      const normalizedExams =
        Array.isArray(result.data)
          ? result.data.map((exam) => ({
            id: exam.id,

            subjectId:
              exam.subject_id,

            subject:
              exam.subject_name ||
              'Unknown Subject',

            code:
              exam.subject_code ||
              '',

            date: formatDate(
              exam.exam_date
            ),
            
            rawYear: exam.exam_date ? new Date(exam.exam_date).getFullYear() : '',
            semester: exam.semester || '',
            department: exam.department_code || 'Unknown',

            time: formatTime(
              exam.start_time
            ),

            // Real values from backend
            halls: Number(
              exam.hall_count || 0
            ),

            students: Number(
              exam.student_count || 0
            ),

            status:
              STATUS_LABELS[
              exam.status
              ] ||
              String(
                exam.status || ''
              ),
          }))
          : [];

      setExams(normalizedExams);
    } catch (error) {
      console.error(
        'Failed to load exams:',
        error
      );

      setErrorMessage(
        error.message ||
        'Failed to load exams'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExams();
  }, [loadExams]);

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filtered = useMemo(() => {
    let result = exams;
    
    if (filterDept) {
      result = result.filter(e => e.department === filterDept);
    }
    if (filterSem) {
      result = result.filter(e => String(e.semester) === String(filterSem));
    }
    if (filterYear) {
      result = result.filter(e => String(e.rawYear) === String(filterYear));
    }

    const term = search.trim().toLowerCase();
    if (term) {
      result = result.filter(
        (exam) =>
          exam.subject.toLowerCase().includes(term) ||
          exam.code.toLowerCase().includes(term)
      );
    }
    
    return result;
  }, [exams, search, filterDept, filterSem, filterYear]);

  // Extract unique values for filters
  const uniqueDepts = useMemo(() => [...new Set(exams.map(e => e.department).filter(Boolean))], [exams]);
  const uniqueSems = useMemo(() => [...new Set(exams.map(e => e.semester).filter(Boolean))].sort(), [exams]);
  const uniqueYears = useMemo(() => [...new Set(exams.map(e => e.rawYear).filter(Boolean))].sort(), [exams]);

  // --------------------------------------------------
  // PUBLISH EXAM
  // --------------------------------------------------

  const handlePublish = useCallback(
    async (exam) => {
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
        setPublishingId(exam.id);
        setErrorMessage('');

        const response = await fetch(
          'http://localhost:5000/api/exams/' +
          exam.id +
          '/status',
          {
            method: 'PATCH',
            headers: {
              'Content-Type':
                'application/json',
              Authorization:
                'Bearer ' + token,
            },

            body: JSON.stringify({
              status: 'published',
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
            'Failed to publish exam'
          );
        }

        await loadExams();

        // Keep the existing audit-log behavior.
        addAuditLog({
          user:
            (user?.name ||
              'Admin') +
            ' (Admin)',

          action: 'Seating',

          details:
            'Published hall plan for ' +
            exam.code,
        });
      } catch (error) {
        console.error(
          'Publish exam error:',
          error
        );

        setErrorMessage(
          error.message ||
          'Failed to publish exam'
        );
      } finally {
        setPublishingId(null);
      }
    },
    [loadExams, addAuditLog, user]
  );

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-content">
        <Header
          title={t('exams')}
          subtitle={`${t('exams')} / ${t('allExams')}`}
        />

        <div className="page-body">
          {/* SEARCH + ADD EXAM */}
          <div className="page-title-row" style={{ flexWrap: 'wrap', gap: '10px' }}>
            <input
              className="input"
              style={{ maxWidth: 200 }}
              placeholder={t('searchBySubjectCode')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select className="input" style={{ maxWidth: 150 }} value={filterDept} onChange={e => setFilterDept(e.target.value)}>
              <option value="">All Depts</option>
              {uniqueDepts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select className="input" style={{ maxWidth: 150 }} value={filterSem} onChange={e => setFilterSem(e.target.value)}>
              <option value="">All Semesters</option>
              {uniqueSems.map(s => <option key={s} value={s}>Sem {s}</option>)}
            </select>
            <select className="input" style={{ maxWidth: 150 }} value={filterYear} onChange={e => setFilterYear(e.target.value)}>
              <option value="">All Years</option>
              {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            <Link
              to="/admin/exams/add"
              className="btn btn-primary"
              style={{
                textDecoration: 'none',
                marginLeft: 'auto'
              }}
            >
              + {t('addExam')}
            </Link>
          </div>

          {/* ERROR */}
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

          {/* EXAM TABLE */}
          <div className="card">
            {loading ? (
              <p
                className="muted text-sm"
                style={{
                  padding: 20,
                }}
              >
                Loading exams...
              </p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>{t('subject')}</th>
                    <th>{t('department')}</th>
                    <th>Sem</th>
                    <th>Year</th>
                    <th>{t('dateTime')}</th>
                    <th>{t('halls')}</th>
                    <th>{t('students')}</th>
                    <th>{t('status')}</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((exam) => (
                    <tr key={exam.id}>
                      <td>
                        {exam.subject}{' '}
                        ({exam.code})
                      </td>
                      <td>{exam.department}</td>
                      <td>{exam.semester}</td>
                      <td>{exam.rawYear}</td>
                      <td>
                        {exam.date},{' '}
                        {exam.time}
                      </td>

                      {/* HALL COUNT */}
                      <td>
                        {exam.halls}{' '}
                        {exam.halls === 1
                          ? 'hall'
                          : 'halls'}
                      </td>

                      {/* STUDENT COUNT */}
                      <td>
                        {exam.students}{' '}
                        {exam.students === 1
                          ? 'student'
                          : 'students'}
                      </td>

                      {/* STATUS */}
                      <td>
                        <span
                          className={
                            'badge ' +
                            (
                              statusBadge[
                              exam.status
                              ] ||
                              'badge-muted'
                            )
                          }
                        >
                          {exam.status}
                        </span>
                      </td>

                      {/* PUBLISH */}
                      <td>
                        {exam.status !==
                          'Published' &&
                          exam.status !==
                          'Completed' &&
                          exam.status !==
                          'Cancelled' && (
                            <button
                              type="button"
                              className="btn btn-ghost"
                              style={{
                                fontSize: 12,
                                padding:
                                  '5px 12px',
                              }}
                              onClick={() =>
                                handlePublish(
                                  exam
                                )
                              }
                              disabled={
                                publishingId ===
                                exam.id
                              }
                            >
                              {publishingId ===
                                exam.id
                                ? 'Publishing...'
                                : t(
                                  'publish'
                                )}
                            </button>
                          )}
                      </td>

                      {/* EDIT */}
                      <td>
                        <Link
                          to={
                            '/admin/exams/' +
                            exam.id +
                            '/edit'
                          }
                          style={{
                            color:
                              'var(--secondary)',
                            fontSize: 13,
                            textDecoration:
                              'none',
                          }}
                        >
                          {t('edit')}
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                      <tr>
                        <td
                          colSpan={10}
                          style={{
                            textAlign: 'center',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {search
                            ? 'No exams match "' +
                            search +
                            '"'
                            : 'No exams available'}
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