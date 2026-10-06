import { useState, useEffect, useCallback } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { halls } from '../../data/mockData';

function calculateEndTime(startTime, durationMinutes) {
  if (!startTime || !durationMinutes) {
    return '';
  }

  const parts = String(startTime).split(':');

  if (parts.length < 2) {
    return '';
  }

  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes)
  ) {
    return '';
  }

  const totalMinutes =
    hours * 60 +
    minutes +
    Number(durationMinutes);

  const endHours =
    Math.floor(totalMinutes / 60) % 24;

  const endMinutes =
    totalMinutes % 60;

  return (
    String(endHours).padStart(2, '0') +
    ':' +
    String(endMinutes).padStart(2, '0') +
    ':00'
  );
}

export default function EditExam() {
  const { t } = useSettings();
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    subject: '',
    subjectId: null,
    date: '',
    time: '',
    durationMinutes: 180,
    endTime: '',
    status: 'scheduled',
    hall: '',
    regenerateSeating: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState('');

  // --------------------------------------------------
  // LOAD EXAM
  // --------------------------------------------------

  const loadExam = useCallback(async () => {
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
          'Failed to load exams'
        );
      }

      const exam = Array.isArray(
        result.data
      )
        ? result.data.find(
          (item) =>
            String(item.id) ===
            String(id)
        )
        : null;

      if (!exam) {
        throw new Error(
          'Exam not found'
        );
      }

      const examDate = exam.exam_date
        ? String(
          exam.exam_date
        ).substring(0, 10)
        : '';

      const startTime = exam.start_time
        ? String(
          exam.start_time
        ).substring(0, 5)
        : '';

      const durationMinutes =
        Number(
          exam.duration_minutes
        ) || 180;

      const endTime =
        exam.end_time
          ? String(
            exam.end_time
          ).substring(0, 8)
          : calculateEndTime(
            startTime,
            durationMinutes
          );

      setForm({
        subject:
          (exam.subject_name || '') +
          (exam.subject_code
            ? ' (' +
            exam.subject_code +
            ')'
            : ''),

        subjectId:
          exam.subject_id,

        date: examDate,

        time: startTime,

        durationMinutes,

        endTime,

        status:
          exam.status || 'scheduled',

        hall: '',

        regenerateSeating: false,
      });
    } catch (error) {
      console.error(
        'Load exam error:',
        error
      );

      setErrorMessage(
        error.message ||
        'Failed to load exam'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadExam();
  }, [loadExam]);

  // --------------------------------------------------
  // SAVE CHANGES
  // --------------------------------------------------

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.subjectId) {
      setErrorMessage(
        'The selected subject is missing.'
      );
      return;
    }

    if (
      !form.date ||
      !form.time
    ) {
      setErrorMessage(
        'Exam date and start time are required.'
      );
      return;
    }

    const durationMinutes =
      Number(form.durationMinutes);

    if (
      !Number.isInteger(
        durationMinutes
      ) ||
      durationMinutes <= 0
    ) {
      setErrorMessage(
        'Invalid exam duration.'
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
        'Unable to calculate exam end time.'
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
        'http://localhost:5000/api/exams/' +
        id,
        {
          method: 'PUT',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              'Bearer ' + token,
          },

          body: JSON.stringify({
            subject_id:
              form.subjectId,

            exam_date:
              form.date,

            start_time:
              form.time + ':00',

            end_time: endTime,

            duration_minutes:
              durationMinutes,

            status:
              form.status ||
              'scheduled',
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
          'Failed to update exam'
        );
      }

      navigate('/admin/exams');
    } catch (error) {
      console.error(
        'Update exam error:',
        error
      );

      setErrorMessage(
        error.message ||
        'Failed to update exam'
      );
    } finally {
      setSaving(false);
    }
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-content">
        <Header
          title={t('editExam')}
          subtitle={`${t('exams')} / ${form.subject || 'Exam'} / ${t('edit')}`}
        />

        <div className="page-body">
          {loading ? (
            <div
              className="card"
              style={{ maxWidth: 900 }}
            >
              <p
                className="muted text-sm"
                style={{ padding: 20 }}
              >
                Loading exam...
              </p>
            </div>
          ) : (
            <form
              className="card"
              style={{ maxWidth: 900 }}
              onSubmit={handleSubmit}
            >
              <div
                className="grid-3"
                style={{
                  marginBottom: 18,
                }}
              >
                <div>
                  <label className="field-label">{t('subject')}</label>

                  <input
                    className="input"
                    value={
                      form.subject
                    }
                    disabled
                  />
                </div>

                <div>
                  <label className="field-label">{t('examDate')}</label>

                  <input
                    className="input"
                    type="date"
                    value={
                      form.date
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        date:
                          e.target.value,
                      })
                    }
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="field-label">{t('startTime')}</label>

                  <input
                    className="input"
                    type="time"
                    value={
                      form.time
                    }
                    onChange={(e) => {
                      const nextTime =
                        e.target.value;

                      setForm({
                        ...form,
                        time:
                          nextTime,
                        endTime:
                          calculateEndTime(
                            nextTime,
                            form.durationMinutes
                          ),
                      });
                    }}
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
                  <label className="field-label">{t('hall')}</label>

                  <select
                    className="input"
                    value={
                      form.hall
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hall:
                          e.target.value,
                      })
                    }
                    disabled={saving}
                  >
                    <option value="">{t('selectHall')}</option>

                    {halls.map(
                      (hall) => (
                        <option
                          key={
                            hall.name
                          }
                          value={
                            hall.name
                          }
                        >
                          {hall.name}
                        </option>
                      )
                    )}
                  </select>
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
                    form.regenerateSeating
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      regenerateSeating:
                        e.target
                          .checked,
                    })
                  }
                  disabled={saving}
                />

                Regenerate seating
                after saving changes
              </label>

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
                    saving
                  }
                >
                  {saving
                    ? 'Saving...'
                    : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}