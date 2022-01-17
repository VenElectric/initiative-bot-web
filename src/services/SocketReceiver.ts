import { Socket } from "socket.io-client";
import {
  InitiativeObject,
  SpellObject,
  SetInitiativeType,
  SetSpellType,
} from "../Interfaces/initiative";
import {
  CollectionTypes,
  InitiativeContextEnums,
  InitiativeObjectEnums,
  SpellContextEnums,
  SpellObjectEnums,
} from "../Interfaces/ContextEnums";
import { EmitTypes } from "../Interfaces/EmitTypes";
import { returnNewState } from "../Utils/Utilities";
import {
  isSpellObject,
  isSpellObjectArray,
  isInitiativeObject,
  isInitiativeObjectArray,
} from "./server";
import { weapon_of_logging } from "../Utils/LoggingClass";

const initiativeError = `Type of data is not of InitiativeObject or InitiativeObject Array`;
const spellError = `Type of data is not of SpellObject or SpellObject Array`;

function spellState(
  state: SpellObject[],
  setState: SetSpellType,
  data: SpellObject | SpellObject[]
) {
  weapon_of_logging.DEBUG("spellState", "enterting SpellState function",state,"")
  if (!isSpellObject(data) || !isSpellObjectArray(data)) {
    weapon_of_logging.NOTICE("TypeError", spellError,{state:state, data:data},"")
    return;
  }
  if (isSpellObject(data)) {
    let newState = returnNewState(state) as SpellObject[];
    newState.push(data);
    setState([...newState]);
    // weapon_of_logging.INFO("spellState complete")
  }
  if (isSpellObjectArray(data)) {
    setState([...data]);
  }
}

function initiativeState(
  state: InitiativeObject[],
  setState: SetInitiativeType,
  data: InitiativeObject | InitiativeObject[]
) {
  if (!isInitiativeObject(data) || !isInitiativeObjectArray(data)) {
    weapon_of_logging.NOTICE("TypeError", spellError,{state:state, data:data},"")
    return;
  }
  if (isInitiativeObject(data)) {
    let newState = returnNewState(state) as InitiativeObject[];
    newState.push(data);
    setState([...newState]);
  }
  if (isInitiativeObjectArray(data)) {
    setState([...data]);
  }
}

export function spellReceiver(
  socket: Socket,
  setSpell: SetSpellType,
  spells: SpellObject[],
  sessionId: string
) {
  socket.on(
    EmitTypes.UPDATE_ONE,
    async function (data: SpellObject, respond: any) {
      try {
        spellState(spells, setSpell, data);
        respond(200);
      } catch (error) {
        if (error instanceof Error) {
          weapon_of_logging.ERROR(
            error.name,
            error.message,
            error.stack,
            data,
            sessionId
          );
          respond(error);
        }
      }
    }
  );
  socket.on(
    EmitTypes.UPDATE_ALL,
    async function (data: SpellObject[], respond: any) {
      try {
        spellState(spells, setSpell, data);
        respond(200);
      } catch (error) {
        if (error instanceof Error) {
          weapon_of_logging.ERROR(
            error.name,
            error.message,
            error.stack,
            data,
            sessionId
          );
          respond(error);
        }
      }
    }
  );
}
export function initiativeReceiver(
  socket: Socket,
  setInitiative: SetInitiativeType,
  initiativeList: InitiativeObject[],
  sessionId: string
) {
  socket.on(
    EmitTypes.UPDATE_ONE,
    async function (data: InitiativeObject, respond: any) {
      try {
        initiativeState(initiativeList, setInitiative, data);
        respond(200);
      } catch (error) {
        if (error instanceof Error) {
          weapon_of_logging.ERROR(
            error.name,
            error.message,
            error.stack,
            data,
            sessionId
          );
          respond(error);
        }
      }
    }
  );
  socket.on(
    EmitTypes.UPDATE_ALL,
    async function (data: InitiativeObject[], respond: any) {
      try {
        initiativeState(initiativeList, setInitiative, data);
        respond(200)
      } catch (error) {
        if (error instanceof Error) {
          weapon_of_logging.ERROR(
            error.name,
            error.message,
            error.stack,
            data,
            sessionId
          );
          respond(error);
        }
      }
    }
  );
}
