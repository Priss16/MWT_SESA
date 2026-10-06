import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const PICKER_ROWS = 10;
const PICKER_COLS = 12;

export default function AddHall() {
  const { t } = useSettings();
  const navigate = useNavigate();
  const { loadHalls } = useData();
  const { token } = useAuth();

  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [form, setForm] = useState({
    name: '',
    block: '',
    floor: 0,
    rows: 6,
    cols: 9,
    departmentId: '',
  });

  const [hoverCell, setHoverCell] = useState(null);

  const capacity = useMemo(
    () =>
      Number(form.rows || 0) * Number(form.cols || 0),
    [form.rows, form.cols]
  );

  useEffect(() => {
    async function loadDepartments() {
      if (!token) {
        setLoadingDepartments(false);
        return;
      }

      try {
        const response = await fetch(
          'http://localhost:5000/api/departments',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || 'Failed to load departments'
          );
        }

        setDepartments(
          Array.isArray(result.data)
            ? result.data
            : []
        );
      } catch (error) {
        console.error(
          'Failed to load departments:',
          error
        );

        setErrorMessage(
          'Unable to load departments.'
        );
      } finally {
        setLoadingDepartments(false);
      }
    }

    loadDepartments();
  }, [token]);

  function update(field) {
    return (e) =>
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
  }

  const handlePickCell = useCallback((row, col) => {
    setForm((prev) => ({
      ...prev,
      rows: row + 1,
      cols: col + 1,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!token) {
        setErrorMessage(
          'Your session has expired. Please log in again.'
        );
        return;
      }

      if (!form.name.trim()) {
        setErrorMessage('Hall name is required.');
        return;
      }

      if (!form.block.trim()) {
        setErrorMessage('Block is required.');
        return;
      }

      if (!form.departmentId) {
        setErrorMessage(
          'Please select a department.'
        );
        return;
      }

      setSaving(true);
      setErrorMessage('');

      try {
        const response = await fetch(
          'http://localhost:5000/api/halls',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              hall_number: form.name.trim(),
              name: form.name.trim(),
              building: form.block.trim(),
              floor: Number(form.floor),
              capacity,
              row_count: Number(form.rows),
              column_count: Number(form.cols),
              status: 'available',
              department_ids: [
                Number(form.departmentId),
              ],
            }),
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              'Failed to create hall.'
          );
        }

        await loadHalls();

        navigate('/admin/halls');
      } catch (error) {
        console.error(
          'Create hall error:',
          error
        );

        setErrorMessage(
          error.message ||
            'Failed to create hall.'
        );
      } finally {
        setSaving(false);
      }
    },
    [
      token,
      form,
      capacity,
      loadHalls,
      navigate,
    ]
  );

  const activeRow = hoverCell
    ? hoverCell.row
    : Number(form.rows) - 1;

  const activeCol = hoverCell
    ? hoverCell.col
    : Number(form.cols) - 1;

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-content">
        <Header
          title={t('addHall')}
          subtitle={`${t('halls')} / ${t('addHall')}`}
        />

        <div
          className="page-body grid-2"
          style={{ alignItems: 'start' }}
        >
          <form
            className="card"
            onSubmit={handleSubmit}
          >
            <h3 style={{ marginBottom: 18 }}>
              Hall Details
            </h3>

            <div
              className="grid-2"
              style={{ marginBottom: 16 }}
            >
              <div>
                <label className="field-label">
                  Hall Name *
                </label>

                <input
                  className="input"
                  required
                  value={form.name}
                  onChange={update('name')}
                  placeholder="e.g. F15"
                />
              </div>

              <div>
                <label className="field-label">
                  Block *
                </label>

                <input
                  className="input"
                  required
                  value={form.block}
                  onChange={update('block')}
                  placeholder="Block A"
                />
              </div>
            </div>

            <div
              className="grid-2"
              style={{ marginBottom: 16 }}
            >
              <div>
                <label className="field-label">
                  Department *
                </label>

                <select
                  className="input"
                  value={form.departmentId}
                  onChange={update(
                    'departmentId'
                  )}
                  required
                  disabled={loadingDepartments}
                >
                  <option value="">
                    {loadingDepartments
                      ? 'Loading departments...'
                      : 'Select department'}
                  </option>

                  {departments.map((dept) => (
                    <option
                      key={dept.id}
                      value={dept.id}
                    >
                      {dept.code} — {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="field-label">
                  Floor *
                </label>

                <select
                  className="input"
                  value={form.floor}
                  onChange={update('floor')}
                  required
                >
                  <option value={0}>
                    Ground Floor
                  </option>
                  <option value={1}>
                    First Floor
                  </option>
                  <option value={2}>
                    Second Floor
                  </option>
                  <option value={3}>
                    Third Floor
                  </option>
                </select>
              </div>
            </div>

            <div
              className="grid-2"
              style={{ marginBottom: 24 }}
            >
              <div>
                <label className="field-label">
                  Rows *
                </label>

                <input
                  className="input"
                  type="number"
                  min="1"
                  value={form.rows}
                  onChange={update('rows')}
                  required
                />
              </div>

              <div>
                <label className="field-label">
                  Columns *
                </label>

                <input
                  className="input"
                  type="number"
                  min="1"
                  value={form.cols}
                  onChange={update('cols')}
                  required
                />
              </div>
            </div>

            <div
              className="card"
              style={{
                background: '#F8FAFC',
                marginBottom: 24,
              }}
            >
              <p className="muted text-sm">
                Total Capacity
              </p>

              <h2 style={{ fontSize: 26 }}>
                {capacity} seats
              </h2>
            </div>

            {errorMessage && (
              <p
                className="field-error"
                style={{ marginBottom: 16 }}
              >
                {errorMessage}
              </p>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 12,
              }}
            >
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() =>
                  navigate('/admin/halls')
                }
                disabled={saving}
              >{t('cancel')}</button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  saving ||
                  loadingDepartments
                }
              >
                {saving
                  ? 'Saving...'
                  : 'Save Hall'}
              </button>
            </div>
          </form>

          <div className="card">
            <h3 style={{ marginBottom: 6 }}>
              Layout Preview
            </h3>

            <p
              className="muted text-sm"
              style={{ marginBottom: 16 }}
            >
              Hover to preview a size, click to
              select it — just like inserting a
              table in Docs.
            </p>

            <div
              onMouseLeave={() =>
                setHoverCell(null)
              }
              style={{
                display: 'inline-block',
                border:
                  '1px solid var(--border)',
                borderRadius: 8,
                padding: 8,
                background: '#fff',
              }}
            >
              {Array.from({
                length: PICKER_ROWS,
              }).map((_, r) => (
                <div
                  key={r}
                  style={{
                    display: 'flex',
                  }}
                >
                  {Array.from({
                    length: PICKER_COLS,
                  }).map((_, c) => {
                    const isActive =
                      r <= activeRow &&
                      c <= activeCol;

                    return (
                      <div
                        key={c}
                        onMouseEnter={() =>
                          setHoverCell({
                            row: r,
                            col: c,
                          })
                        }
                        onClick={() =>
                          handlePickCell(
                            r,
                            c
                          )
                        }
                        style={{
                          width: 18,
                          height: 18,
                          margin: 1.5,
                          borderRadius: 3,
                          cursor: 'pointer',
                          background: isActive
                            ? 'var(--primary)'
                            : 'var(--bg)',
                          border:
                            '1px solid ' +
                            (isActive
                              ? 'var(--primary)'
                              : 'var(--border)'),
                          transition:
                            'background 0.05s ease',
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            <p
              style={{
                marginTop: 12,
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {activeRow + 1} ×{' '}
              {activeCol + 1}{' '}
              <span
                className="muted"
                style={{ fontWeight: 400 }}
              >
                (
                {(activeRow + 1) *
                  (activeCol + 1)}{' '}
                seats)
              </span>
            </p>

            <p
              className="muted text-sm"
              style={{ marginTop: 4 }}
            >
              Need a bigger hall than{' '}
              {PICKER_ROWS} × {PICKER_COLS}?
              Type the exact numbers into the
              Rows / Columns fields on the left
              instead.
            </p>

            <div
              className="seat-grid"
              style={{ marginTop: 20 }}
            >
              {Array.from({
                length: Math.min(
                  Number(form.rows) || 0,
                  8
                ),
              }).map((_, r) => (
                <div
                  className="seat-row"
                  key={r}
                >
                  {Array.from({
                    length: Math.min(
                      Number(form.cols) || 0,
                      12
                    ),
                  }).map((_, c) => (
                    <div
                      key={c}
                      className="seat"
                      style={{
                        width: 34,
                        height: 26,
                        cursor: 'default',
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}