export interface IStatus {
  spellName: string;
  id: string;
  effectDescription: string;
}

export interface IInit {
  id: string;
  characterName: string;
  initiative: number;
  initiativeModifier: number;
  roundOrder: number;
  isCurrent: boolean;
  statusEffects: IStatus[] | [];
  isNpc: boolean;
}

export interface SpellList {
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
  initiativeList: IInit[];
  spellList: SpellList[];
  room: string;
}

export interface TargetData {
  id: string;
  name: string;
  status_effects: IStatus[] | [];
}
