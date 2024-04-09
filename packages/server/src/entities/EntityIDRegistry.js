class EntityIDRegistry {
    constructor() {
        this.entities = {};
        this.NO_WORLD_KEY = 'DEFAULT';
        this.entities[this.NO_WORLD_KEY] = {}
    }

    registerEntity(world, type, id, entity_id) {
        if (!type || typeof id === 'undefined' || typeof entity_id === 'undefined') {
            console.error('Invalid input parameters');
            return;
        }

        const worldKey = world || this.NO_WORLD_KEY;
        this.entities[worldKey] = this.entities[worldKey] || {};
        this.entities[worldKey][type] = this.entities[worldKey][type] || {};
        this.entities[worldKey][type][id] = entity_id;
    }

    getEntityId(world, type, id) {
        const worldKey = world || this.NO_WORLD_KEY;
        let entities = this.entities[this.NO_WORLD_KEY][type]
        let entityId = null

        if (!entities) {
            entities = this.entities[worldKey][type]
        }
        if (entities) {
            entityId = entities[id]
        }
        return entityId || null;
    }
}

module.exports = EntityIDRegistry;