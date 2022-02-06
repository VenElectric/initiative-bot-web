import { Ref } from "vue";
import {
  CharacterStatus,
  InitiativeObject,
  SpellObject,
  CharacterStatusFirestore,
} from "../Interfaces/initiative";
import { Socket } from "socket.io-client";
import {
  PickListMoveAllToSourceEvent,
  PickListMoveToSourceEvent,
  PickListSelectionChangeEvent,
} from "primevue/picklist";
import {
  CollectionTypes,
  InitiativeObjectEnums,
  SpellObjectEnums,
} from "../Interfaces/ContextEnums";

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
  updateCharacterItem: (
    ObjectType: InitiativeObjectEnums,
    toUpdate: any,
    index: number,
    emit: boolean,
    docId?: string
  ) => void;
  updateCharacterRecord: (
    initiative: InitiativeObject,
    isReset: boolean
  ) => void;
  addCharacter: (data: Character, roll: boolean, npc: boolean) => void;
  removeCharacter: (index: number, id: string, emit: boolean) => void;
  getInitialSpells: () => void;
  addSpell: (data: any) => void;
  startDrag: (evt: DragEvent, index: number) => void;
  dragOver: (evt: DragEvent) => void;
  dragEnter: (evt: DragEvent) => void;
  onDrop: (evt: DragEvent, index: number) => void;
  updateSpell: (
    effectName: string,
    effectDescription: string,
    durationTime: number,
    durationType: string,
    index: number,
    emit: boolean,
    characterIds?: CharacterStatus[][]
  ) => void;
  updateSpellItem: (
    ObjectType: SpellObjectEnums,
    toUpdate: any,
    index: number
  ) => void;
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
  nextTurn: () => void;
  previousTurn: () => void;
  toDiscord: (collectionType: CollectionTypes) => void;
  roomSetup: () => void;
  updateAll: (
    collectionType: CollectionTypes,
    data: InitiativeObject[] | SpellObject[]
  ) => void;
  removeSpell: (index: number, id: string, emit: boolean) => void;
  spellsDoubleArray: (payload: CharacterStatusFirestore) => CharacterStatus[][];
  resetAll: (emit: boolean) => void;
  reRoll: (index: number) => void;
  alltoFalse: () => void;
  updateSorted: (isSorted: boolean) => void;
  resetSpells: (emit: boolean) => void;
  resetInitiative: (emit: boolean) => void;
}
