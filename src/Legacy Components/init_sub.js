import React,{useState,setState} from 'react'
import styled from 'styled-components'
import {Form,InputGroup,FormControl,Button,OverlayTrigger,Popover,Tooltip} from 'react-bootstrap';

const InitSubmit = ({handleSubmit}) =>{

   const initial = {fields:{spell:'',target:'',duration:''}}
   const [val,valState] = useState(initial)
   
   const handleChange = (evt) => {
      
      valState((prevState)=>({fields:{ [evt.target.name]: evt.target.value }}));
   }

   
   
  
    return (

       <>
       <Form onSubmit={(e) => {handleSubmit(e); valState(initial)}}>
       <Form.Label htmlFor="inlineFormInput" visuallyHidden>
         Character Name
       </Form.Label>
       <Form.Control
         className="mb-2"
         id="inlineFormInput"
         placeholder="Character Name"
       />
       <Form.Label htmlFor="inlineFormInputGroup" visuallyHidden>
         Initiative
       </Form.Label>
       <InputGroup className="mb-2">
       <OverlayTrigger key='1' placement='top' overlay={
             <Tooltip id={`1`}>
                Your total initiative. D20+Modifier 
                </Tooltip>
         }>
         <InputGroup.Text>?</InputGroup.Text>
         </OverlayTrigger>
         <FormControl id="inlineFormInputGroup" placeholder="Initiative Total" />
       </InputGroup>
       <Form.Label htmlFor="inlineFormInputGroup" visuallyHidden>
         Modifier
       </Form.Label>
       <InputGroup className="mb-2">
       <OverlayTrigger key='2' placement='top' overlay={
            <Tooltip id={`2`}>
                The modifier you add to your intitiave roll. 
                </Tooltip>
         }>
         <InputGroup.Text>?</InputGroup.Text>
         </OverlayTrigger>
         <FormControl id="inlineFormInputGroup" placeholder="Initiative Modifier" />
       </InputGroup>
       
       <Button type="submit" className="mb-2">
         Submit
       </Button>
 </Form>
     
       </>
       )
    }

   //  <form onSubmit={(e) => {handleSubmit(e); valState(initial)}}>
   //  <label>{name1}:</label>
   //   <input type='text' name={name1} value={val.fields.spell} onChange={handleChange}/>
   //   <br/>
   //   <label className='label-form'><div className="spanform">{name2}:</div></label>
   //   <input type='text' name={name2} value={val.fields.target} onChange={handleChange}/>
   //   <br/>
   //   <label className='label-form'><div className="spanform">{name3}:</div></label>
   //   <input type='text' name={name3} value={val.fields.duration} onChange={handleChange}/>
   //   <br/>
   //   <input type="submit" value="Submit" />
   //   </form>

    export default InitSubmit