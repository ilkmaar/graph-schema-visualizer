const express = require('express');
const neo4j = require('neo4j-driver');
const GameManager = require('./src/entities/GameManager');

const app = express();
const port = 3000;

const driver = neo4j.driver('neo4j://localhost', neo4j.auth.basic('neo4j', 'datagames'));
const session = driver.session();

app.use(express.json());

const cors = require('cors');
app.use(cors());

gameManager = new GameManager()
gameManager.initializeGame()

// Example route to fetch data
app.get('/data', async (req, res) => {
  data_query = 'MATCH (n) RETURN n LIMIT 100'

  try {
    const result = await session.run(data_query);
    const records = result.records.map(record => record.get('n').properties);
    res.json(records);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Example route to fetch schema
app.get('/schema', async (req, res) => {
  const data_query = 'CALL db.schema.visualization()';

  try {
    const result = await session.run(data_query);
    // Initialize arrays to hold nodes and relationships
    let nodes = [];
    let relationships = [];

    // Extract nodes and relationships from the result
    result.records.forEach(record => {
      nodes = nodes.concat(record.get('nodes'));
      relationships = relationships.concat(record.get('relationships'));
    });

    // Optionally, you might want to format nodes and relationships 
    // here if you need to customize the output.

    // Send nodes and relationships as JSON
    res.json({ nodes, relationships });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => console.log(`Express server listening on port ${port}!`));

process.on('exit', () => {
  session.close();
  driver.close();
});