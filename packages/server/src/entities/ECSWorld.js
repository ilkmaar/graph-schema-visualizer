const Entity = require('./Entity');
const EntityIDRegistry = require('./EntityIDRegistry')
const GraphDB = require('../data/GraphDB')

class ECSWorld {
    constructor() {
      this.entityIDRegistry = new EntityIDRegistry();
      this.db = new GraphDB();
      this.systems = []
    }
    
    async createEntity (data, schema) {
        // create new Entity from data and schema
        const entity = new Entity(data, schema);

        // add it to the db and store the new entity_id
        const entity_id = await this.db.storeEntity(entity.type, entity.properties);

        // associate the local_id and entity_id in the registry
        this.entityIDRegistry.registerEntity(entity.world, entity.type, entity.id, entity_id);
        this.createEntityRelationships(entity_id, entity.relationships);
        return entity_id;
    }

    async createEntityRelationships(entity_id, relationships) {
        for (const { targetType, relation, id_to_match, world_id } of relationships) {
            const target_entity_id = await this.entityIDRegistry.getEntityId(world_id, targetType, id_to_match);
            if (target_entity_id) {
                await this.createRelationship(entity_id, target_entity_id, relation);
            }
        }
    }

    async createRelationship (a_id, b_id, relation) {
        const result = await this.db.createRelationship(a_id, b_id, relation);
        return result;
    }

    async update() {
        // if there were game any systems running...
        for (const system of this.systems) {
            await system.update(this);
        }
    }
}

module.exports = ECSWorld;