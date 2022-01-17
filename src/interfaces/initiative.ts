export interface IStatus {
  spellName: string;
  id: string;
  effectDescription: string;
}

export interface InitiativeObject {
  id: string;
  characterName: string;
  initiative: number;
  initiativeModifier: number;
  roundOrder: number;
  isCurrent: boolean;
  statusEffects: IStatus[] | [];
  isNpc: boolean;
}

export interface SpellObject {
  durationTime: number;
  durationType: number;
  effectName: string;
  effectDescription: string;
  id: string;
  characterIds: string[] | [];
}

export interface ISessionData {
  ondeck: number;
  sort: boolean;
  initiativeList: InitiativeObject[];
  spellList: SpellObject[];
  room: string;
}

export interface TargetData {
  id: string;
  name: string;
  status_effects: IStatus[] | [];
}

export enum InitiativeObjectEnums {
  id = "id",
  characterName = "characterName",
  initiative = "initiative",
  initiativeModifier = "initiativeModifier",
  roundOrder = "roundOrder",
  isCurrent = "isCurrent",
  statusEffects = "statusEffects",
  isNpc = "isNpc",
}
