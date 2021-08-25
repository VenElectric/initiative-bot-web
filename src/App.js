import SessionPage from "./Components/SessionPage";
import {useLocation} from "react-router-dom"
import { useEffect,useContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import InitContextProvider from "./Context/InitContext";
import SpellContextProvider from "./Context/SpellContext";
import {SocketContext} from './Context/SocketContext'
import MainPage from "./Components/MainPage";




function App() {
  const location = useLocation();
  const sessionid = new URLSearchParams(location.search).get('session_id')
  localStorage.setItem('session_id',sessionid)
  const socket = useContext(SocketContext);
 
  
useEffect(() => {
  
  socket.emit('create', String(sessionid));
  
  return () => {
    socket.disconnect()
    localStorage.clear();
  }
}, [])



  return (
    <InitContextProvider>
      <SpellContextProvider>
    <div className="App">
     {sessionid != null ? <SessionPage></SessionPage>:<MainPage/>}
     </div>
     </SpellContextProvider>
     </InitContextProvider>
  );
}

export default App;
