import { useState, useMemo, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { statusLabel } from '../../utils/statusLabel';

export default function HallManagement() {
  const { t } = useSettings();
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHalls = async () => {
      const token = window.localStorage.getItem('sesa_token');
      if (!token) return;
      try {
        const res = await fetch('http://localhost:5000/api/halls', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();
        if (res.ok && result.success) {
          // Map backend department_codes to depts array for the filter logic
          const formatted = result.data.map(h => ({
            ...h,
            depts: h.department_codes ? h.department_codes.split(', ') : [],
            hallNumber: h.hall_number,
            block: h.building,
            rowCount: h.row_count,
            columnCount: h.column_count
          }));
          setHalls(formatted);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHalls();
  }, []);

  const [deptFilter, setDeptFilter] = useState('All');

  const deptCodes = useMemo(() => {
    const codes = new Set();
    halls.forEach((h) => {
      if (Array.isArray(h.depts)) {
        h.depts.forEach((d) => codes.add(d));
      }
    });
    return ['All', ...Array.from(codes).sort()];
  }, [halls]);

  // --------------------------------------------------
  // FILTER REAL HALLS
  // --------------------------------------------------

  const filtered = useMemo(() => {
    if (deptFilter === 'All') {
      return halls;
    }

    return halls.filter(
      (hall) =>
        Array.isArray(hall.depts) &&
        hall.depts.includes(deptFilter)
    );
  }, [halls, deptFilter]);

  // --------------------------------------------------
  // GROUP HALLS
  // --------------------------------------------------

  const grouped = useMemo(() => {
    if (filtered.length === 0) {
      return [];
    }

    const map = new Map();

    filtered.forEach((hall) => {
      const keys =
        deptFilter === 'All'
          ? (
            Array.isArray(hall.depts) &&
              hall.depts.length > 0
              ? hall.depts
              : ['Unassigned']
          )
          : [deptFilter];

      keys.forEach((code) => {
        if (!map.has(code)) {
          map.set(code, []);
        }

        map.get(code).push(hall);
      });
    });

    return Array.from(map.entries());
  }, [filtered, deptFilter]);

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-content">
        <Header
          title={t('hallManagement')}
          subtitle={`${t('halls')} / ${t('allHalls')}`}
        />

        <div className="page-body">
          {/* ---------------------------------------- */}
          {/* FILTER BUTTONS + ADD HALL */}
          {/* ---------------------------------------- */}

          <div
            className="page-title-row"
            style={{
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              {deptCodes.map((code) => (
                <button
                  key={code}
                  type="button"
                  className={
                    'btn ' +
                    (deptFilter === code
                      ? 'btn-primary'
                      : 'btn-ghost')
                  }
                  style={{
                    borderRadius: 999,
                    padding: '8px 18px',
                  }}
                  onClick={() =>
                    setDeptFilter(code)
                  }
                >
                  {code === 'All'
                    ? t('allDepartments')
                    : code}
                </button>
              ))}
            </div>

            <Link
              to="/admin/halls/add"
              className="btn btn-primary"
              style={{
                textDecoration: 'none',
              }}
            >
              + {t('addHall')}
            </Link>
          </div>

          {/* ---------------------------------------- */}
          {/* HALL GROUPS */}
          {/* ---------------------------------------- */}

          {grouped.map(
            ([code, deptHalls]) => (
              <div
                key={code}
                style={{
                  marginBottom: 28,
                }}
              >
                <h3
                  style={{
                    fontSize: 15,
                    margin:
                      '18px 0 10px',
                  }}
                >
                  {code === 'Unassigned'
                    ? t('unassigned')
                    : code}

                  <span
                    className="muted text-sm"
                    style={{
                      fontWeight: 400,
                      marginLeft: 8,
                    }}
                  >
                    {deptHalls.length}{' '}
                    {deptHalls.length !== 1
                      ? t(
                        'hallCountPlural'
                      )
                      : t('hallCount')}
                  </span>
                </h3>

                <div className="feature-grid">
                  {deptHalls.map((hall) => (
                    <div
                      className="card"
                      key={
                        String(hall.id) +
                        '-' +
                        code
                      }
                    >
                      {/* Hall name */}
                      <h3
                        style={{
                          fontSize: 16,
                          marginBottom: 4,
                        }}
                      >
                        {hall.name ||
                          hall.hallNumber}
                      </h3>

                      {/* Building + floor */}
                      <p
                        className="muted text-sm"
                        style={{
                          marginBottom: 10,
                        }}
                      >
                        {hall.block ||
                          hall.building ||
                          '—'}{' '}
                        ·{' '}
                        {hall.floor ||
                          'Unknown Floor'}
                      </p>

                      {/* Status */}
                      <span
                        className={
                          'badge ' +
                          (hall.status ===
                            'Free'
                            ? 'badge-success'
                            : 'badge-warning')
                        }
                      >
                        {statusLabel(
                          t,
                          hall.status
                        )}
                      </span>

                      {/* Shared departments */}
                      {Array.isArray(
                        hall.depts
                      ) &&
                        hall.depts.length >
                        1 && (
                          <span
                            className="badge badge-muted"
                            style={{
                              marginLeft: 8,
                            }}
                          >
                            {t('shared')}:{' '}
                            {hall.depts.join(
                              ', '
                            )}
                          </span>
                        )}

                      {/* Capacity + rows/columns */}
                      <div
                        style={{
                          display:
                            'flex',
                          justifyContent:
                            'space-between',
                          marginTop: 16,
                        }}
                      >
                        <div>
                          <p className="muted text-sm">
                            {t(
                              'capacity'
                            ).toUpperCase()}
                          </p>

                          <strong>
                            {Number(
                              hall.capacity ||
                              0
                            )}{' '}
                            {t('seats')}
                          </strong>
                        </div>

                        <div>
                          <p className="muted text-sm">
                            {t(
                              'rowsCols'
                            )}
                          </p>

                          <strong>
                            {Number(
                              hall.rows ||
                              hall.rowCount ||
                              0
                            )}{' '}
                            ×{' '}
                            {Number(
                              hall.cols ||
                              hall.columnCount ||
                              0
                            )}
                          </strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* ---------------------------------------- */}
          {/* EMPTY STATE */}
          {/* ---------------------------------------- */}

          {filtered.length === 0 && (
            <p
              className="muted text-sm"
              style={{
                marginTop: 20,
              }}
            >
              {t('noHallsInDept')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}