import React from 'react'
import { ListGroup, Button } from 'react-bootstrap';
import { SpellObject } from '../Interfaces/initiative';
import { TiDeleteOutline } from 'react-icons/ti';
import { GetSpellContext } from '../Context/SpellContext';
import { SpellContextFunctions } from '../Context/SpellContextFunctions';

export default function SpellRecordList({sessionId}: {sessionId:string}) {
    const spells = GetSpellContext();
    return (
        <>
              <ListGroup variant="flush">
                { spells != null
                  ? spells.map((item: SpellObject) => {
                      return (
                        <ListGroup.Item key={item.id}>
                          <Button
                            className="listbuttonborder"
                            onClick={(e) => console.log(e)}
                          >
                            {item.effectName}
                          </Button>
                          <TiDeleteOutline
                            onClick={() => SpellContextFunctions.DELETE_SPELL(sessionId,item.id)}
                            style={{ float: "right" }}
                          />
                        </ListGroup.Item>
                      );
                    })
                  : []}
              </ListGroup>
              {spells != null ? ( <>
                  <br></br>
                  <Button
                    className="screenbutborder"
                    onClick={() => SpellContextFunctions.DISCORD_SPELLS(sessionId)}
                  >
                    Send Spells to Discord
                  </Button>
                </>) : ([])}
          </>
    )
}
