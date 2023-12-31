import Person from "./Person";

const Persons = ({ persons, handleRemove }) => (
  <div>
    {persons.map((person) => (
      <Person key={person.name} person={person} handleRemove={handleRemove} />
    ))}
  </div>
);

export default Persons;
