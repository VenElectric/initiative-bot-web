import { Socket } from "socket.io-client";
import {
  CollectionTypes,
} from "../Interfaces/ContextEnums";
import { EmitTypes } from "../Interfaces/EmitTypes";
import { LoggingTypes } from "../Interfaces/LoggingTypes";

export type EmitGroup = LoggingTypes | EmitTypes


export async function emitData(
  socket: Socket,
  emit: EmitGroup,
  sessionId: string,
  callback: (data: any) => Promise<void>,
  payload: any,
  collectionType: CollectionTypes,
) {
  socket.emit(emit, {sessionId, payload, collectionType}, (data: any) => {
    callback(data);
  });
}
