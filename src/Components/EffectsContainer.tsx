import EffectsSlot from './EffectsSlot'
import {Row,Col} from "react-bootstrap"
import { InitiativeLine,status_effects } from "../Interfaces/Interfaces";
import {InitiativeObject, StatusEffect} from "../Interfaces/initiative";

//container for spell effects
export default function EffectsContainer({initiative}: {initiative:InitiativeObject}) {

    
    return (
        <>
        <Row style={{position:'relative',left:'15px'}} md={6}>
            {initiative.statusEffects != null ? initiative.statusEffects.map((item:StatusEffect) => <Col xs="auto" style={{padding:'2px'}} key={item.id}><EffectsSlot effect={item}/></Col>):[]}
        </Row>
       </>
    )
}
