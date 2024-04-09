const axios = require('axios');
const baseURL = "https://ilkmaar-data-pre-release.fablevision-dev.com/api/";
const apiClient = axios.create({ baseURL });

DINER_LOCATION_ID = '121'

const SUN_TYPES = {
    '1': "Sunny",
    '2': "Cloudy"
};

const RAIN_TYPES = {
    '1': "Rainy",
    '2': "Dry"
};

const ISLANDS = [
    {island_id: 1, island_name: "Shadow Island"},
    {island_id: 2, island_name: "Light Island"},
    {island_id: 3, island_name: "Growth Island"},
    {island_id: 4, island_name: "Stability Island"},
]

const ACTIVITIES = [
    {activity_id: 0, activity_name: "None"},
    {activity_id: 1, activity_name: "Music"},
    {activity_id: 2, activity_name: "Craft"},
    {activity_id: 3, activity_name: "Writing"},
    {activity_id: 4, activity_name: "Textiles"},
]

const ITEM_VARIETIES = [
    {item_variety_id: 1, item_variety_name: "Smoothie", item_category_id: 4},
    {item_variety_id: 2, item_variety_name: "Jelly", item_category_id: 4},
    {item_variety_id: 3, item_variety_name: "Pastry", item_category_id: 4},
    {item_variety_id: 4, item_variety_name: "Cupcake", item_category_id: 4},
    {item_variety_id: 5, item_variety_name: "Rejuvenation Tea", item_category_id: 2},
    {item_variety_id: 6, item_variety_name: "Protection Tonic", item_category_id: 2},
    {item_variety_id: 7, item_variety_name: "Enchantment Brew", item_category_id: 2},
    {item_variety_id: 8, item_variety_name: "Luminous Boba", item_category_id: 2},
    {item_variety_id: 9, item_variety_name: "Harmonics", item_category_id: 8},
    {item_variety_id: 10, item_variety_name: "Masonry", item_category_id: 8},
    {item_variety_id: 11, item_variety_name: "Secretspinning", item_category_id: 8},
    {item_variety_id: 12, item_variety_name: "Fibercraft", item_category_id: 8},
    {item_variety_id: 13, item_variety_name: "Growth", item_category_id: 16},
    {item_variety_id: 14, item_variety_name: "Stability", item_category_id: 16},
    {item_variety_id: 15, item_variety_name: "Shadow", item_category_id: 16},
    {item_variety_id: 16, item_variety_name: "Light", item_category_id: 16},
]

const ITEMS = {
    "Food": {
        "Smoothie": ["Berry Burst Smoothie", "Stonefruit Spritzer", "Chocolate Delight", "Tropical Punch"],
        "Jelly": ["Berry Burst Jelly", "Apricot Jelly", "Chocolate Jelly", "Tropical Fruit Gel"],
        "Pastry": ["Wheatberry Pastry", "Peach Pie", "Chocolate Tart", "Tropical Fruit Puff"],
        "Cupcake": ["Vanilla Cupcake", "Peach Cupcake", "Chocolate Cupcake", "Funfetti Cupcake"]
    },
    "Health Potion": {
        "Rejuvenation Tea": ["Wheatberry Green Tea", "Stonefruit Oolong Tea", "Cocoa Mint Tea", "Sporefruit Herbal Tea"],
        "Protection Tonic": ["Wheatberry Guard Tonic", "Stonefruit Shield Syrup", "Cocoa Barrier Blend", "Sporefruit Defense Tonic"],
        "Enchantment Brew": ["Wheatberry Luminescent Brew", "Stonefruit Illusion Brew", "Cocoa Mystic Brew", "Sporefruit Enigma Brew"],
        "Luminous Boba": ["Wheatberry Glow Boba", "Stonefruit Crystal Boba", "Cocoberry Bliss Boba", "Sporefruit Sparkle Boba"]
    },
    "Gift": {
        "Harmonics": ["Vitalwood Violin", "Harmoni-crystal", "Chitin Chime", "Mycolumin Lyre"],
        "Masonry": ["Stonelace Ivy", "Seismi-crystal", "Keystone Relic", "Glowgrain Marble"],
        "Secretspinning": ["Vitalink Codex",  "Mysti-crystal", "Shadowscript Scroll", "Mycolumin Manuscript"],
        "Fibercraft": ["Lifeweave Vest", "Prisma-crystal", "Enchanted Shadowcloak", "Glowthread Garment"]
    },
    "Growth Potion": {
        "Growth": ["Sap Bloom Crystal", "Sweet Blossom Crystal", "Honey Sprout Crystal", "Candy Vine Crystal"],
        "Stability": ["Luminaector Stone", "Silver Glaze Stone", "Celestial Honey Stone", "Stardust Stone"],
        "Shadow": ["Midnight Shard", "Nocturnal Sucrose Shard", "Honeyweb Shard", "Shadowdust Shard"],
        "Light": ["Mushloom Gem", "Sporeweb Gem", "Honeyfung Gem", "Fungal Fluff Gem"]
    }
}

async function fetchData(endpoint) {
    try {
        const response = await apiClient.get(endpoint);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from ${endpoint}: `, error);
        throw error;
    }
}

// Processing functions specific to FV data structure
async function flattenData(events) {
    return events.map(event => {
        const flattened = { ...event };
        event.input_items.forEach((item, index) => {
            flattened[`input_item${index + 1}`] = item.item_id;
        });
        delete flattened.input_items;

        event.output_items.forEach((item, index) => {
            flattened[`output_item${index + 1}`] = item.item_id;
        });
        delete flattened.output_items;

        return flattened;
    });
}

// separate out different interaction event types
async function processInteractionEvents(interactionEventType) {
    const events = await fetchData('/interaction-events');
    const filteredEvents = events.filter(event => event.interaction_event_type === interactionEventType);
    return await flattenData(filteredEvents);
}

// remove world_id field for plot data
async function processPlots() {
    const plots_data = await fetchData('/plots');
    const filtered_plots = plots_data.map(({ world_id, ...rest }) => rest);
    return filtered_plots;
}

// get resources from items list
async function getResourceDefinitions() {
    const item_definitions = await fetchData('/item-definitions');

    // Filter item_definitions for those with item_category_id of '1' (for "Resource")
    const resource_definitions = item_definitions.filter(item_def => item_def.item_category_id == '1');
    return resource_definitions;
}

function getItemTypeId(itemName) {
    // Loop through each category in ITEMS (Food, Health Potion, etc.)
    for (const category in ITEMS) {
        // Loop through each item type in the category (Smoothie, Jelly, etc.)
        for (const itemType in ITEMS[category]) {
            // Check if the itemName exists in the array of items
            if (ITEMS[category][itemType].includes(itemName)) {
                // Return the ITEM_TYPE_ID from ITEM_TYPES
                return ITEM_TYPES[itemType];
            }
        }
    }
    // Return null if the item name was not found in any category
    return null;
}

function getItemVarietyDetails(itemName) {
    // Find the item's variety name by looping through the ITEMS data structure
    for (const category in ITEMS) {
        for (const itemType in ITEMS[category]) {
            if (ITEMS[category][itemType].includes(itemName)) {
                // With the itemType, find the corresponding item_variety_id
                const itemVariety = ITEM_VARIETIES.find(variety => variety.item_variety_name === itemType);
                return {
                    item_variety_id: itemVariety ? itemVariety.item_variety_id : null,
                };
            }
        }
    }
    return null;
}

async function getItemDefinitions() {
    const item_definitions = await fetchData('/item-definitions');

    // Filter item_definitions for those with item_category_id of '1' (for "Resource")
    const filtered_item_definitions = item_definitions.filter(item_def => item_def.item_category_id != '1');

    // Map over the filtered_item_definitions to only return the necessary fields and include item_variety_id
    const definitions_with_types_and_varieties = filtered_item_definitions.map(item_def => {
        // Use the item name to lookup the variety ID
        const variety_details = getItemVarietyDetails(item_def.item_def_name);

        // Return a new object with only the specified fields
        const def =  {
            item_def_id: item_def.item_def_id,
            item_category_id: item_def.item_category_id,
            item_variety_id: variety_details ? variety_details.item_variety_id : null,
            item_def_name: item_def.item_def_name
        };
        return def
    });

    return definitions_with_types_and_varieties;
}

// get resources from items list
async function processResources() {
    const resource_definitions = await getResourceDefinitions()
    
    // Create a Set of ids from the filtered item definitions for fast lookup
    const valid_ids = new Set(resource_definitions.map(item_def => item_def.item_def_id));
    
    // Fetch the items data
    const items_data = await fetchData('/items');
    
    // Filter items_data to include only items whose item_def_id exists in the valid_ids Set
    const resources = items_data.filter(item => valid_ids.has(item.item_def_id));
    return resources;
}

// exclude resources from items list
async function processItems() {
    const filtered_item_definitions = await getItemDefinitions()
    
    // Create a Set of ids from the filtered item definitions for fast lookup
    const valid_ids = new Set(filtered_item_definitions.map(item => item.item_def_id));
    
    // Fetch the items data
    const items_data = await fetchData('/items');
    
    // Filter items_data to exclude items whose item_def_id exists in the valid_ids Set
    const non_resources = items_data.filter(item => valid_ids.has(item.item_def_id));
    return non_resources;
}

async function processItemCategories() {
    const item_categories = await fetchData('/item-categories')
    const filtered_item_categories = item_categories.filter(item => item.item_category_id != '1');
    return filtered_item_categories
}

async function processResourceCategories() {
    const resource_categories = await fetchData('/resource-categories')
    const filtered_resource_categories = resource_categories.filter(item => item.resource_category_id != '-1');
    return filtered_resource_categories
}

async function processResourceTypes() {
    const resource_types = await fetchData('/resource-types')
    const filtered_resource_types = resource_types.filter(item => item.resource_type_id != '4');
    return filtered_resource_types
}

async function processWeatherEvents() {
    const events = await fetchData('/weather-events');
    const detailEvents = events.map(event => ({
        ...event,
        sun_type: SUN_TYPES[event.sun_type],
        rain_type: RAIN_TYPES[event.rain_type]
    }));
    return detailEvents;
}

async function processDinerEvents(endpoint) {
    const events = await fetchData(endpoint);
    const withLocation = events.map(event => ({
        ...event,
        location_id: DINER_LOCATION_ID
    }));
    return withLocation;
}

const api = {
    world: {
        getWorlds: () => fetchData('/worlds'),
        getPlayers: () => fetchData('/players'),
        getIslands: () => { return ISLANDS },
        getAreas: () => fetchData('/locations'),
        getPlots: () => processPlots(),
        getPatches: () => fetchData('/patches'),
        getAreaActivities: () => { return ACTIVITIES },
    },
    creatures: {
        getCreatures: () => fetchData('/creatures'),
        getFactions: () => fetchData('/factions'),
        getCreatureTypes: () => fetchData('/creature-types'),
        getColors: () => fetchData('/colors'),
        getFriendships: () => fetchData('/personal-reputations'),
        getFactionReputations: () => fetchData('/faction-reputations')
    },
    items: {
        getResources: () => processResources(),
        getResourceTypes: () => getResourceDefinitions(),
        getResourceCategories: () => processResourceCategories(),
        getResourceVarieties: () => processResourceTypes(),
        getItems: () => processItems(),
        getItemTypes: () => getItemDefinitions(),
        getItemCategories: () => processItemCategories(),
        getItemVarieties: () => { return ITEM_VARIETIES },
    },
    events: {
        getDays: () => fetchData('/days'),
        getTimeOfDays: () => fetchData('/time-of-days'),
        getWeather: () => processWeatherEvents(),
        getForaging: () => processInteractionEvents(1),
        getCrafting: () => processInteractionEvents(2),
        getGifting: () => processInteractionEvents(4),
        getMigrations: () => fetchData('/creature-move-events'),
        getActivities: () => fetchData('/creature-activity-events'),
        getDinerSeatingEvents: () => processDinerEvents('/diner-seating-events'),
        getDinerReviews: () => processDinerEvents('/diner-rating-events')
    },
    analytics: {
        getSimulationStats: () => fetchData('/simulation-stats'),
        getSheetLinks: () => fetchData('/sheet-links'),
        getPlayerManipulateDataEvents: () => fetchData('/player-manipulate-data-events'),
        getPlayerMoveEvents: () => fetchData('/player-move-events')
    }
};

module.exports = api;