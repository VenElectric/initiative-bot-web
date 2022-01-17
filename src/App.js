import {useLocation} from "react-router-dom"
import { useEffect,useContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import {SocketContext} from './Context/SocketContext'
import MainPage from "./Components/MainPage";
import MainSessionPage from "./Components/MainSessionPage";




function App() {
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get('session_id')
  localStorage.setItem('sessionId',sessionId)
  const socket = useContext(SocketContext);
  console.info(sessionId, "app.js")
 
  
useEffect(() => {
  
  if (sessionId){
    socket.emit('create', String(sessionId));
  }
  
  
  return () => {
    socket.disconnect()
    // localStorage.clear();
  }
}, [])



  return (
   
    <div className="App">
      {sessionId ? <MainSessionPage sessionId={sessionId}></MainSessionPage>: <MainPage/>}
     </div>
   
  );
}

export default App;
