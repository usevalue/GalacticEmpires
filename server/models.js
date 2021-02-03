const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');


// PLAYERS and general administration

const playerSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

const Player = mongoose.model("Player", playerSchema, "Players");

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

const Species = mongoose.model("Species", speciesSchema, "Species")


// PLANETS

const populationSchema = new mongoose.Schema({
    species:{
      type: ObjectID,
      required: true
    });

const resourceSchema = new mongoose.Schema({

});

const developmentSchema = new mongoose.Schema({

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

const Planet = mongoose.model("Planet", planetSchema, "Planets");

// GOVERNMENTS

const sovereignSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        default: "NPC" // Versus "NPC" or others as required.
    },
    name: {
        full: {
            type: String,
            requried: true,
            default: "The Planetary Government"
        },
        short: {
            type: String,
            required: false,
            default: "The Planetary Government"
        },
    }
})

const civSchema = new mongoose.Schema({
    player: {
        type: ObjectID,
        required: true,
        unique: true
    },
    homeworld: {
        type: ObjectID
    },
    founding_species: {
        type: ObjectID,
    },
    government: {
        type: sovereignSchema,
        default: null
    },
});

const Government = mongoose.model("Government", sovereignSchema, "Governments");

const Civilization = mongoose.model("Civilization", civSchema, "Civilizations");

module.exports = {Player, Species, Planet, Government, Civilization};
