import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [people, setPeople] = useState([]);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [p_id, setP_id] = useState(-1)
  // const [highlighted, setHighlight] = useState(null)

  useEffect(() => {
    axios.get('http://localhost:5000/api/nodes')
      .then(response => setPeople(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const fetchPeople = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/nodes');
      setPeople(response.data);
    } catch (error) {
      console.error('Error fetching people:', error);
    }
  };
  
  const handleAddPerson = async () => {
    if (!name.trim()) {
      setStatus('Name cannot be empty.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/add-person', {
        name: name.trim()
      });
      setStatus(`✅ Person "${response.data.person.name}" added successfully!`);
      setName('');
      fetchPeople(); // Refresh list
    } catch (error) {
      console.error('Error adding person:', error);
      setStatus('❌ Failed to add person.');
    }
  }

  const handleDeletePerson = async () => {
    if (p_id<0) {
      setStatus('Invalid ID Number.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/del-person', {
        person_id: p_id
      });
      setStatus(`✅ Person "${response.data.person.name}", id: ${response.data.person.id} deleted successfully!`);
      setP_id(-1);
      fetchPeople(); // Refresh list
    } catch (error) {
      console.error('Error deleting person:', error);
      setStatus('❌ Failed to delete person.');
    }
  }


  return (
    <div>
      <h1>Neo4j Nodes</h1>
      <input type="text" placeholder="Enter Person Name" onChange={(e) => setName(e.target.value)}></input>
      <button onClick={handleAddPerson}>Add Person</button>

      <input type="number" step="1" placeholder="Enter Id Number" onChange={(e) => setP_id(e.target.value)}></input>
      <button onClick={handleDeletePerson}>Delete Person</button>
      
      {status && <p>{status}</p>}
      <table className='PatientTable'>
        <thead className='PatientHead'>
          <th>Name</th><th>ID Number</th>
        </thead>
        <tbody className='PatientBody'>
          {people.map((node, idx) => (
                <tr key={idx} className='PatientRow'>
                  <td><button>{node.properties.name}</button></td>
                  <td>{node.properties.id}</td>
                </tr>
          ))}
        </tbody>
        
        
      </table>
    </div>
  );
};

export default App;