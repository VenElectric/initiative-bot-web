import { Socket } from "socket.io-client";
import { InitiativeObject } from "../interfaces/initiative";
import { socketStore } from "../state/socket";

export function InitiativeReceiver(
  socket: Socket,
  initiativeList: InitiativeObject[]
): void {
  socket.on("GET_INITIAL_INIT", (data: InitiativeObject[]) => {
    return (initiativeList = [...data]);
  });
}
