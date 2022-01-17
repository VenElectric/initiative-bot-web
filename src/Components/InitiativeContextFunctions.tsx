import { emitData } from "../Utils/SocketEmit";
import { isSessionData } from "../services/server";
import {
  CollectionTypes,
  InitiativeContextEnums,
  InitiativeObjectEnums,
} from "../Interfaces/ContextEnums";
import { EmitTypes } from "../Interfaces/EmitTypes";
import { v4 as uuid_v4 } from "uuid";
import {
  InitiativeObject,
  StatusEffect,
  SpellObject,
  SetRecordType,
  InitiativeFunctionTypes,
  SetInitiativeType
} from "../Interfaces/initiative";
import {
  GetSetInitiativeContext,
  GetInitiativeContext,
  GetSetSortContext,
} from "../Context/InitiativeContext";
import { socket } from "../Context/SocketContext";
import { DiceRoll } from "rpg-dice-roller";
import { weapon_of_logging, errorCheck } from "../Utils/LoggingClass";
import { LoggingTypes } from "../Interfaces/LoggingTypes";
import InitiativeRecords from "./InitiativeRecords";
import { Dispatch, SetStateAction } from "react";


export default function InitiativeContextFunctions({sessionId}: {sessionId:string}) {
  const setInitiative = GetSetInitiativeContext();
  const initiativeList = GetInitiativeContext();
  const setSort =  GetSetSortContext()

  
  const initiativeFunctions: InitiativeFunctionTypes = {
    /* **/
    async [InitiativeContextEnums.ADD_INITIATIVE](e: any, sessionId: string) {
      let characterId = String(uuid_v4());
      let initiative: number = 0;
  
      // roll a dice if the user wants the bot to do it for them
      if (e.target[3].value === "0") {
        initiative = Number(e.target[2].value);
      }
      if (e.target[3].value === "1") {
        // this could cause issues if the person enters in a non-integer value for initiative modifier?
        let diceroll = new DiceRoll(`d20+${e.target[4].value}`);
        initiative = diceroll.total;
      }
      // construct the object
      let newData = {
        id: characterId,
        characterName: e.target[0].value,
        initiative: Number(initiative),
        initiativeModifier: Number(e.target[4].value),
        isCurrent: false,
        roundOrder: 0,
        isNpc: e.target[1].value,
        statusEffects: [],
      };
      let newState = [...initiativeList];
      newState.push(newData);
      if (setInitiative != null) {
        setInitiative(newState);
      }
      weapon_of_logging.INFO("sessionData", "none", newData, sessionId);
      // reset the form
  
      await emitData(
        socket,
        EmitTypes.CREATE_NEW,
        sessionId,
        async (data: any) => {
          weapon_of_logging.NOTICE(
            "Creat new initiative",
            "respose",
            data,
            sessionId
          );
        },
        newData,
        CollectionTypes.INITIATIVE
      );
    },
    /* Needs to be in initiative functions because I need the initiative context**/
    async [InitiativeContextEnums.ADD_STATUS_EFFECT](
      sessionId: string,
      spell: SpellObject,
      characterId: string
    ) {
      let newState = [...initiativeList];
      let recordIndex = newState
        .map((item: InitiativeObject) => item.id)
        .indexOf(characterId);
      newState[recordIndex].statusEffects.push({
        id: spell.id,
        spellName: spell.effectName,
        effectDescription: spell.effectDescription,
      });
      if (setInitiative !== undefined) {
        weapon_of_logging.NOTICE(
          InitiativeContextEnums.ADD_STATUS_EFFECT,
          "respose",
          newState,
          sessionId
        );
        setInitiative([...newState]);
      }
      await emitData(
        socket,
        EmitTypes.UPDATE_ONE,
        sessionId,
        async (data: any) => {
          weapon_of_logging.NOTICE(
            InitiativeContextEnums.ADD_STATUS_EFFECT,
            "respose",
            data,
            sessionId
          );
        },
        newState[recordIndex],
        CollectionTypes.INITIATIVE
      );
    },
    async [InitiativeContextEnums.DELETE_INITIATIVE](
      sessionId: string,
      dataId: string,
    ) {
      await emitData(
        socket,
        EmitTypes.DELETE_ONE,
        sessionId,
        async (data: any) => {
          if (setInitiative != null) {
            setInitiative(data);
          }
          weapon_of_logging.NOTICE(
            InitiativeContextEnums.DELETE_INITIATIVE,
            "respose",
            data,
            sessionId
          );
        },
        dataId,
        CollectionTypes.INITIATIVE
      );
      
    },
    async [InitiativeContextEnums.DISCORD_INITIATIVE](sessionId: string) {
      await emitData(
        socket,
        EmitTypes.DISCORD,
        sessionId,
        async (data: any) => {
          weapon_of_logging.NOTICE("Send to Discord", "respose", data, sessionId);
        },
        {},
        CollectionTypes.INITIATIVE
      );
    },
    async [InitiativeContextEnums.NEXT](sessionId: string) {
      await emitData(
        socket,
        EmitTypes.NEXT,
        sessionId,
        async (data: any) => {
          if (setInitiative !== undefined) {
            weapon_of_logging.NOTICE(
              InitiativeContextEnums.NEXT,
              "respose",
              data,
              sessionId
            );
            setInitiative(data);
          }
        },
        {},
        CollectionTypes.INITIATIVE
      );
    },
    async [InitiativeContextEnums.PREVIOUS](sessionId: string) {
      await emitData(
        socket,
        EmitTypes.PREVIOUS,
        sessionId,
        async (data: any) => {
          if (setInitiative !== undefined) {
            weapon_of_logging.NOTICE(
              InitiativeContextEnums.PREVIOUS,
              "respose",
              data,
              sessionId
            );
            setInitiative([...data]);
          }
        },
        {},
        CollectionTypes.INITIATIVE
      );
    },
    async [InitiativeContextEnums.REMOVE_STATUS_EFFECT](
      sessionId: string,
      spellId: string,
      characterId: string
    ) {
      let newState = [...initiativeList];
      let recordIndex = newState
        .map((item: InitiativeObject) => item.id)
        .indexOf(characterId);
      let spellIndex = newState[recordIndex].statusEffects
        .map((item: StatusEffect) => item.id)
        .indexOf(spellId);
      newState[recordIndex].statusEffects.splice(spellIndex, 1);
      if (setInitiative !== undefined) {
        weapon_of_logging.NOTICE(
          InitiativeContextEnums.REMOVE_STATUS_EFFECT,
          "add updated data",
          newState,
          sessionId
        );
        setInitiative([...newState]);
      }
      await emitData(
        socket,
        EmitTypes.UPDATE_ONE,
        sessionId,
        async (data: any) => {
          if (setInitiative !== undefined) {
            weapon_of_logging.NOTICE(
              InitiativeContextEnums.REMOVE_STATUS_EFFECT,
              "respose",
              data,
              sessionId
            );
            setInitiative([...data]);
          }
        },
        newState,
        CollectionTypes.INITIATIVE
      );
    },
    async [InitiativeContextEnums.RESORT](sessionId: string) {
      await emitData(
        socket,
        EmitTypes.RESORT,
        sessionId,
        async (data: any) => {
          if (setInitiative !== undefined) {
            weapon_of_logging.NOTICE(
              InitiativeContextEnums.RESORT,
              "respose",
              data,
              sessionId
            );
            setInitiative([...data]);
          }
        },
        {},
        CollectionTypes.INITIATIVE
      );
    },
    async [InitiativeContextEnums.RE_ROLL](sessionId: string, record: InitiativeObject) {
      let newRecord = { ...record };
      let diceroll = new DiceRoll(`d20+${newRecord.initiativeModifier}`);
      newRecord.initiative = diceroll.total;
      let newRecordIndex = initiativeList
        .map((item: InitiativeObject) => item.id)
        .indexOf(newRecord.id);
      let newState = [...initiativeList];
      newState[newRecordIndex] = { ...newRecord };
      if (setInitiative !== undefined) {
        setInitiative([...newState]);
      }
      await emitData(
        socket,
        EmitTypes.RE_ROLL,
        sessionId,
        async (data: any) => {
          weapon_of_logging.NOTICE(
            InitiativeContextEnums.RESORT,
            "respose",
            data,
            sessionId
          );
        },
        newRecord,
        CollectionTypes.INITIATIVE
      );
    },
    async [InitiativeContextEnums.ROUND_START](sessionId: string) {
      await emitData(
        socket,
        EmitTypes.ROUND_START,
        sessionId,
        async (data: any) => {
          if (setInitiative !== undefined && setSort !== undefined) {
            weapon_of_logging.NOTICE(
              InitiativeContextEnums.ROUND_START,
              "respose",
              data,
              sessionId
            );
            console.info(data)
            setInitiative(data);
            setSort(true)
            }
        },
        {},
        CollectionTypes.INITIATIVE
      );
    },
    async [InitiativeContextEnums.SET_CURRENT_TURN](
      sessionId: string,
      currentId: string) {
      let newState = [...initiativeList];
  
      for (let record in newState) {
        newState[record].isCurrent = false;
      }
  
      let newIndex = newState.map((item: InitiativeObject) => item.id).indexOf(currentId);
  
      newState[newIndex].isCurrent = true;
  
      if (setInitiative !== undefined) {
        setInitiative(newState);
      }
      // if (setRecord !== undefined){
      //   setRecord(newState[newIndex])
      // }
  
      await emitData(
        socket,
        EmitTypes.UPDATE_ALL,
        sessionId,
        async (data: any) => {
          weapon_of_logging.NOTICE(
            InitiativeContextEnums.SET_CURRENT_TURN,
            "respose",
            data,
            sessionId
          );
        },
        newState,
        CollectionTypes.INITIATIVE
      );
    },
    async [InitiativeContextEnums.UPDATE_INITIATIVE](
      sessionId: string,
      itemtoUpdate: InitiativeObjectEnums,
      initiative: InitiativeObject,
      setRecord: any,
      toUpdate: string | number | boolean | any
    ) {
      let newRecord = { ...initiative };
    
      switch (itemtoUpdate) {
        case InitiativeObjectEnums.initiativeModifier:
            newRecord.initiativeModifier = Number(toUpdate);
          break;
        case InitiativeObjectEnums.characterName:
          if (typeof itemtoUpdate == "string") {
            newRecord.characterName = toUpdate;
          }
          break;
        case InitiativeObjectEnums.initiative:
         
            newRecord.initiative = Number(toUpdate);
          break;
        case InitiativeObjectEnums.isNpc:
          if (typeof itemtoUpdate == "boolean") {
            newRecord.isNpc = toUpdate;
          }
          break;
        // case InitiativeObjectEnums.statusEffects:
        //   if (typeof itemtoUpdate == "object") {
        //     if (typeof itemtoUpdate == "number") {
        //       newRecord.statusEffects.push(toUpdate);
        //     }
        //   }
        //   break;
        // this I think needs to be its own function????
      }
      let newRecordIndex = initiativeList
        .map((item: InitiativeObject) => item.id)
        .indexOf(newRecord.id);
      let newState = [...initiativeList];
      newState[newRecordIndex] = { ...newRecord };
      if (setInitiative !== undefined) {
        weapon_of_logging.NOTICE(
          InitiativeContextEnums.UPDATE_INITIATIVE,
          "newState before emit",
          newState,
          sessionId
        );
        setInitiative([...newState]);
      }
      if (setRecord !== undefined){
        setRecord(newRecord)
      }
  
      await emitData(
        socket,
        EmitTypes.UPDATE_ONE,
        sessionId,
        async (data) => {
          weapon_of_logging.NOTICE(
            InitiativeContextEnums.UPDATE_INITIATIVE,
            "respose",
            data,
            sessionId
          );
        },
        newRecord,
        CollectionTypes.INITIATIVE
      );
    },
    [InitiativeContextEnums.UPDATE_ORDER](e: any,sessionId: string): void {
      console.log(e);
      setTimeout(async () => {
        let newState = [...initiativeList];
        for (let record in newState) {
          newState[record].roundOrder = Number(record) + 1;
        }
        if (setInitiative !== undefined) {
          weapon_of_logging.NOTICE(
            InitiativeContextEnums.UPDATE_ORDER,
            "respose",
            newState,
            sessionId
          );
          setInitiative([...newState]);
        }
        await emitData(
          socket,
          EmitTypes.UPDATE_ALL,
          sessionId,
          async (data) => {
            weapon_of_logging.NOTICE(
              InitiativeContextEnums.UPDATE_ORDER,
              "respose",
              data,
              sessionId
            );
          },
          newState,
          CollectionTypes.INITIATIVE
        );
      }, 3000);
  
      
    },
  };
  return (
    <div>
      <InitiativeRecords contextFunctions={initiativeFunctions} sessionId={sessionId} />
    </div>
  )
}



