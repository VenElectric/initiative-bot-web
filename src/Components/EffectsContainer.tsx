import EffectsSlot from './EffectsSlot'
import {Row,Col} from "react-bootstrap"
import { InitiativeLine,status_effects } from "../Interfaces/Interfaces";

//container for spell effects
export default function EffectsContainer({init_rec}: {init_rec:InitiativeLine}) {

    
    return (
        <>
        <Row style={{position:'relative',left:'15px'}} md={6}>
            {init_rec.status_effects != null ? init_rec.status_effects.map((item:status_effects) => <Col xs="auto" style={{padding:'2px'}} key={item.id}><EffectsSlot effect={item}/></Col>):[]}
        </Row>
       </>
    )
}
