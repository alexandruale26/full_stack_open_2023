import { useState } from "react";

const Country = ({ country, showAll }) => {
  const [show, setShow] = useState(showAll);

  const handleShow = () => setShow(!show);

  const flagStyle = {
    width: 150,
    boxShadow: "0 0 10px 1px #ddd",
    borderRadius: "10px",
  };

  if (show) {
    return (
      <div>
        <div>
          <h2>
            {country.name.common}{" "}
            <button onClick={handleShow} style={{ color: "purple" }}>
              hide
            </button>
          </h2>
        </div>

        <div>capital {country.capital[0]}</div>
        <div>area {country.area}</div>

        <h3>languages:</h3>
        <ul>
          {Object.keys(country.languages).map((key) => (
            <li key={key}>{country.languages[key]}</li>
          ))}
        </ul>

        <img src={country.flags["svg"]} alt="flag" style={flagStyle} />
      </div>
    );
  }

  return (
    <div>
      {country.name.common} <button onClick={handleShow}>show</button>
    </div>
  );
};

export default Country;
