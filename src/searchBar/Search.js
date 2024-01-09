export function Search({ onSearch, city, setCity }) {
  const handleClick = () => {
    onSearch();
  };
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Enter a UK City.."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      ></input>
      <button onClick={handleClick}>Search</button>
    </div>
  );
}
