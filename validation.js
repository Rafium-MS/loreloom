const Joi = require('joi');

const characterSchema = Joi.object({
  id: Joi.number().integer().required(),
  name: Joi.string().trim().required(),
  age: Joi.string().allow('').trim(),
  race: Joi.string().allow('').trim(),
  class: Joi.string().allow('').trim(),
  role: Joi.string().allow('').trim(),
  appearance: Joi.string().allow('').trim(),
  personality: Joi.string().allow('').trim(),
  background: Joi.string().allow('').trim(),
  skills: Joi.string().allow('').trim(),
  relationships: Joi.string().allow('').trim(),
  tags: Joi.array().items(Joi.string().trim()).default([])
});

const dataSchema = Joi.object({
  title: Joi.string().trim().allow('').required(),
  content: Joi.string().trim().allow('').required(),
  characters: Joi.array().items(characterSchema).required(),
  locations: Joi.array().required(),
  items: Joi.array().required(),
  languages: Joi.array().required(),
  timeline: Joi.array().required(),
  notes: Joi.array().required(),
  economy: Joi.object({
    currencies: Joi.array().required(),
    resources: Joi.array().required(),
    markets: Joi.array().required()
  }).required(),
  uiLanguage: Joi.string().trim().required()
});

function sanitizeCharacter(ch) {
  return {
    id: ch.id,
    name: (ch.name || '').trim(),
    age: (ch.age || '').trim(),
    race: (ch.race || '').trim(),
    class: (ch.class || '').trim(),
    role: (ch.role || '').trim(),
    appearance: (ch.appearance || '').trim(),
    personality: (ch.personality || '').trim(),
    background: (ch.background || '').trim(),
    skills: (ch.skills || '').trim(),
    relationships: (ch.relationships || '').trim(),
    tags: Array.isArray(ch.tags) ? ch.tags.map(t => t.trim()).filter(Boolean) : []
  };
}

function sanitizeData(data) {
  return {
    title: (data.title || '').trim(),
    content: (data.content || '').trim(),
    characters: Array.isArray(data.characters) ? data.characters.map(sanitizeCharacter) : [],
    locations: Array.isArray(data.locations) ? data.locations : [],
    items: Array.isArray(data.items) ? data.items : [],
    languages: Array.isArray(data.languages) ? data.languages : [],
    timeline: Array.isArray(data.timeline) ? data.timeline : [],
    notes: Array.isArray(data.notes) ? data.notes : [],
    economy: {
      currencies: Array.isArray(data.economy?.currencies) ? data.economy.currencies : [],
      resources: Array.isArray(data.economy?.resources) ? data.economy.resources : [],
      markets: Array.isArray(data.economy?.markets) ? data.economy.markets : []
    },
    uiLanguage: (data.uiLanguage || 'pt').trim()
  };
}

module.exports = { characterSchema, dataSchema, sanitizeCharacter, sanitizeData };
