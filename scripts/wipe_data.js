const neo4j = require('neo4j-driver');

// Neo4j connection
const driver = neo4j.driver('neo4j://localhost', neo4j.auth.basic('neo4j', 'datagames'));
const session = driver.session();

const query = `
  MATCH (m) DETACH DELETE m
`;

session.run(query)
  .then(() => {
    console.log('Data has been wiped.');
  })
  .catch(error => {
    console.error('Error deleting data:', error);
  })
  .finally(() => {
    session.close();
    driver.close();
});