import EffectsSlot from './EffectsSlot'
import {Row,Col} from "react-bootstrap"
import { InitiativeLine,status_effects } from "../Interfaces/Interfaces";

export default function EffectsContainer({init_rec}: {init_rec:InitiativeLine}) {
    return (
        <>
            {init_rec.status_effects != null ? init_rec.status_effects.map((item:status_effects) => <Col xs="auto" style={{width:'1px'}} key={item.id}><EffectsSlot effect={item}/></Col>):[]}
       </>
    )
}