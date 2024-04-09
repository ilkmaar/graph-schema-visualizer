const schema = {
    "World": {
        IdField: "world_id",
        EntityType: "World",
        Properties: [
            {"field_name": "world_id", "property_name": "name"}
        ]
    },
    "Color": {
        IdField: "color_id",
        EntityType: "Color",
        Properties: [
            {"field_name": "color_name", "property_name": "name"}
        ]
    },
    "Faction": {
        IdField: "faction_id",
        EntityType: "Faction",
        Properties: [
            {"field_name": "faction_name", "property_name": "name"}
        ]
    },
    "ResourceCategory": {
        IdField: "resource_category_id",
        EntityType: "ResourceCategory",
        Properties: [
            {"field_name": "resource_category_name", "property_name": "name"}
        ],
    },
    "ResourceVariety": {
        IdField: "resource_type_id",
        EntityType: "ResourceVariety",
        Properties: [
            {"field_name": "resource_type_name", "property_name": "name"}
        ],
    },
    "ItemCategory": {
        IdField: "item_category_id",
        EntityType: "ItemCategory",
        Properties: [
            {"field_name": "item_category_name", "property_name": "name"}
        ],
    },
    "ItemVariety": {
        IdField: "item_variety_id",
        EntityType: "ItemVariety",
        Properties: [
            {"field_name": "item_variety_name", "property_name": "name"}
        ],
        Relationships: [
            { type: "ItemCategory", relation: "IN_CATEGORY", match_on: "item_category_id" }
          ]
    },
    "CreatureType": {
        IdField: "creature_type_id",
        EntityType: "CreatureType",
        Properties: [
            {"field_name": "creature_type_name", "property_name": "name"}
        ]
    },
    "Island": {
        IdField: "island_id",
        EntityType: "Island",
        Properties: [
            {"field_name": "island_name", "property_name": "name"},
        ],
    },
    "AreaActivity": {
        IdField: "activity_id",
        EntityType: "AreaActivity",
        Properties: [
            {"field_name": "activity_name", "property_name": "name"}
        ]
    },
    "Player": {
        IdField: "player_id",
        EntityType: "Player",
        Properties: [
            {"field_name": "player_name", "property_name": "name"},
            {"field_name": "world_id", "property_name": "world"},
        ]
    },
    "Creature": {
        IdField: "creature_id",
        EntityType: "Creature",
        Properties: [
            {"field_name": "creature_name", "property_name": "name"},
            {"field_name": "created_date", "property_name": "created_date"},
            {"field_name": "world_id", "property_name": "world"}
        ],
        Relationships: [
          { type: "Faction", relation: "HAS", match_on: "faction_id" },
          { type: "Color", relation: "HAS", match_on: "color_id" },
          { type: "CreatureType", relation: "HAS", match_on: "creature_type_id" }
        ]
    },
    "ItemType": {
        IdField: "item_def_id",
        EntityType: "ItemType",
        Properties: [
            {"field_name": "item_def_name", "property_name": "name"},
        ],
        Relationships: [
            { type: "ItemCategory", relation: "ITEM_CATEGORY", match_on: "item_category_id" },
            { type: "ItemVariety", relation: "ITEM_VARIETY", match_on: "item_variety_id" },
        ]
    },
    "ResourceType": {
        IdField: "item_def_id",
        EntityType: "ResourceType",
        Properties: [
            {"field_name": "item_def_name", "property_name": "name"},
        ],
        Relationships: [
          { type: "ResourceCategory", relation: "RESOURCE_CATEGORY", match_on: "resource_category_id" },
          { type: "ResourceVariety", relation: "RESOURCE_VARIETY", match_on: "resource_type_id" },
        ]
    },
    "Area": {
        IdField: "location_id",
        EntityType: "Area",
        Properties: [
            {"field_name": "location_name", "property_name": "name"},
            {"field_name": "location_position_x", "property_name": "x"},
            {"field_name": "location_position_y", "property_name": "y"},
        ],
        Relationships: [
            { type: "Island", relation: "ON_ISLAND", match_on: "location_island" },
            { type: "AreaActivity", relation: "HAS_ACTIVITY", match_on: "location_creature_activity_type" }
        ]
    },
    "Plot": {
        IdField: "plot_id",
        EntityType: "Plot",
        Properties: [
            {"field_name": "world_id", "property_name": "world"},
        ],
        Relationships: [
            { type: "Area", relation: "IN_AREA", match_on: "location_id" }
        ]
    },
    "Patch": {
        IdField: "patch_id",
        EntityType: "Patch",
        Relationships: [
            { type: "Plot", relation: "IN_PLOT", match_on: "plot_id"},
        ]
    },
    "Item": {
        IdField: "item_id",
        EntityType: "Item",
        Properties: [
            {"field_name": "world_id", "property_name": "world"},
            {"field_name": "created_date", "property_name": "created_date"},
            {"field_name": "item_quality", "property_name": "quality"}
        ],
        Relationships: [
            { type: "ItemType", relation: "IS_ITEM_TYPE", match_on: "item_def_id"}
        ]
    },
    "Resource": {
        IdField: "item_id",
        EntityType: "Resource",
        Properties: [
            {"field_name": "world_id", "property_name": "world"},
            {"field_name": "created_date", "property_name": "created_date"},
            {"field_name": "item_quality", "property_name": "quality"}
        ],
        Relationships: [
            { type: "ResourceType", relation: "IS_RESOURCE_TYPE", match_on: "item_def_id"}
        ]
    },
    "Foraging": {
        IdField: "interaction_event_id",
        EntityType: "Foraging",
        Properties: [
            {"field_name": "world_id", "property_name": "world"},
            {"field_name": "raw_time", "property_name": "time"},
            {"field_name": "day_id", "property_name": "day"},
            {"field_name": "time_of_day_id", "property_name": "time_of_day"},
            {"field_name": "interaction_event_event_pos_x", "property_name": "x"},
            {"field_name": "interaction_event_event_pos_y", "property_name": "y"},
        ],
        Relationships: [
            { "type": "Player", "relation": "BY_PLAYER", "match_on": "player_id"},
            { "type": "Area", "relation": "AT_LOCATION", "match_on": "location_id"},
            { "type": "Resource", "relation": "CREATES", "match_on": "output_item1" },
        ]
    },
    "Crafting": {
        IdField: "interaction_event_id",
        EntityType: "Crafting",
        Properties: [
            {"field_name": "world_id", "property_name": "world"},
            {"field_name": "raw_time", "property_name": "time"},
            {"field_name": "day_id", "property_name": "day"},
            {"field_name": "time_of_day_id", "property_name": "time_of_day"},
        ],
        Relationships: [
            { "type": "Player", "relation": "BY_PLAYER", "match_on": "player_id"},
            { "type": "Resource", "relation": "USES", "match_on": "input_item1" },
            { "type": "Resource", "relation": "USES", "match_on": "input_item2" },
            { "type": "Item", "relation": "CRAFTS_ITEM", "match_on": "output_item1" },
        ]
    },
    "Gifting": {
        IdField: "interaction_event_id",
        EntityType: "Gifting",
        Properties: [
            {"field_name": "world_id", "property_name": "world"},
            {"field_name": "raw_time", "property_name": "time"},
            {"field_name": "day_id", "property_name": "day"},
            {"field_name": "time_of_day_id", "property_name": "time_of_day"},
        ],
        Relationships: [
            { "type": "Player", "relation": "BY_PLAYER", "match_on": "player_id"},
            { "type": "Creature", "relation": "GIVEN_TO", "match_on": "creature_id"},
            { "type": "Item", "relation": "ITEM_GIVEN", "match_on": "input_item1" },
        ]
    },
    "Weather": {
        IdField: "weather_event_id",
        EntityType: "Weather",
        Properties: [
            {"field_name": "world_id", "property_name": "world"},
            {"field_name": "raw_time", "property_name": "time"},
            {"field_name": "sun_type", "property_name": "sun"},
            {"field_name": "rain_type", "property_name": "rain"},
            {"field_name": "day_id", "property_name": "day"}
        ],
        Relationships: [
            { "type": "Island", "relation": "ON_ISLAND", "match_on": "weather_event_island"},
        ]
    },
    "Migration": {
        IdField: "creature_move_event_id",
        EntityType: "Migration",
        Properties: [
            {"field_name": "world_id", "property_name": "world"},
            {"field_name": "raw_time", "property_name": "time"},
            {"field_name": "day_id", "property_name": "day"},
            {"field_name": "time_of_day_id", "property_name": "time_of_day"},
        ],
        Relationships: [
            { "type": "Creature", "relation": "BY_CREATURE", "match_on": "creature_id"},
            { "type": "Area", "relation": "AT_LOCATION", "match_on": "location_id"},
        ]
    },
    "Activity": {
        IdField: "creature_activity_event_id",
        EntityType: "Activity",
        Properties: [
            {"field_name": "world_id", "property_name": "world"},
            {"field_name": "raw_time", "property_name": "time"},
            {"field_name": "day_id", "property_name": "day"},
            {"field_name": "time_of_day_id", "property_name": "time_of_day"},
        ],
        Relationships: [
            { "type": "Creature", "relation": "BY_CREATURE", "match_on": "creature_id"},
            { "type": "AreaActivity", "relation": "DID_ACTIVITY", "match_on": "activity_event_type"},
            { "type": "Area", "relation": "AT_LOCATION", "match_on": "location_id"},
        ]
    },
    "DinerSeatingEvent": {
        IdField: "diner_seating_event_id",
        EntityType: "DinerSeatingEvent",
        Properties: [
            {"field_name": "world_id", "property_name": "world"},
            {"field_name": "raw_time", "property_name": "time"},
            {"field_name": "day_id", "property_name": "day"},
            {"field_name": "time_of_day_id", "property_name": "time_of_day"},
            {"field_name": "seat_id", "property_name": "seat"},
            {"field_name": "seat_type_id", "property_name": "area"}
        ],
        Relationships: [
            { "type": "Player", "relation": "BY_PLAYER", "match_on": "player_id"},
            { "type": "Creature", "relation": "BY_CREATURE", "match_on": "creature_id"},
            { "type": "Area", "relation": "AT_LOCATION", "match_on": "location_id"},
        ]
    },
    "DinerReview": {
        IdField: "diner_rating_event_id",
        EntityType: "DinerReview",
        Properties: [
            {"field_name": "world_id", "property_name": "world"},
            {"field_name": "raw_time", "property_name": "time"},
            {"field_name": "day_id", "property_name": "day"},
            {"field_name": "time_of_day_id", "property_name": "time_of_day"},
            {"field_name": "rating", "property_name": "rating"}
        ],
        Relationships: [
            { "type": "Creature", "relation": "BY_CREATURE", "match_on": "creature_id"},
            { "type": "Item", "relation": "REVIEWS_ITEM", "match_on": "item_id"},
            { "type": "ItemType", "relation": "ORDERED", "match_on": "hidden_item_def_id"}
        ]
    },
    "Friendship": {
        IdField: "personal_rep_id",
        EntityType: "Friendship",
        Properties: [
            {"field_name": "world_id", "property_name": "world"},
            {"field_name": "personal_rep_value", "property_name": "value"}
        ],
        Relationships: [
            { "type": "Player", "relation": "PLAYER", "match_on": "player_id"},
            { "type": "Creature", "relation": "CREATURE", "match_on": "creature_id"}
        ]
    }
};

module.exports = schema;