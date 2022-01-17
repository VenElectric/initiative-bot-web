import { Socket } from "socket.io-client";
import { Ref } from "vue";
import {
  InitiativeObject,
  ISessionData,
  SpellObject,
} from "../interfaces/initiative";

export enum SessionFunctionTypes {
  GET_INITIAL = "GET_INITIAL",
  NEXT = "NEXT",
  PREVIOUS = "PREVIOUS",
  ROUND_START = "ROUND_START",
  EDIT = "EDIT",
  DELETE_DATA = "DELETE_DATA",
  CREATE_NEW = "CREATE_NEW",
  RE_ROLL = "RE_ROLL",
}

export enum collectionTypes {
  INITIATIVE = "initiative",
  SPELLS = "spells",
  ALL = "all",
}

type PayloadType = InitiativeObject | SpellObject | ISessionData | string;

function isISessionData(payload: PayloadType): payload is ISessionData {
  if (payload as ISessionData) {
    return true;
  } else {
    return false;
  }
}

function isIInit(payload: PayloadType): payload is InitiativeObject {
  if (payload as InitiativeObject) {
    return true;
  } else {
    return false;
  }
}

function isSpellLIst(payload: PayloadType): payload is SpellObject {
  if (payload as SpellObject) {
    return true;
  } else {
    return false;
  }
}

// async function emitData(
//   socket: Ref<Socket>,
//   emit: SessionFunctionTypes,
//   sessionId: string,
//   callback: (data: PayloadType) => void,
//   payload?: PayloadType,
//   collectionType?: collectionTypes
// ): Promise<void> {
//   socket.value.emit(
//     emit,
//     payload ? { payload, sessionId, collectionType } : sessionId,
//     (responseData: PayloadType) => {
//       callback(responseData);
//     }
//   );
// }

// export const sessionFunctions = {
//   async [SessionFunctionTypes.GET_INITIAL](
//     socket: Ref<Socket>,
//     sessionId: string
//   ): Promise<void> {
//     await emitData(
//       socket,
//       SessionFunctionTypes.GET_INITIAL,
//       sessionId,
//       (data) => {
//         if (isISessionData(data)) {
//           data.spellList.forEach((spell: SpellList) => {
//             localStorage.setItem(
//               `dungeonbot-session-${sessionId}-spell-${spell.id}`,
//               JSON.stringify(spell)
//             );
//           });
//           data.initiativeList.forEach((initiative: IInit) => {
//             localStorage.setItem(
//               `dungeonbot-session-${sessionId}-initiative-${initiative.id}`,
//               JSON.stringify(initiative)
//             );
//           });
//         }
//       }
//     );
//   },
//   async [SessionFunctionTypes.NEXT](
//     socket: Ref<Socket>,
//     sessionId: string
//   ): Promise<void> {
//     await emitData(
//       socket,
//       SessionFunctionTypes.NEXT,
//       sessionId,
//       (data: PayloadType) => {
//         if (isIInit(data)) {
//           console.log(data);
//         }
//       }
//     );
//   },
//   async [SessionFunctionTypes.PREVIOUS](
//     socket: Ref<Socket>,
//     sessionId: string
//   ): Promise<void> {
//     await emitData(
//       socket,
//       SessionFunctionTypes.PREVIOUS,
//       sessionId,
//       (data: PayloadType) => {
//         if (isIInit(data)) {
//           console.assert(true);
//           console.log(data);
//         }
//       }
//     );
//   },
//   async [SessionFunctionTypes.ROUND_START](
//     socket: Ref<Socket>,
//     sessionId: string
//   ): Promise<void> {
//     await emitData(
//       socket,
//       SessionFunctionTypes.ROUND_START,
//       sessionId,
//       (data: PayloadType) => {
//         console.log(data);
//       }
//     );
//   },
//   async [SessionFunctionTypes.EDIT](
//     socket: Ref<Socket>,
//     sessionId: string,
//     collectionType: collectionTypes,
//     payload: ISessionData
//   ): Promise<void> {
//     await emitData(
//       socket,
//       SessionFunctionTypes.EDIT,
//       sessionId,
//       (data: PayloadType) => {
//         console.log(data);
//       },
//       payload,
//       collectionType
//     );
//   },
//   async [SessionFunctionTypes.DELETE_DATA](
//     socket: Ref<Socket>,
//     sessionId: string,
//     collectionType: collectionTypes,
//     dataId: string
//   ): Promise<void> {
//     await emitData(
//       socket,
//       SessionFunctionTypes.DELETE_DATA,
//       sessionId,
//       (data: PayloadType) => {
//         console.log(data);
//       },
//       dataId,
//       collectionType
//     );
//   },
//   async [SessionFunctionTypes.CREATE_NEW](
//     socket: Ref<Socket>,
//     sessionId: string,
//     collectionType: collectionTypes,
//     payload: IInit | SpellList
//   ): Promise<void> {
//     await emitData(
//       socket,
//       SessionFunctionTypes.CREATE_NEW,
//       sessionId,
//       (data: PayloadType) => {
//         console.log(data);
//       },
//       payload,
//       collectionType
//     );
//   },
//   async [SessionFunctionTypes.RE_ROLL](
//     socket: Ref<Socket>,
//     sessionId: string,
//     collectionType: collectionTypes,
//     dataId: string
//   ): Promise<void> {
//     await emitData(
//       socket,
//       SessionFunctionTypes.RE_ROLL,
//       sessionId,
//       (data: PayloadType) => {
//         console.log(data);
//       },
//       dataId,
//       collectionType
//     );
//   },
// };
