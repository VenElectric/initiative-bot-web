import { LoggingTypes } from "../Interfaces/LoggingTypes";
import store from "../data/store";
const socket = store.store.socket;

export default function serverLogger(
  level: LoggingTypes,
  message: string,
  fnName: string,
  itemId?: string
): void {
  socket.emit(level, { message: message, function: fnName, itemId: itemId });
}
