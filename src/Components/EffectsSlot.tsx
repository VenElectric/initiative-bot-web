import {
	Badge,
	OverlayTrigger,
	Tooltip,
} from "react-bootstrap";

import { status_effects } from "../Interfaces/Interfaces";
 
// singular effect component that is placed in the effects container
export default function EffectsSlot({effect}: {effect:status_effects}) {



    return (
        <OverlayTrigger
        key={effect.id}
        placement="top"
        overlay={
            <Tooltip id={effect.id}>{effect.effect}</Tooltip>
        }
    >
       <Badge className='effectslot'>{effect.name}</Badge>
    </OverlayTrigger>
    )
}