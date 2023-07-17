import { useState, useEffect } from "react";
import contactService from "./services/contacts";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  const handleNameChange = (e) => setNewName(e.target.value);
  const handleNumberChange = (e) => setNewNumber(e.target.value);
  const handleFilterChange = (e) => setFilter(e.target.value);

  const hook = () => {
    contactService.getAll().then((initialContacts) => setPersons(initialContacts));
  };

  const resetAndRepopulate = (newPersonsState) => {
    setPersons(newPersonsState);
    setNewName("");
    setNewNumber("");
  };

  useEffect(hook, []);

  const addPerson = (e) => {
    e.preventDefault();

    const personToUpdate = persons.find((person) => person.name === newName);

    if (personToUpdate) {
      if (
        !window.confirm(`${personToUpdate.name} is already added to phonebook, replace the old number with a new one?`)
      )
        return;

      const updatedContact = { ...personToUpdate, number: newNumber };

      contactService.updateNumber(personToUpdate.id, updatedContact).then((receivedUpdated) => {
        const modifiedPersons = persons.map((contact) =>
          contact.id !== receivedUpdated.id ? contact : receivedUpdated
        );

        resetAndRepopulate(modifiedPersons);
      });
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber,
    };

    contactService.create(personObject).then((returnedContact) => {
      resetAndRepopulate(persons.concat(returnedContact));
    });
  };

  const handleRemove = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      contactService.remove(person.id).then((_) => {
        const modifiedPersons = persons.filter((contact) => contact.id !== person.id);
        setPersons(modifiedPersons);
      });
    }
  };

  const filteredPersons = persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>add a new</h3>

      <PersonForm formData={{ addName: addPerson, newName, handleNameChange, newNumber, handleNumberChange }} />

      <h3>Numbers</h3>

      <Persons persons={filteredPersons} handleRemove={handleRemove} />
    </div>
  );
}

export default App;
