const apiClient = require('./fv_api.js');
const schema = require('./fv_schema.js')

class EntityDataProvider {
    constructor(apiClient) {
        this.apiClient = apiClient;
        this.entityAPIMap = {
            "World": apiClient.world.getWorlds,
            "Player": apiClient.world.getPlayers,
            "Island": apiClient.world.getIslands,
            "Area": apiClient.world.getAreas,
            "Plot": apiClient.world.getPlots,
            "Patch": apiClient.world.getPatches,
            "AreaActivity": apiClient.world.getAreaActivities,
            "Creature": apiClient.creatures.getCreatures,
            "Faction": apiClient.creatures.getFactions,
            "CreatureType": apiClient.creatures.getCreatureTypes,
            "Color": apiClient.creatures.getColors,
            "Friendship": apiClient.creatures.getFriendships,
            "Resource": apiClient.items.getResources,
            "ResourceType": apiClient.items.getResourceTypes,
            "ResourceVariety": apiClient.items.getResourceVarieties,
            "ResourceCategory": apiClient.items.getResourceCategories,
            "Item": apiClient.items.getItems,
            "ItemType": apiClient.items.getItemTypes,
            "ItemVariety": apiClient.items.getItemVarieties,
            "ItemCategory": apiClient.items.getItemCategories,
            "Day": apiClient.events.getDays,
            "TimeOfDay": apiClient.events.getTimeOfDays,
            "Foraging": apiClient.events.getForaging,
            "Crafting": apiClient.events.getCrafting,
            "Gifting": apiClient.events.getGifting,
            "Weather": apiClient.events.getWeather,
            "DinerReview": apiClient.events.getDinerReviews,
            "DinerSeatingEvent": apiClient.events.getDinerSeatingEvents,
            "Migration": apiClient.events.getMigrations,
            "Activity": apiClient.events.getActivities
        }
    }

    async getEntityData(entityType) {
        if (!this.entityAPIMap[entityType]) {
            throw new Error(`No API method defined for entity type: ${entityType}`);
        }
        const type_data = await this.entityAPIMap[entityType].call(this.apiClient)

        if (!schema[entityType]) {
            throw new Error(`No schema defined for data type: ${entityType}`);
        }
        const type_schema = schema[entityType];
        
        return {type_data, type_schema};
    }
}

module.exports = new EntityDataProvider(apiClient);