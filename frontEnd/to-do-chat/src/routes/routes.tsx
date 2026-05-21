// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GetAllUsers from '../pages/allData/allUsers/allUsers'
import { SignUp } from '../pages/signUpUsers/signUpUsers'
import {MainPage} from '../pages/mainPage/mainPage'
import { LogInInt } from '../pages/login/login';
import { CompleteSign } from '../pages/completeLogin/completeSignUp';
import {SignCompanyUp} from '../pages/signCompany/SignUpCompany'
import { GetAllCompany } from '../pages/allData/allCompany/allCompany';
import { SuaEmpresa } from '../pages/suaEmpresa/suaEmpresa';
import { ChatPage } from '../pages/chat/chatPage';

export const Routess =()=>{

  return (
    <>
    <Router>
      <Routes>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/getAllUsers' element={<GetAllUsers/>}/>
        <Route path='/getAllCompany' element={<GetAllCompany/>}/>
        <Route path='/mainPage' element={<MainPage/>}/>
        <Route path='' element={<LogInInt/>}/>
        <Route path='/completeSign' element={<CompleteSign/>}/>
        <Route path='/signCompanyUp' element={<SignCompanyUp/>}/>
        <Route path='/myCompany' element={<SuaEmpresa/>}/>
        <Route path='/chats' element={<ChatPage/>}/>
      </Routes>
    </Router>

    </>
  )

}



