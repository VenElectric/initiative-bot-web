export enum EmitTypes {
    GET_INITIAL = "GET_INITIAL",
    NEXT = "NEXT",
    PREVIOUS = "PREVIOUS",
    ROUND_START = "ROUND_START",
    UPDATE_ONE = "UPDATE_ONE",
    UPDATE_ALL = "UPDATE_ALL",
    DELETE_ONE = "DELETE_ONE",
    DELETE_ALL = "DELETE_ALL",
    CREATE_NEW = "CREATE_NEW",
    RE_ROLL = "RE_ROLL",
    RESORT = "RESORT",
    DISCORD = "DISCORD",
    REMOVE_STATUS_EFFECT = "REMOVE_STATUS_EFFECT",
    ADD_STATUS_EFFECT = "ADD_STATUS_EFFECT"
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
  SET_CURRENT_TURN = "SET_CURRENT_TURN"
}