export default function StatusBadge({ status }) {
  const map = {
    available:         { label: 'Available',          bg: '#d4edda', color: '#2d6a4f' },
    occupied:          { label: 'Occupied',            bg: '#fde8cc', color: '#7a3b00' },
    'under maintenance':{ label: 'Maintenance',        bg: '#e8e8e8', color: '#444'    },
    pending:           { label: 'Pending',             bg: '#fff3cd', color: '#7a5500' },
    approved:          { label: 'Approved',            bg: '#d4edda', color: '#2d6a4f' },
    rejected:          { label: 'Rejected',            bg: '#f8d7da', color: '#842029' },
  };
  const s = map[status] || { label: status, bg: '#eee', color: '#333' };
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 12px',
      borderRadius: '9999px',
      fontSize: '0.72rem',
      fontWeight: 600,
      letterSpacing: '0.04em',
      background: s.bg,
      color: s.color,
    }}>{s.label}</span>
  );
}
