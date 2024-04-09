// Represents an entity with some data and schema

class Entity {
    constructor(data, schema) {
        this.data = data;
        this.schema = schema;

        this.id = this.getLocalID();
        this.world = this.getWorld();
        this.type = this.getType();
        this.properties = this.getProperties();
        this.relationships = this.getRelationships();
        this.components = this.getComponents();
    }

    getJSON() {
        return {
            
        }
    }

    getLocalID() {
       return this.data[this.schema.IdField];
    }

    getWorld() {
        return this.data["world_id"];
    }

    getType() {
        return this.schema.EntityType;
    }

    getProperties() {
      let entityProps = {};
      if (this.schema.Properties) {
          // Iterate over the array of properties
          this.schema.Properties.forEach(prop => {
              if (this.data.hasOwnProperty(prop.field_name)) {
                  // Use property_name as the key and the value from this.data as the value
                  entityProps[prop.property_name] = this.data[prop.field_name];
              }
          });
      }
      return entityProps;
    }

    getRelationships() {
        const relationshipsToCreate = [];        
        const world_id = this.world;
        for (const relationship of this.schema.Relationships || []) {
            const { type: targetType, relation, match_on } = relationship;
            const id_to_match = this.data[match_on];
            
            if (id_to_match !== null && id_to_match !== undefined) {
                relationshipsToCreate.push({ targetType, relation, id_to_match, world_id });
            }
        }
        
        return relationshipsToCreate;
    }

    async getComponents() {
      const componentsToAdd = [];
      for (const ComponentClass of this.schema.Components || []) {
          const component = new ComponentClass(this.data);
          componentsToAdd.push(component);
      }
    }
}

module.exports = Entity;