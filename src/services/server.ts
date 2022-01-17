import { Socket } from "socket.io-client";
import { InitiativeObject, SessionData, SpellObject } from "../Interfaces/initiative";
import { EmitTypes } from "../Interfaces/EmitTypes";
import { InitiativeContextEnums, CollectionTypes, PayloadType} from "../Interfaces/ContextEnums";
import {emitData} from "../Utils/SocketEmit";

export function isSessionData(payload: any) {
  console.info(payload, "payload")
  if (payload as SessionData) {
    return true;
  } else {
    return false;
  }
}

export function isInitiativeObject(payload: any): payload is InitiativeObject {
  if (payload as InitiativeObject) {
    return true;
  } else {
    return false;
  }
}

export function isSpellObject(payload: any): payload is SpellObject {
  if (payload as SpellObject) {
    return true;
  } else {
    return false;
  }
}

export function isInitiativeObjectArray(payload: any): payload is InitiativeObject[] {
  if (payload as InitiativeObject[]) {
    return true;
  } else {
    return false;
  }
}

export function isSpellObjectArray(payload: any): payload is SpellObject[] {
  if (payload as SpellObject[]) {
    return true;
  } else {
    return false;
  }
}

export function collectionequalsObject(collection:CollectionTypes, item: InitiativeObject | SpellObject) {
  if (collection === CollectionTypes.INITIATIVE){
    return isInitiativeObject(item);
  }
  if (collection === CollectionTypes.SPELLS){
    return isSpellObject(item);
  }
}


// KEEP FOR NOW. DELETE LATER IF NOT NEEDED
// export const sessionFunctions = {
//   async [InitiativeContextEnums.INITIAL_INIT](
//     socket: Socket,
//     sessionId: string
//   ): Promise<void> {
//     socket.emit(
//       EmitTypes.GET_INITIAL,
//       {sessionId: sessionId,collectionType: InitiativeContextEnums},
//       (data: ISessionData) => {
//         console.log(data)
//         if (isISessionData(data)) {
//           let dataIds: string[] = [];
//           data.initiativeList.forEach((initiative: IInit) => {
//             localStorage.setItem(
//               `dungeonbot-session-${sessionId}-initiative-${initiative.id}`,
//               JSON.stringify(initiative)
//             );
//             dataIds.push(initiative.id)
//           });
//           localStorage.setItem(`dungeonbot-session-${sessionId}-initiative`, JSON.stringify(dataIds))
//           localStorage.setItem(`dungeonbot-session-${sessionId}-isSorted`,JSON.stringify(data.isSorted))
//         }
//       }
//     );
//   },
//   async [SessionFunctionTypes.GET_INITIAL_SPELLS](
//     socket: Socket,
//     sessionId: string
//   ): Promise<void> {
//     socket.emit(
//       EmitTypes.GET_INITIAL,
//      sessionId,
//       (data: SpellList) => {
//         if (isSpellLIst(data)) {
//           let dataIds: string[] = [];
//           data.forEach((spell: SpellList) => {
//             localStorage.setItem(
//               `dungeonbot-session-${sessionId}-spell-${spell.id}`,
//               JSON.stringify(spell)
//             );
//             dataIds.push(spell.id)
//           });
//           localStorage.setItem(`dungeonbot-session-${sessionId}-spells`, JSON.stringify(dataIds))
//         }
//       },
//     );
//   },
//   async [SessionFunctionTypes.NEXT](
//     socket: Socket,
//     sessionId: string
//   ): Promise<void> {
//     emitData(
//       socket,
//       EmitTypes.NEXT,
//       sessionId,
//       (data:any) => {
//         if (isIInit(data)) {
//           console.log(data);
//         }
//         return data;
//       }
//     );
//   },
//   async [SessionFunctionTypes.PREVIOUS](
//     socket: Socket,
//     sessionId: string
//   ): Promise<void> {
//     await emitData(
//       socket,
//       EmitTypes.PREVIOUS,
//       sessionId,
//       (data: any) => {
//         if (isIInit(data)) {
//           console.assert(true);
//           console.log(data);
//         }
//         return data;
//       }
//     );
//   },
//   async [SessionFunctionTypes.ROUND_START](
//     socket: Socket,
//     sessionId: string
//   ): Promise<void> {
//     await emitData(
//       socket,
//       EmitTypes.ROUND_START,
//       sessionId,
//       async (data) => {
//         if (isIInit(data)) {
//           console.assert(true);
//           console.log(data);
//         }
//         return data;
//       }
//     );
//   },
//   async [SessionFunctionTypes.EDIT](
//     socket: Socket,
//     sessionId: string,
//     collectionType: collectionTypes,
//     payload: ISessionData
//   ): Promise<void> {
//     await emitData(
//       socket,
//       EmitTypes.UPDATE_ONE,
//       sessionId,
//       async (data) => {
//         if (isIInit(data)) {
//           console.assert(true);
//           console.log(data);
//         }
//         return data;
//       },
//       payload,
//       collectionType
//     );
//   },
//   async [SessionFunctionTypes.DELETE_DATA](
//     socket: Socket,
//     sessionId: string,
//     collectionType: collectionTypes,
//     dataId: string
//   ): Promise<void> {
//     await emitData(
//       socket,
//       EmitTypes.DELETE_ONE,
//       sessionId,
//       async (data) => {
//         if (isIInit(data)) {
//           console.assert(true);
//           console.log(data);
//         }
//         return data;
//       },
//       dataId,
//       collectionType
//     );
//   },
//   async [SessionFunctionTypes.CREATE_NEW](
//     socket: Socket,
//     sessionId: string,
//     collectionType: collectionTypes,
//     payload: IInit | SpellList
//   ): Promise<void> {
//     console.log(sessionId)
//     emitData(
//       socket,
//      EmitTypes.CREATE_NEW,
//       sessionId,
//       async (data) => {
//       console.log(data)
//       },
//       payload,
//       collectionType
//     );
//   },
//   async [SessionFunctionTypes.RE_ROLL](
//     socket: Socket,
//     sessionId: string,
//     collectionType: collectionTypes,
//     dataId: string
//   ): Promise<void> {
//     await emitData(
//       socket,
//       EmitTypes.RE_ROLL,
//       sessionId,
//       async (data) => {
//         if (isIInit(data)) {
//           console.assert(true);
//           console.log(data);
//         }
//         return data;
//       },
//       dataId,
//       collectionType
//     );
//   },
// };
