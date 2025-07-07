require('dotenv').config();

const express = require('express');
const app = express();
const port = 5000;

const neo4j = require('neo4j-driver');
const cors = require('cors');

// Enable CORS so frontend can access backend
app.use(cors());

app.use(express.json());

// Neo4j driver setup (adjust credentials & URI)
const driver = neo4j.driver(
    process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);
const session = driver.session();

app.get('/api/nodes', async (req, res) => {
  try {
    // Example: fetch all nodes with label 'Person'
    const result = await session.run('MATCH (n:Person) RETURN n LIMIT 25');

    // Extract nodes data
    const nodes = result.records.map(record => {
      const node = record.get('n');
      return {
        labels: node.labels,
        properties: node.properties,
      };
    });

    res.json(nodes);
  } catch (error) {
    console.error('Error querying Neo4j:', error);
    res.status(500).send('Error querying database');
  }
});

app.post('/api/add-person', async (req, res) => {
    const { name } = req.body;
    const session = driver.session();
    const newId = Date.now();

    try {
      const result = await session.run(
        'CREATE (p:Person {id: $person_id, name: $name}) RETURN p',
        { person_id: newId, name: name }
      );
      const createdNode = result.records[0].get('p').properties;
      res.json({ success: true, person: createdNode });
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ success: false, error: err.message });
    } finally {
      await session.close();
    }
  });

app.post('/api/del-person', async (req, res) => {
    const {person_id} = req.body;
    console.log(person_id);
    const session = driver.session();

    if (!person_id) {
  return res.status(400).json({ success: false, error: 'Missing person_id' });
}
    try {
        const result = await session.run(
          'MATCH (p:Person {id: $person_id}) WITH p, p AS deleted DETACH DELETE p RETURN deleted',
          { person_id: neo4j.int(person_id) }
        );
        const deletedNode = result.records[0].get('deleted').properties;
        res.json({ success: true, person: deletedNode });
      } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, error: err.message });
      } finally {
        await session.close();
      }
});

  

// Clean up driver when app stops
process.on('exit', async () => {
  await session.close();
  await driver.close();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});