import { useState, useEffect } from "react";
import countryService from "./services/country";
import SearchResults from "./components/SearchResults";

function App() {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);

  const handleSearch = (ev) => setSearch(ev.target.value);

  const filteredCountries = (() => {
    const filtered = countries.filter((c) => c.name.common.toLowerCase().includes(search.toLowerCase()));
    return filtered.sort((a, b) => (a.name.common.toLowerCase() > b.name.common.toLowerCase() ? 1 : -1));
  })();

  useEffect(() => {
    countryService.getAll().then((results) => setCountries(results));
  }, []);

  return (
    <div>
      <h1>Countries</h1>

      <div>
        find countries <input value={search} onChange={handleSearch} />
        <SearchResults countries={filteredCountries} search={search} />
      </div>
    </div>
  );
}

export default App;
