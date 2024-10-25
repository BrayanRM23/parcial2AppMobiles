import './App.css';
import Form from './components/Form';
import UserHome from './components/UserHome';
import Ganadores from './components/ganadores';
import AdminHome from './components/AdminHome';
import ChangePassword from './components/cambiarP';
import Crearusuarios from './components/crearusers';
import {BrowserRouter, Routes, Route} from 'react-router-dom'; 
import { useState } from 'react';

function App() {
  const [user, setUser] = useState(null);
  return (  
    <BrowserRouter>
      {/* <Navigation/> */}
      <Routes>
        <Route index element={<Form callback={setUser}/>}></Route>
        <Route path='/cambiarP' element={<ChangePassword/>}></Route>
        <Route path='/crearusers' element={<Crearusuarios/>}></Route>
        <Route path='/ganadores' element={<Ganadores/>}></Route>
        <Route path='/UserHome' element={<UserHome user={user}/>}></Route>
        <Route path='/adminHome' element={<AdminHome user={user}/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}


export default App
