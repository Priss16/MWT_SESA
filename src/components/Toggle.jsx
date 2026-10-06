export default function Toggle({ on, onClick }) {
  return (
    <button className={'toggle ' + (on ? 'on' : 'off')} onClick={onClick} type="button">
      <span className="knob" />
    </button>
  );
}
