import InitLine from './initline'
import React,{ useEffect, useState } from 'react'
import { ReactSortable } from 'react-sortablejs';
import firebase from 'firebase/app';
import 'firebase/firestore';
import FormSubmit from './spell_sub'
import InitSubmit from './init_sub'
import SpellLine from './spellz'
import { MdDeleteForever } from 'react-icons/md'
import { useCollectionData,useDocumentData } from 'react-firebase-hooks/firestore';
import { Accordion,Card,Container,Row,Col,Carousel } from 'react-bootstrap';
import { useAuth,db } from '../config';


const Initlist = ({sessionid}) => {
console.log(sessionid)


const initRef = db.collection('sessions').doc(sessionid).collection('initiative')
const spellRef = db.collection('sessions').doc(sessionid).collection('spells')

const [spells,spellload,spellerror] = useCollectionData(spellRef, { idField: 'id' })

const queryinit = initRef.orderBy('line_num')
const [init_fin,loading,error] = useCollectionData(queryinit, { idField: 'id' });

const [initstate,setInit] = useState(init_fin)
// function get_init(){
//     initRef.orderBy('line_num').get().then((item) => {
//     const items = item.docs.map((doc) => ({id: doc.id, ...doc.data()}));
//     setInit(items)
//     console.log(items)
//   })
//   .catch((error)=>{
//     console.log(error)
//   });
// }

// function get_spells(){
//   spellRef.get().then((item)=>{
//   const items = item.docs.map((doc) => ({id: doc.id, ...doc.data()}));
//   setSpells(items)
//   })
//   .catch((error)=>{
//     console.log(error)
//   });
// }

// useEffect(() => {
//   get_init();
//   get_spells();
// },[]);

function update_init(options){
  console.log(options.data)
  var upquery = initRef.doc(options.id)
  upquery.set((options.data),{ merge: true }).then(()=>{
      console.log("Document successfully written!");
  })
  .catch((error) => {
      console.error("Error writing document: ", error);
  })
}

function save_init(name,id){
  var upquery = initRef.doc(id)
  upquery.set(({Name:name}),{ merge: true }).then(()=>{
      console.log("Document successfully written!");
  })
  .catch((error) => {
      console.error("Error writing document: ", error);
  })

}

const add_init = (evt) =>{
  evt.preventDefault();
  var options = {
    Name:evt.target[0].value.trim(),
    init:Number(evt.target[1].value.trim()),
    init_mod:Number(evt.target[2].value.trim()),
    line_num:0,
    cmark:false,
    dmark:false,
    rmark:false
}
  initRef.add(options)
  .then(()=>{
    console.log('Success')
  })
  .catch((error)=>{
    console.log(error)
  })
  
}

function delete_line(id){
  var upquery = initRef.doc(id)

  upquery.delete().then(()=>{
    console.log('Success?')
  })
  .catch((error)=>{
    console.log(error)
  })

}

function delete_spell(id){
  var upquery = spellRef.doc(id)

  upquery.delete().then(()=>{
    console.log('Success?')
  })
  .catch((error)=>{
    console.log(error)
  })

}

function spell_save(evt){
  evt.preventDefault()
  var options = {
    spell_name:evt.target[0].value.trim(),
    target:evt.target[1].value.trim(),
    duration:evt.target[2].value.trim(),
}
  spellRef.add(options)
  .then(()=>{
    console.log('Success')
  })
  .catch((error)=>{
    console.log(error)
  })
}

function spell_edit(value,id){

  spellRef.doc(id).set(value,{merge:true})
  .then(()=>{
    console.log('Success')
  })
  .catch((error)=>{
    console.log(error)
  })
}

function test_save(){
  let length = init_fin.length
  console.log(initstate)
  try{ 
  for (let i = 0; i < length; i++){
    initRef.doc(initstate[i].id).set({line_num:i+1},{merge:true})
    console.log(initstate[i].id)
  }
}
  catch(error){
    console.log(error)
  }
  // initRef.set(init_fin,{merge:true})
  // .then(() =>{
  //   console.log('Success')
  // })
  // .catch((error)=>{
  //   console.log(error)
  // })
}


return (
  <Container>
<Container>
    <Row>
      
    <Col md={4}> 
    <Accordion>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Card.Header} eventKey="0">
              Initiative
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
            
            <React.Fragment>
              {error && (<strong>Error: {JSON.stringify(error)}</strong>)}
                    {loading && (<span>Collection: Loading...</span>)}
                     {init_fin &&  (
                      <div>
                         
              <ReactSortable list={init_fin} onEnd={test_save} setList={setInit} onRemove={delete_line}>
              
              {init_fin.map((item) => (
            <div key={item.id} id={item.id} className='initline' style={{ display: "flex" }}>
                <InitLine key={item.id} init={item} update_init={update_init} onDelete={delete_line} OnSave={save_init}/>
                </div>
              ))}
            
              </ReactSortable>
              <br/>
              <InitSubmit handleSubmit={add_init}/>
              <br/>
              
              </div>
                    )}
                    </React.Fragment>  
                    </Card.Body>
                    </Accordion.Collapse>
        </Card>
        </Accordion>
     </Col>  
     <Col md={4}></Col>
     <Col md={4}> 
      <Accordion>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Card.Header} eventKey="0">
              Spells
          </Accordion.Toggle>
          </Card.Header>
        <Accordion.Collapse eventKey="0">
        <Card.Body>
            
            <React.Fragment>
            {spellerror && (<strong>Error: {JSON.stringify(error)}</strong>)}
            {spellload && (<span>Collection: Loading...</span>)}
            {spells &&  ( 
                          <div> 
                          <table>
                            <thead>
                              <tr>
                                  <th>Name</th>
                                  <th>Duration</th>
                                  <th>Target</th>
                              </tr>
                            </thead>
                          <tbody>
                                {spells.map((item) => (
                                <tr id={item.id}>
                                <SpellLine item={item} onSave={spell_edit}/>
                                <MdDeleteForever className='delete' style={{color:'red'}} onClick={()=>delete_spell(item.id)}/>
                                </tr>
                                ))}
                            </tbody>
                          </table>
                          <FormSubmit handleSubmit={spell_save}/>
                          </div>
                        )}
                        </React.Fragment>
                        </Card.Body>
          </Accordion.Collapse>
        </Card>
        </Accordion>
    </Col>
    
  </Row> 
  </Container>

  <Container className='fixed-bottom'>
    <Row>
      <Col>
      </Col>
      <Col md={6}>
      <Accordion>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Card.Header} eventKey="0">
              Character Sheet
          </Accordion.Toggle>
          </Card.Header>
        <Accordion.Collapse eventKey="0">
        <Card.Body>
          <React.Fragment>
          <Carousel>
  <Carousel.Item>
    <img
      className="d-block w-100"
      src="holder.js/800x400?text=First slide&bg=373940"
      alt="First slide"
    />
    <Carousel.Caption>
      <h3>First slide label</h3>
      <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item>
    <img
      className="d-block w-100"
      src="holder.js/800x400?text=Second slide&bg=282c34"
      alt="Second slide"
    />

    <Carousel.Caption>
      <h3>Second slide label</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item>
    <img
      className="d-block w-100"
      src="holder.js/800x400?text=Third slide&bg=20232a"
      alt="Third slide"
    />

    <Carousel.Caption>
      <h3>Third slide label</h3>
      <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
    </Carousel.Caption>
  </Carousel.Item>
</Carousel>
          </React.Fragment>
        </Card.Body>
          </Accordion.Collapse>
        </Card>
        </Accordion>
      </Col>
      <Col>
      </Col>
    </Row>
  </Container>
  </Container>
)}


export default Initlist