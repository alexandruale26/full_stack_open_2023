const Person = ({ person, handleRemove }) => (
  <div>
    {person.name}: {person.number} <button onClick={() => handleRemove(person)}>delete</button>
  </div>
);

export default Person;
