import { memo } from 'react';

// React.memo skips re-rendering this component if its props are
// referentially the same as last render. This ONLY works well if the
// `onSelect` function prop is stable across renders - which is exactly
// what useCallback (in SeatingPreview.jsx) gives us. Without useCallback,
// a brand-new onSelect function would be created every render and memo
// would be pointless, since props would "change" every time anyway.
const SeatCell = memo(function SeatCell({ seatId, regNo, isSelected, onSelect }) {
  return (
    <button
      className={'seat' + (regNo ? ' occupied' : '') + (isSelected ? ' selected' : '')}
      onClick={() => onSelect(seatId)}
      type="button"
    >
      <span className="seat-label">{seatId}</span>
      {regNo && <span className="seat-reg">{regNo}</span>}
    </button>
  );
});

export default SeatCell;
