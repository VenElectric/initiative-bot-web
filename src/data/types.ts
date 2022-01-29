import { Ref } from "vue";
import {
  CharacterStatus,
  InitiativeObject,
  SpellObject,
} from "../Interfaces/initiative";
import { Socket } from "socket.io-client";
import {
  PickListMoveAllToSourceEvent,
  PickListMoveToSourceEvent,
  PickListSelectionChangeEvent,
} from "primevue/picklist";

export interface IData {
  initiativeList: InitiativeObject[];
  isSorted: boolean;
  spells: SpellObject[];
  sessionId: string;
  socket: Socket;
}

export interface Character {
  characterName: string;
  initiativeModifier: number;
  initiative: number;
}

export interface CharacterPickListEvent extends PickListMoveAllToSourceEvent {
  items: CharacterStatus[];
}

export interface IStore {
  store: IData;
  getInitial: () => void;
  updateId: (id: string) => void;
  updateCharacter: (ObjectType: string, toUpdate: any, docId: string) => void;
  addCharacter: (data: Character, roll: boolean, npc: boolean) => void;
  removeCharacter: (index: number, id: string) => void;
  getInitialSpells: () => void;
  addSpell: (data: any) => void;
  startDrag: (evt: DragEvent, index: number) => void;
  dragOver: (evt: DragEvent) => void;
  dragEnter: (evt: DragEvent) => void;
  onDrop: (evt: DragEvent, index: number) => void;
  updateSpell: (data: {
    effectName: string;
    effectDescription: string;
    durationTime: number;
    durationType: string;
    index: number;
  }) => void;
  changeAllCharacterStatus: (index: number, moveTo: string) => void;
  changeOneCharacterStatus: (
    e: CharacterPickListEvent,
    index: number,
    moveTo: string
  ) => void;
  roundStart: () => void;
  getInitiative: () => InitiativeObject[];
  getSpells: () => SpellObject[];
  getSorted: () => boolean;
  reSort: () => void;
  setCurrent: () => void;
}
