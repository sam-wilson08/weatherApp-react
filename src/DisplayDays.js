import "./index.css"; // Import the CSS file

export function DisplayDays({ onClick, day, isActive }) {
  return (
    <div className={`box-day ${isActive ? "active" : ""}`} onClick={onClick}>
      <h1>{day} </h1>
    </div>
  );
}
