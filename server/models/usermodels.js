const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');




// CRITTERS

const speciesTrait = new mongoose.Schema({
    traitType: {
        type: String,
        required: true
    },
    traitRarity: {
        type: Number,
        required: true,
        default: 0
    },
    magnitude: {
        type: Number,
        default: 0
    }
});

const speciesSchema = new mongoose.Schema({
    noun_singular: {
        type: String,
        required: true
    },
    noun_plural: {
        type: String,
        required: true
    },
    adjective: {
        type: String,
        required: true
    },
    usual_traits: {
        type: [ObjectID]
    },
    common_traits: {
        type: [ObjectID]
    }
});




// PLANETS

const populationSchema = new mongoose.Schema({
    species:{
      type: ObjectID,
      required: true
    }
});

const resourceSchema = new mongoose.Schema({

});

const developmentSchema = new mongoose.Schema({
    level: {
	type: Number,
	required: true,
	default: 0
    }
});

const planetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: "Planet"
    },
    size: {
        type: Number,
        default: 10
    },
    climate: {
        type: String,
        required: true,
        default: "temperate"
    },
    populations: {
        type: [populationSchema]
    },
    developments:{
        type: [developmentSchema]
    },
    resources: {
        type: [resourceSchema]
    },
    government: {
        type: ObjectID,
        required: false
    },
});


// GOVERNMENTS

const intelschema = new mongoose.Schema({
    planet: {
        type: ObjectID,
        required: true
    },
    level: {
        type: Number,
        min: 0,
        max: 5,
    }
});

const sovereignSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        default: "NPC" // Versus "NPC" or others as required.
    },
    name: {
        full: {
            type: String,
            required: true,
            default: "The Planetary Government",
            unique: true
        },
        short: {
            type: String,
            required: false,
            default: "The Planetary Government"
        },
    },
    intelligence: {
        type: [intelschema],
        required: false,
    }
})

const civSchema = new mongoose.Schema({
    player: {
        type: ObjectID,
        unique: true,
        required: true
    },
    homeworld: {
        type: ObjectID,
        unique: true
    },
    founding_species: {
        type: ObjectID,
    },
    government: {
        type: sovereignSchema,
    },
});

// PLAYERS and general administration

const playerSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
});

const Species = mongoose.model("Species", speciesSchema, "Species")
const Planet = mongoose.model("Planet", planetSchema, "Planets");
const Civilization = mongoose.model("Civilization", civSchema, "Civilizations")
const Player = mongoose.model("Player", playerSchema, "Players");

module.exports = {Player, Species, Civilization, Planet};
