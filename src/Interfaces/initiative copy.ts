import { InitiativeContextEnums, InitiativeObjectEnums } from "./ContextEnums";
export interface StatusEffect {
  spellName: string;
  id: string;
  effectDescription: string;
}

export interface CharacterStatus {
  characterId: string;
  characterName: string;
  isAffected: boolean;
}

export interface InitiativeObject {
  id: string;
  characterName: string;
  initiative: number;
  initiativeModifier: number;
  roundOrder: number;
  isCurrent: boolean;
  statusEffects: StatusEffect[];
  isNpc: boolean;
}

export interface SpellObject {
  durationTime: number;
  durationType: number;
  effectName: string;
  effectDescription: string;
  id: string;
  characterIds: CharacterStatus[];
}

export interface SessionData {
  onDeck: number;
  isSorted: boolean;
  initiativeList: InitiativeObject[];
  SpellObject: SpellObject[];
  sessionId: string;
}

export interface TargetData {
  id: string;
  name: string;
  status_effects: StatusEffect[] | [];
}

export type SetInitiativeType = (initiativeList: InitiativeObject[]) => void;
export type SetSpellType = (spells: SpellObject[]) => void;
export type SetSortType = (isSorted: boolean) => void;
export type SetRecordType = (record: InitiativeObject | SpellObject) => void;

// export interface InitiativeFunctionTypes {
//   /* **/
//   [InitiativeContextEnums.ADD_INITIATIVE](e: any, sessionId: string): Promise<void>;
//   /* Needs to be in initiative functions because I need the initiative context**/
//   [InitiativeContextEnums.ADD_STATUS_EFFECT](
//     sessionId: string,
//     spell: SpellObject,
//     characterId: string
//   ): Promise<void>;
//   [InitiativeContextEnums.DELETE_INITIATIVE](
//     sessionId: string,
//     dataId: string,
//   ): Promise<void>;
//   [InitiativeContextEnums.DISCORD_INITIATIVE](sessionId: string): Promise<void>;
//   [InitiativeContextEnums.NEXT](sessionId: string): Promise<void>;
//   [InitiativeContextEnums.PREVIOUS](sessionId: string): Promise<void>;
//    [InitiativeContextEnums.REMOVE_STATUS_EFFECT](
//     sessionId: string,
//     spellId: string,
//     characterId: string
//   ): Promise<void>;
//    [InitiativeContextEnums.RESORT](sessionId: string): Promise<void>;
//    [InitiativeContextEnums.RE_ROLL](sessionId: string, record: InitiativeObject): Promise<void>;
//    [InitiativeContextEnums.ROUND_START](sessionId: string): Promise<void>;
//    [InitiativeContextEnums.SET_CURRENT_TURN](
//     sessionId: string,
//     currentId: string): Promise<void>;
//    [InitiativeContextEnums.UPDATE_INITIATIVE](
//     sessionId: string,
//     itemtoUpdate: InitiativeObjectEnums,
//     initiative: InitiativeObject,
//     setRecord: any,
//     toUpdate: string | number | boolean | any
//   ): Promise<void>;
//   [InitiativeContextEnums.UPDATE_ORDER](e: any,sessionId: string): void
// }
