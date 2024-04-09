const neo4j = require('neo4j-driver');

class GraphDB {
    constructor() {
      this.driver = neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('neo4j', 'datagames'));
      this.clear_db()
    }
  
    async clear_db() {
      const session = this.driver.session();
      try {
        await session.run(`MATCH (m) DETACH DELETE m`);
      } finally {
        await session.close();
      }
    }

    async storeEntity(label, properties = {}) {
      return await this.createNode(label, properties);
    }
  
    async createNode(label, properties = {}) {
      const session = this.driver.session();
  
      const propertiesString = Object.keys(properties)
        .map(key => `${key}: $${key}`)
        .join(", ");
    
      const query = propertiesString
        ? `CREATE (e:${label} {id: apoc.create.uuid(), ${propertiesString}}) RETURN e.id AS id`
        : `CREATE (e:${label} {id: apoc.create.uuid()}) RETURN e.id AS id`;
    
      try {
        const result = await session.run(query, properties);
        const nodeId = result.records[0].get('id');
        return nodeId;
      } finally {
        await session.close();
      }
    }

    async createRelationship (a_id, b_id, type) {
      const session = this.driver.session();
      try {
        const query = `
          MATCH (a {id: '${a_id}'}), (b {id: '${b_id}'})
          CREATE (a)-[:${type}]->(b)
        `;
        const result = await session.run(query);
        return result.records.map(record => record.get('entityId').toNumber());
      } finally {
        await session.close();
      }
    }

    async addComponent(entityId, componentInstance) {
      const session = this.driver.session();
      const componentType = componentInstance.constructor.name;
      const componentProperties = Object.assign({}, componentInstance);

      try {
        await session.run(`
          MATCH (e {id: $entityId})
          CREATE (c:${componentType}) SET c += $props
          MERGE (e)-[:HAS_COMPONENT]->(c)
        `, { entityId: entityId, props: componentProperties });
    
      } catch (error) {
        console.error('Error adding component:', error);
        throw error;
      } finally {
        await session.close();
      }
    }
    
  async getEntitiesWithComponents(componentTypes) {
    const session = this.driver.session();
    try {
      const query = `
        MATCH (e)
        WHERE ${componentTypes.map(type => `EXISTS(e.${type})`).join(' AND ')}
        RETURN id(e) as entityId
      `;
      const result = await session.run(query);
      return result.records.map(record => record.get('entityId').toNumber());
    } finally {
      await session.close();
    }
  }

  async getEntityComponents(entityId, componentTypes) {
    const session = this.driver.session();
    try {
      const query = `
        MATCH (e)
        WHERE id(e) = $entityId
        RETURN ${componentTypes.map(type => `e.${type} as ${type}`).join(', ')}
      `;
      const result = await session.run(query, { entityId });
      const record = result.records[0];
      return componentTypes.map(type => record.get(type));
    } finally {
      await session.close();
    }
  }
  
  async update() {
    for (const system of this.systems) {
      await system.update(this);
    }
  }
}

module.exports = GraphDB;