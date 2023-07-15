import Person from "./Person";

const Persons = ({ persons }) => (
  <div>
    {persons.map((person) => (
      <Person key={person.name} name={person.name} number={person.number} />
    ))}
  </div>
);

export default Persons;
