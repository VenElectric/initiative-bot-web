import {
    InitiativeObject,
    SpellObject,
    SetInitiativeType,
    SetSpellType,
  } from "../Interfaces/initiative";
import { isSpellObject, isSpellObjectArray,isInitiativeObject,isInitiativeObjectArray} from "../services/server";


export function returnNewState(data:any){

    if (isSpellObjectArray(data) || isInitiativeObjectArray(data)){
        return [...data]
    }
    if (isSpellObject(data) || isInitiativeObject(data)){
        return {...data}
    }
    
}

export function setSpellStatus(characterId: string, characterName:string, isAffected: boolean){
    return {characterId: characterId, characterName:characterName, isAffected: isAffected}
  }
  
export function setInitiativeStatus(spellName: string,id: string,effectDescription: string){
    return { spellName: spellName, id:id, effectDescription: effectDescription}
  }