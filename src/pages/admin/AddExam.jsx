import { useState, useEffect, useMemo } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { halls } from '../../data/mockData';

function parseDurationToMinutes(value) {
  const text = String(value || '')
    .trim()
    .toLowerCase();

  if (!text) {
    return null;
  }

  // Examples:
  // 180
  // 180 minutes
  // 3 hours
  // 2.5 hours
  const numericMatch = text.match(/\d+(\.\d+)?/);

  if (!numericMatch) {
    return null;
  }

  const numberValue = Number(numericMatch[0]);

  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    return null;
  }

  if (text.includes('hour')) {
    return Math.round(numberValue * 60);
  }

  return Math.round(numberValue);
}

function calculateEndTime(startTime, durationMinutes) {
  if (!startTime || !durationMinutes) {
    return null;
  }

  const parts = startTime.split(':');

  if (parts.length < 2) {
    return null;
  }

  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes)
  ) {
    return null;
  }

  const totalMinutes =
    hours * 60 +
    minutes +
    durationMinutes;

  const endHours =
    Math.floor(totalMinutes / 60) % 24;

  const endMinutes =
    totalMinutes % 60;

  return (
    String(endHours).padStart(2, '0') +
    ':' +
    String(endMinutes).padStart(2, '0')
  );
}

export default function AddExam() {
  const { t } = useSettings();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] =
    useState(true);

  const [form, setForm] = useState({
    subject: '',
    date: '',
    time: '',
    duration: '3 hours',
    hall: '',
    autoGenerate: true,
  });

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState('');

  // --------------------------------------------------
  // LOAD REAL SUBJECTS
  // --------------------------------------------------

  useEffect(() => {
    async function loadSubjects() {
      const token =
        window.localStorage.getItem(
          'sesa_token'
        );

      if (!token) {
        setLoadingSubjects(false);
        setErrorMessage(
          'Your session has expired. Please log in again.'
        );
        return;
      }

      try {
        setLoadingSubjects(true);
        setErrorMessage('');

        const response = await fetch(
          'http://localhost:5000/api/subjects',
          {
            method: 'GET',
            headers: {
              Authorization:
                'Bearer ' + token,
            },
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
            'Failed to load subjects'
          );
        }

        const normalizedSubjects =
          Array.isArray(result.data)
            ? result.data.map(
              (subject) => ({
                id: subject.id,
                code: subject.code,
                name: subject.name,
                department_code:
                  subject.department_code,
              })
            )
            : [];

        setSubjects(
          normalizedSubjects
        );
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
        setLoadingSubjects(false);
      }
    }

    loadSubjects();
  }, []);

  // --------------------------------------------------
  // SUBJECT OPTIONS
  // --------------------------------------------------

  const sortedSubjects = useMemo(() => {
    return [...subjects].sort((a, b) => {
      return String(a.name).localeCompare(
        String(b.name)
      );
    });
  }, [subjects]);

  function update(field) {
    return (e) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };
  }

  // --------------------------------------------------
  // SAVE EXAM
  // --------------------------------------------------

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.subject ||
      !form.date ||
      !form.time
    ) {
      setErrorMessage(
        'Subject, exam date, and start time are required.'
      );
      return;
    }

    const selectedSubject =
      subjects.find(
        (subject) =>
          String(subject.code) ===
          String(form.subject)
      );

    if (!selectedSubject) {
      setErrorMessage(
        'Please select a valid subject.'
      );
      return;
    }

    const durationMinutes =
      parseDurationToMinutes(
        form.duration
      );

    if (
      !durationMinutes ||
      durationMinutes <= 0
    ) {
      setErrorMessage(
        'Please enter a valid duration, for example 3 hours or 180 minutes.'
      );
      return;
    }

    const endTime =
      calculateEndTime(
        form.time,
        durationMinutes
      );

    if (!endTime) {
      setErrorMessage(
        'Unable to calculate the exam end time.'
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
        'http://localhost:5000/api/exams',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              'Bearer ' + token,
          },
          body: JSON.stringify({
            subject_id:
              selectedSubject.id,

            exam_date: form.date,

            start_time:
              form.time + ':00',

            end_time:
              endTime + ':00',

            duration_minutes:
              durationMinutes,

            status: 'scheduled',
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
          'Failed to create exam'
        );
      }

      // Exam was successfully created in MySQL.
      navigate('/admin/exams');
    } catch (error) {
      console.error(
        'Create exam error:',
        error
      );

      setErrorMessage(
        error.message ||
        'Failed to create exam'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-content">
        <Header
          title={t('addExam')}
          subtitle={`${t('exams')} / ${t('addExam')}`}
        />

        <div className="page-body">
          <form
            className="card"
            style={{ maxWidth: 900 }}
            onSubmit={handleSubmit}
          >
            <h3
              style={{
                marginBottom: 18,
              }}
            >{t('examDetails')}</h3>

            <div
              className="grid-3"
              style={{
                marginBottom: 18,
              }}
            >
              <div>
                <label className="field-label">
                  Subject *
                </label>

                <select
                  className="input"
                  required
                  value={form.subject}
                  onChange={update(
                    'subject'
                  )}
                  disabled={
                    loadingSubjects ||
                    saving
                  }
                >
                  <option value="">
                    {loadingSubjects
                      ? 'Loading subjects...'
                      : 'Select subject'}
                  </option>

                  {sortedSubjects.map(
                    (subject) => (
                      <option
                        key={
                          subject.id
                        }
                        value={
                          subject.code
                        }
                      >
                        {subject.name} (
                        {subject.code})
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="field-label">
                  Exam Date *
                </label>

                <input
                  className="input"
                  type="date"
                  required
                  value={form.date}
                  onChange={update(
                    'date'
                  )}
                  disabled={saving}
                />
              </div>

              <div>
                <label className="field-label">
                  Start Time *
                </label>

                <input
                  className="input"
                  type="time"
                  required
                  value={form.time}
                  onChange={update(
                    'time'
                  )}
                  disabled={saving}
                />
              </div>
            </div>

            <div
              className="grid-3"
              style={{
                marginBottom: 24,
              }}
            >
              <div>
                <label className="field-label">{t('duration')}</label>

                <input
                  className="input"
                  value={form.duration}
                  onChange={update(
                    'duration'
                  )}
                  placeholder="e.g. 3 hours"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="field-label">{t('preferredHall')}</label>

                <select
                  className="input"
                  value={form.hall}
                  onChange={update(
                    'hall'
                  )}
                  disabled={saving}
                >
                  <option value="">{t('selectHall')}</option>

                  {halls.map(
                    (hall) => (
                      <option
                        key={hall.name}
                        value={
                          hall.name
                        }
                      >
                        {hall.name} (
                        {hall.capacity}{' '}
                        seats)
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 24,
                fontSize: 13,
              }}
            >
              <input
                type="checkbox"
                checked={
                  form.autoGenerate
                }
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    autoGenerate:
                      e.target.checked,
                  }))
                }
                disabled={saving}
              />

              Auto-generate seating
              immediately after saving
            </label>

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
                display: 'flex',
                justifyContent:
                  'flex-end',
                gap: 12,
              }}
            >
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() =>
                  navigate(
                    '/admin/exams'
                  )
                }
                disabled={saving}
              >{t('cancel')}</button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  saving ||
                  loadingSubjects
                }
              >
                {saving
                  ? 'Saving...'
                  : 'Save Exam'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}