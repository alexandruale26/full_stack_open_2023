const PersonForm = ({ formData }) => (
  <form onSubmit={formData.addName}>
    <div>
      name: <input value={formData.newName} onChange={formData.handleNameChange} />
    </div>
    <div>
      number: <input value={formData.newNumber} onChange={formData.handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

export default PersonForm;
