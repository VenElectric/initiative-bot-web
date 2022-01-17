import {
  CollectionTypes,
  SpellContextEnums,
  SpellObjectEnums,
} from "../Interfaces/ContextEnums";
import { emitData } from "../Utils/SocketEmit";
import { EmitTypes } from "../Interfaces/EmitTypes";
import { CharacterStatus,InitiativeObject, SpellObject, StatusEffect } from "../Interfaces/initiative";
import { socket } from "./SocketContext";
import { v4 as uuid_v4 } from "uuid";
import { weapon_of_logging, errorCheck } from "../Utils/LoggingClass";
import { isSpellObject, isSpellObjectArray } from "../services/server";
import { LoggingTypes } from "../Interfaces/LoggingTypes";
import { GetSpellContext, GetSetSpellContext } from "./SpellContext";
import { GetSetInitiativeContext, GetInitiativeContext } from "./InitiativeContext";
import {setSpellStatus} from "../Utils/Utilities";

const spells = GetSpellContext();
const setSpells = GetSetSpellContext();
const initiativeList = GetInitiativeContext();
const setInitiative = GetSetInitiativeContext();

function characterList(){
  let characters = [] as CharacterStatus[];
  for (let record of initiativeList) {
    characters.push({characterId: record.id, characterName: record.characterName, isAffected: false})
  }
  return characters;
}

export const SpellContextFunctions = {
  async [SpellContextEnums.INITIAL_SPELLS](
    sessionId: string
  ): Promise<SpellObject[]> {
    let spellArray: SpellObject[] = [];

    try {
      await emitData(socket, EmitTypes.GET_INITIAL, sessionId, async (data) => {
        if (isSpellObjectArray(data)) {
          let dataIds: string[] = [];
          data.forEach((spell: SpellObject) => {
            localStorage.setItem(
              `dungeonbot-session-${sessionId}-spell-${spell.id}`,
              JSON.stringify(spell)
            );
            dataIds.push(spell.id);
            spellArray.push(spell);
          });
          localStorage.setItem(
            `dungeonbot-session-${sessionId}-spells`,
            JSON.stringify(dataIds)
          );
        }
      }, {},CollectionTypes.SPELLS);
    } catch (error) {
      errorCheck(error, { spellArray: spellArray }, sessionId, [
        LoggingTypes.ERROR,
        LoggingTypes.DEBUG,
      ]);
    }
    return Promise.resolve(spellArray);
  },
  async [SpellContextEnums.ADD_SPELL](sessionId: string, e: any) {
    let spellId = String(uuid_v4());


    let newSpell = {
      id: spellId,
      effectName: e.target[0].value,
      effectDescription: e.target[1].value,
      durationTime: Number(e.target[2].value),
      durationType: Number(e.target[3].value),
      characterIds: characterList(),
    };

    let newState = [...spells];
    newState.push(newSpell);
    if (setSpells != null) {
      setSpells(newState);
    }
    try {
      await emitData(
        socket,
        EmitTypes.CREATE_NEW,
        sessionId,
        async (data: any) => {
          weapon_of_logging.NOTICE(
            SpellContextEnums.ADD_SPELL,
            "none",
            { newSpell: newSpell, data: data },
            sessionId
          );
        }
        , {},CollectionTypes.SPELLS);
    } catch (error) {
      errorCheck(error, newSpell, sessionId, [
        LoggingTypes.DEBUG,
        LoggingTypes.CRITICAL,
      ]);
    }
  },
  async [SpellContextEnums.DELETE_SPELL](sessionId: string, spellId: string) {
    try {
      await emitData(
        socket,
        EmitTypes.DELETE_ONE,
        sessionId,
        async (data: any) => {
          if (setSpells != null) {
            setSpells(data.spells);
          }
          if (setInitiative != null){
            setInitiative(data.initiative)
          }
          weapon_of_logging.NOTICE(
            SpellContextEnums.ADD_SPELL,
            "none",
            data,
            sessionId
          );
        },
        spellId,
        CollectionTypes.SPELLS
      );
    } catch (error) {
      errorCheck(error, spellId, sessionId, [
        LoggingTypes.DEBUG,
        LoggingTypes.CRITICAL,
      ]);
    }
  },
  async [SpellContextEnums.UPDATE_SPELL](
    sessionId: string,
    itemtoUpdate: SpellObjectEnums,
    spell: SpellObject,
    toUpdate: string | number | boolean | any
  ) {
    let newRecord = { ...spell };

    switch (itemtoUpdate) {
      case SpellObjectEnums.durationTime:
        if (typeof itemtoUpdate == "number") {
          newRecord.durationTime = toUpdate;
        }
        break;
      case SpellObjectEnums.durationType:
        if (typeof itemtoUpdate == "number") {
          newRecord.durationType = toUpdate;
        }
        break;
      case SpellObjectEnums.effectDescription:
        if (typeof itemtoUpdate == "string") {
          newRecord.effectDescription = toUpdate;
        }
        break;
      case SpellObjectEnums.effectName:
        if (typeof itemtoUpdate == "string") {
          newRecord.effectName = toUpdate;
        }
        break;
    }
    let newRecordIndex = spells
      .map((item: SpellObject) => item.id)
      .indexOf(newRecord.id);
    let newState = [...spells];
    newState[newRecordIndex] = { ...newRecord };
    if (setSpells !== undefined) {
      weapon_of_logging.NOTICE(
        SpellContextEnums.UPDATE_SPELL,
        "newState before emit",
        newState,
        sessionId
      );
      setSpells([...newState]);
    }

    await emitData(
      socket,
      EmitTypes.UPDATE_ONE,
      sessionId,
      async (data) => {
        weapon_of_logging.NOTICE(
          SpellContextEnums.UPDATE_SPELL,
          "respose",
          data,
          sessionId
        );
      },
      newRecord,
      CollectionTypes.SPELLS
    );
  },
  async [SpellContextEnums.ADD_CHARACTER](sessionId: string, characterId: string, spellId: string) {
    let spellState = [...spells];
    let spellIndex = spellState
      .map((item: SpellObject) => item.id)
      .indexOf(spellId);
    let characterIndex = spellState[spellIndex].characterIds.map((item:CharacterStatus) => item.characterId).indexOf(characterId)
    spellState[spellIndex].characterIds[characterIndex].isAffected = true;
    // let initiativeState = [...initiativeList]
    // let initiativeIndex = initiativeState.map((item: InitiativeObject) => item.id).indexOf(characterId)
    // let options = setInitiativeStatus(spellState[spellIndex].effectName,spellState[spellIndex].id,spellState[spellIndex].effectDescription)
    // initiativeState[initiativeIndex].statusEffects.push(options)
    // make sure that functions are not using the record/set record. I don't think they are
   
    if (setSpells !== undefined) {
      weapon_of_logging.NOTICE(
        SpellContextEnums.ADD_CHARACTER,
        "respose",
        spellState,
        sessionId
      );
      setSpells([...spellState]);
    }
    await emitData(
      socket,
      EmitTypes.ADD_STATUS_EFFECT,
      sessionId,
      async (data: any) => {
        weapon_of_logging.NOTICE(
            SpellContextEnums.ADD_CHARACTER,
          "respose",
          data,
          sessionId
        );
      },
      spellState[spellIndex],
      CollectionTypes.INITIATIVE
    );
  },
  async [SpellContextEnums.REMOVE_CHARACTER](sessionId: string, characterId: string, spellId: string) {
    let newState = [...spells];
    let recordIndex = newState
      .map((item: SpellObject) => item.id)
      .indexOf(spellId);
    let spellIndex = newState[recordIndex].characterIds
      .map((item: CharacterStatus) => item.characterId)
      .indexOf(characterId);
    newState[recordIndex].characterIds.splice(spellIndex, 1);
    if (setSpells !== undefined) {
      weapon_of_logging.NOTICE(
        SpellContextEnums.REMOVE_CHARACTER,
        "add updated data",
        newState,
        sessionId
      );
      setSpells([...newState]);
    }
    await emitData(
      socket,
      EmitTypes.REMOVE_STATUS_EFFECT,
      sessionId,
      async (data: any) => {
        if (setSpells !== undefined) {
          weapon_of_logging.NOTICE(
            SpellContextEnums.REMOVE_CHARACTER,
            "respose",
            data,
            sessionId
          );
          setSpells([...data]);
        }
      },
      newState,
      CollectionTypes.INITIATIVE
    );
  },
  async [SpellContextEnums.DISCORD_SPELLS](sessionId: string) {
    await emitData(
        socket,
        EmitTypes.DISCORD,
        sessionId,
        async (data: any) => {
          weapon_of_logging.NOTICE("Send to Discord", "respose", data, sessionId);
        },
        {},
        CollectionTypes.SPELLS
      );
  },
};
