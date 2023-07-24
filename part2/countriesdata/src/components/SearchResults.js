import Country from "./Country";
import Weather from "./Weather";

const SearchResults = ({ countries, search }) => {
  if (!search) return <div>Type to search</div>;
  if (countries.length > 10) return <div>Too many matches, specify another filter</div>;
  if (countries.length === 0) return <div>No match</div>;
  if (countries.length === 1)
    return (
      <div>
        <Country country={countries[0]} showAll={true} />
        <Weather country={countries[0]} />
      </div>
    );

  return (
    <div>
      {countries.map((c) => (
        <Country key={c.name.common} country={c} showAll={false} />
      ))}
    </div>
  );
};

export default SearchResults;
