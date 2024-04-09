//
// gameManager.js
// Creates entities from a list of entity types, based on data and a schema from the EntityDataProvider
//

const ECSWorld = require('./ECSWorld');
const EntityDataProvider = require('../data/EntityDataProvider');

ENTITY_TYPES = [
  // "World",
  "Player",
  "Island",
  "AreaActivity",
  "Area",
  "Plot",
  "Patch",
  "ItemCategory", // 4: Food, Potion, Gift, Patch Crystal
  "ItemVariety", // 16: Pastry, Smoothie
  "ResourceCategory", // 4: Plant, Rock, Bug, Mushroom
  "ResourceVariety", // 4: Sweet, Fruit, Magic, Material
  "ResourceType",  // Wheatberry
  "ItemType",  // Crystal Boba
  "Resource",
  "Item",
  "Faction", // Five faction names
  "CreatureType", // 20 subtypes of creature, 5 per faction
  "Color", // Five colors
  "Creature",
  "Foraging",
  "Crafting",
  "Gifting",
  "Friendship",
  "Weather",
  "Activity",
  "Migration",
  // "DinerSeatingEvent",
  // "DinerReview"
]

class GameManager {
  constructor() {
    this.world = new ECSWorld()
    this.entityDataProvider = EntityDataProvider;
  }

  async loadEntitiesOfType(entityType) {
      const { type_data, type_schema } = await this.entityDataProvider.getEntityData(entityType);
      for (const entity_data of type_data) {
          this.world.createEntity(entity_data, type_schema);
      }
  }

  async initializeGame() {
    for (const entityType of ENTITY_TYPES) {
      await this.loadEntitiesOfType(entityType);
      console.log("loaded all ", entityType)
    }
  }

  async startGameLoop() {
    while (true) {
      await this.world.update();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between each iteration
    }
  }
}

module.exports = GameManager;