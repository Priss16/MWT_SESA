import { useState, useMemo, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { statusLabel } from '../../utils/statusLabel';
import api from '../../services/api';

export default function ManageStaff() {
  const { t } = useSettings();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const staffPerPage = 10;

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await api.get('/staff');
      if (res.data.success) {
        setStaff(res.data.data.map(s => ({
          id: s.id,
          staffId: s.staff_id,
          name: s.name,
          dept: s.department_code || '-',
          designation: s.designation || '-',
          email: s.email || '-',
          status: 'Active' // We will update this later with actual availability if provided by backend
        })));
      }
    } catch (err) {
      console.error('Error fetching staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return staff;
    return staff.filter((s) => s.name.toLowerCase().includes(term) || String(s.staffId).toLowerCase().includes(term));
  }, [staff, search]);

  const indexOfLastStaff = currentPage * staffPerPage;
  const indexOfFirstStaff = indexOfLastStaff - staffPerPage;
  const currentStaff = filtered.slice(indexOfFirstStaff, indexOfLastStaff);
  const totalPages = Math.ceil(filtered.length / staffPerPage);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Header title={t('manageStaff')} subtitle={`${t('staff')} / ${t('allStaff')}`} />
        <div className="page-body">
          <div className="page-title-row">
            <input className="input" style={{ maxWidth: 320 }} placeholder={t('searchByNameId')} value={search} onChange={(e) => {setSearch(e.target.value); setCurrentPage(1);}} />
            <Link to="/admin/staff/add" className="btn btn-primary" style={{ textDecoration: 'none' }}>+ {t('addStaff')}</Link>
          </div>
          <div className="card">
            <table>
              <thead><tr><th>{t('staffId')}</th><th>{t('name')}</th><th>{t('department')}</th><th>{t('designation')}</th><th>{t('email')}</th><th>{t('status')}</th></tr></thead>
              <tbody>
                {currentStaff.map((s) => (
                  <tr key={s.id}>
                    <td>{s.staffId}</td>
                    <td><Link to={`/admin/staff/${s.id}`} style={{ color: 'var(--secondary)', textDecoration: 'none' }}>{s.name}</Link></td>
                    <td>{s.dept}</td>
                    <td>{s.designation}</td>
                    <td>{s.email}</td>
                    <td><span className="badge badge-success">{statusLabel(t, s.status)}</span></td>
                  </tr>
                ))}
                {currentStaff.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No staff found.</td></tr>
                )}
              </tbody>
            </table>
            
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <button 
                  className="btn btn-ghost" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>
                <span className="text-sm muted">Page {currentPage} of {totalPages}</span>
                <button 
                  className="btn btn-ghost" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
