import {
  CharacterStatus,
  CharacterStatusFirestore,
  InitiativeObject,
  SessionData,
  SpellObject,
  CharacterStatusDouble,
  ServerSpellObject,
} from "../Interfaces/initiative";
import { LoggingTypes } from "../Interfaces/LoggingTypes";
import serverLogger from "./LoggingClass";

type PayloadType = InitiativeObject | SpellObject | SessionData | string;

export function isSessionData(payload: any): payload is SessionData {
  if (payload as SessionData) {
    serverLogger(LoggingTypes.debug, `payload is SessionData`, "isSessionData");
    return true;
  } else {
    serverLogger(
      LoggingTypes.debug,
      `payload is not sessiondata`,
      "isSessionData"
    );
    return false;
  }
}

export function isInitiativeObject(payload: any): payload is InitiativeObject {
  if (payload as InitiativeObject) {
    serverLogger(
      LoggingTypes.debug,
      `payload is InitiativeObject`,
      "isInitiativeObject"
    );
    return true;
  } else {
    serverLogger(
      LoggingTypes.debug,
      `payload is not InitiativeObject`,
      "isInitiativeObject"
    );
    return false;
  }
}

export function isSpellObject(payload: any): payload is SpellObject {
  if (payload as SpellObject) {
    serverLogger(LoggingTypes.debug, `payload is SpellObject`, "isSpellObject");
    return true;
  } else {
    serverLogger(
      LoggingTypes.debug,
      `payload is not SpellObject`,
      "isSpellObject"
    );
    return false;
  }
}

export function isServerSpellObject(
  payload: any
): payload is ServerSpellObject {
  if (payload as ServerSpellObject) {
    serverLogger(LoggingTypes.debug, `payload is SpellObject`, "isSpellObject");
    return true;
  } else {
    serverLogger(
      LoggingTypes.debug,
      `payload is not SpellObject`,
      "isSpellObject"
    );
    return false;
  }
}

export function isInitiativeObjectArray(
  payload: any
): payload is InitiativeObject[] {
  if (payload as InitiativeObject[]) {
    serverLogger(
      LoggingTypes.debug,
      `payload is InitiativeObject[]`,
      "isInitiativeObject[]"
    );
    return true;
  } else {
    serverLogger(
      LoggingTypes.debug,
      `payload is not InitiativeObject[]`,
      "isInitiativeObject[]"
    );
    return false;
  }
}

export function isSpellObjectArray(payload: any): payload is SpellObject[] {
  if (payload as SpellObject[]) {
    serverLogger(
      LoggingTypes.debug,
      `payload is SpellObject[]`,
      "isSpellObject[]"
    );
    return true;
  } else {
    serverLogger(
      LoggingTypes.debug,
      `payload is not SpellObject[]`,
      "isSpellObject[]"
    );
    return false;
  }
}

export function isServerObjectArray(
  payload: any
): payload is ServerSpellObject[] {
  if (payload as ServerSpellObject[]) {
    serverLogger(
      LoggingTypes.debug,
      `payload is  ServerSpellObject[]`,
      "is ServerSpellObject[]"
    );
    return true;
  } else {
    serverLogger(
      LoggingTypes.debug,
      `payload is not ServerSpellObject[]t`,
      "is ServerSpellObject[]"
    );
    return false;
  }
}

export function isObjectArray(
  payload: any
): payload is CharacterStatusFirestore {
  if (payload as CharacterStatusFirestore) {
    serverLogger(
      LoggingTypes.debug,
      `payload is CharacterStatusFirestoret`,
      "isCharacterStatusFirestore"
    );
    return true;
  } else {
    serverLogger(
      LoggingTypes.debug,
      `payload is not CharacterStatusFirestore`,
      "isCharacterStatusFirestore"
    );
    return false;
  }
}

export function isDoubleArray(payload: any): payload is CharacterStatus[][] {
  if (payload as CharacterStatus[][]) {
    serverLogger(
      LoggingTypes.debug,
      `payload is  CharacterStatus[][]`,
      "is CharacterStatus[][]"
    );
    return true;
  } else {
    serverLogger(
      LoggingTypes.debug,
      `payload is not  CharacterStatus[][]`,
      "is CharacterStatus[][]"
    );
    return false;
  }
}
