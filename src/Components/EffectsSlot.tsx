import {
	Badge,
	OverlayTrigger,
	Tooltip,
} from "react-bootstrap";
import {StatusEffect} from "../Interfaces/initiative";
 
// singular effect component that is placed in the effects container
export default function EffectsSlot({effect}: {effect:StatusEffect}) {



    return (
        <OverlayTrigger
        key={effect.id}
        placement="top"
        overlay={
            <Tooltip id={effect.id}>{effect.effectDescription}</Tooltip>
        }
    >
       <Badge className='effectslot'>{effect.spellName}</Badge>
    </OverlayTrigger>
    )
}
