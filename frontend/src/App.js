import { useState, useEffect } from "react";
import noteUtils from "./noteUtils";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterName, setFilterName] = useState("");
  const [notification, setNotification] = useState("");

  useEffect(() => {
    noteUtils.getAll().then((data) => setPersons(data));
  }, []);

  const addPerson = (e) => {
    e.preventDefault();
    const existingPerson = persons.find((i) => i.name === newName);
    if (existingPerson) {
      if (
        window.confirm(
          `Name ${newName} exists already, do you want to replace the old number?`
        )
      ) {
        const newPerson = { ...existingPerson, number: newNumber };
        noteUtils
          .replaceById(newPerson)
          .then((res) =>
            setPersons(persons.map((p) => (p.id === res.id ? res : p)))
          );
        setNewName("");
        setNewNumber("");
        showNotification("Number updated!");
      }
    } else {
      const newPerson = { name: newName, number: newNumber };
      noteUtils
        .add(newPerson)
        .then((res) => {
          setPersons([...persons, res]);
          setNewName("");
          setNewNumber("");
          showNotification("Person added!");
        })
        .catch((e) => {
          showNotification(e.response?.data?.error || "Error adding a name");
        });
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 5000);
  };

  const deletePerson = (id) => {
    const thisPerson = persons.find((p) => p.id === id);
    if (window.confirm(`Are you sure you want to delete ${thisPerson.name}?`)) {
      noteUtils
        .deleteById(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
          showNotification("Person deleted!");
        })
        .catch(() => {
          showNotification("Error! Person not found");
        });
    }
  };

  const onTypeName = (e) => setNewName(e.target.value);
  const onTypeNumber = (e) => setNewNumber(e.target.value);
  const onTypeFilter = (e) => setFilterName(e.target.value);

  const isError = notification.toLowerCase().includes("error");

  return (
    <div>
      <h2>Phonebook</h2>

      {notification && (
        <div style={{ ...notificationStyle, ...(isError && errorStyle) }}>
          {notification}
        </div>
      )}

      <Filter filterName={filterName} onTypeFilter={onTypeFilter} />

      <h2>Add a new entry</h2>
      <PersonForm
        newName={newName}
        onTypeName={onTypeName}
        newNumber={newNumber}
        onTypeNumber={onTypeNumber}
        addPerson={addPerson}
      />

      <h2>Numbers</h2>
      <Persons
        persons={persons}
        filterName={filterName}
        deletePerson={deletePerson}
      />
    </div>
  );
};

export default App;

const notificationStyle = {
  padding: ".5rem",
  borderWidth: "2px",
  borderRadius: "3px",
  borderColor: "green",
  color: "green",
  borderStyle: "solid",
  display: "inline-block",
  marginBottom: "1rem",
  position: "absolute",
  right: "1rem",
  maxWidth: "50%",
};
const errorStyle = {
  borderColor: "red",
  color: "red",
};

const Filter = ({ filterName, onTypeFilter }) => (
  <div>
    Filter with name: <input value={filterName} onChange={onTypeFilter} />
  </div>
);

const PersonForm = ({
  newName,
  onTypeName,
  newNumber,
  onTypeNumber,
  addPerson,
}) => (
  <form>
    <div>
      name: <input value={newName} onChange={onTypeName} />
    </div>
    <div>
      number: <input value={newNumber} onChange={onTypeNumber} />
    </div>
    <div>
      <button type="submit" onClick={addPerson}>
        add
      </button>
    </div>
  </form>
);

const Persons = ({ persons, filterName, deletePerson }) => (
  <div>
    {persons
      .filter((i) => i.name.toLowerCase().includes(filterName.toLowerCase()))
      .map((p) => (
        <div key={p.name}>
          {p.name} {p.number}{" "}
          <button type="button" onClick={() => deletePerson(p.id)}>
            Delete
          </button>
        </div>
      ))}
  </div>
);
