import { InitiativeObject, SpellObject, SessionData } from "./initiative";
import { CollectionTypes } from "./Enums";

export enum EmitTypes {
  GET_INITIAL = "GET_INITIAL",
  GET_SPELLS = "GET_SPELLS",
  NEXT = "NEXT",
  PREVIOUS = "PREVIOUS",
  ROUND_START = "ROUND_START",
  UPDATE_ALL = "UPDATE_ALL",
  DELETE_ONE = "DELETE_ONE",
  DELETE_ALL = "DELETE_ALL",
  CREATE_NEW = "CREATE_NEW",
  UPDATE_ITEM = "UPDATE_ITEM",
  UPDATE_RECORD = "UPDATE_RECORD",
  RE_ROLL = "RE_ROLL",
  RESORT = "RESORT",
  DISCORD = "DISCORD",
  REMOVE_STATUS_EFFECT = "REMOVE_STATUS_EFFECT",
  ADD_STATUS_EFFECT = "ADD_STATUS_EFFECT",
} //socket.emit(EmitType)

export enum SessionFunctionTypes {
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
  REMOVE_STATUS_EFFECT = "REMOVE_STATUS_EFFECT",
  SET_CURRENT_TURN = "SET_CURRENT_TURN",
}

export interface SocketData {
  payload:
    | InitiativeObject
    | InitiativeObject[]
    | SpellObject
    | SpellObject[]
    | SessionData;
  sessionId: string;
  collectionType: CollectionTypes;
  docId?: string;
}
