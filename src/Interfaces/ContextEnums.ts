import {InitiativeObject, SpellObject, SessionData} from "./initiative";

export enum InitiativeContextEnums {
    INITIAL_INIT = "INITIAL_INIT",
    ADD_INITIATIVE = "ADD_INITIATIVE",
    UPDATE_INITIATIVE = "UPDATE_INITIATIVE",
    INITIATITVE_LIST = "INITIATITVE_LIST",
    NEXT = "NEXT",
    PREVIOUS = "PREVIOUS",
    RE_ROLL = "RE_ROLL",
    DISCORD_INITIATIVE = "DISCORD_INITIATIVE",
    RESORT = "RESORT",
    UPDATE_ORDER = "UPDATE_ORDER",
    REMOVE_STATUS_EFFECT = "REMOVE_STATUS_EFFECT",
    SET_CURRENT_TURN = "SET_CURRENT_TURN",
    ADD_STATUS_EFFECT = "ADD_STATUS_EFFECT",
    DELETE_INITIATIVE = "DELETE_INITIATIVE",
    ROUND_START = "ROUND_START"
}

export enum SpellContextEnums {
  INITIAL_SPELLS = "INITIAL_SPELLS", 
  ADD_SPELL = "ADD_SPELL",
  DELETE_SPELL = "DELETE_SPELL",
  UPDATE_SPELL = "UPDATE_SPELL",
  REMOVE_CHARACTER = "REMOVE_CHARACTER",
  ADD_CHARACTER = "ADD_CHARACTER",
  DISCORD_SPELLS = "DISCORD_SPELLS"
}
// Initiative context ONLY

export enum InitiativeObjectEnums {
   id = "id",
    characterName = "characterName",
    initiative = "initiative",
    initiativeModifier= "initiativeModifier",
    roundOrder = "roundOrder",
    isCurrent = "isCurrent",
    statusEffects = "statusEffects",
    isNpc = "isNpc"
}

export enum SpellObjectEnums {
  durationTime = "durationTime",
  durationType = " durationType",
  effectName = "effectName",
  effectDescription = "effectDescription",
  id = "id",
  characterIds = "characterIds",
}

export enum SessionFunctionEnums {
    GET_INITIAL_INIT = "GET_INITIAL_INIT",
    GET_INITIAL_SPELLS = "GET_INITIAL_SPELLS",
    NEXT = "NEXT",
    PREVIOUS = "PREVIOUS",
    ROUND_START = "ROUND_START",
    EDIT = "EDIT",
    DELETE_DATA = "DELETE_DATA",
    CREATE_NEW = "CREATE_NEW",
    RE_ROLL = "RE_ROLL",
    UPDATE_ALL = "UPDATE_ALL",
    DISCORD = "DISCORD",
    RESORT = "RESORT",
    REMOVE_STATUS_EFFECT = "REMOVE_STATUS_EFFECT",
    SET_CURRENT_TURN = "SET_CURRENT_TURN",
  }

  
  export enum CollectionTypes {
    INITIATIVE = "initiative",
    SPELLS = "spells",
    LOGGING = "logging"
  }

  export type PayloadType =
  | InitiativeObject
  | InitiativeObject[]
  | SpellObject
  | SpellObject[]
  | SessionData
  | string;