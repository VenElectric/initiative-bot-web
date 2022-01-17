export const ability_scores = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

export const skills: { [index: string]: string[] } = {
  STR: ["Athletics"],
  DEX: ["Acrobatics", "Sleight of Hand", "Stealth"],
  INT: ["Arcana", "History", "Investigation", "Nature", "Religion"],
  WIS: ["Animal Handling", "Insight", "Medicine", "Perception", "Survival"],
  CHA: ["Deception", "Intimidation", "Performance", "Persuasion"],
};

export const initString = "initiative";
export const spellString = "spells";
export const storageKey = "dungeon-bot";
