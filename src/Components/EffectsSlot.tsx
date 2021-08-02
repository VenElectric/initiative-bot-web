import React from 'react'
import {
	Badge,
	OverlayTrigger,
	Tooltip,
} from "react-bootstrap";

import { status_effects } from "../Interfaces/Interfaces";

// interface ImportedIcons {
//     [key: string]: React.FC<{children:React.ReactNode}>
//  }
 

export default function EffectsSlot({effect}: {effect:status_effects}) {

    return (
        <OverlayTrigger
        key={effect.id}
        placement="top"
        overlay={
            <Tooltip id={effect.id}>{effect.name}</Tooltip>
        }
    >
       <Badge style={{backgroundColor:`${effect.color}`,fontSize:'1'}}>*</Badge>
    </OverlayTrigger>
    )
}
