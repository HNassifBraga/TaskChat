// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GetAllUsers from '../pages/allData/allUsers/allUsers'
import { SignUp } from '../pages/signUpUsers/signUpUsers'
import {MainPage} from '../pages/mainPage/mainPage'
import { LogInInt } from '../pages/login/login';
import { GetAllCompany } from '../pages/allData/allCompany/allCompany';
import { SuaEmpresa } from '../pages/suaEmpresa/suaEmpresa';
import { ChatPage } from '../pages/chat/chatPage';
import TaskChatLanding from '../pages/landingPage/landingPage';
export const Routess =()=>{

  return (
    <>
    <Router>
      <Routes>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/getAllUsers' element={<GetAllUsers/>}/>
        <Route path='/getAllCompany' element={<GetAllCompany/>}/>
        <Route path='/mainPage' element={<MainPage/>}/>
        <Route path='/login' element={<LogInInt/>}/>
        <Route path='/myCompany' element={<SuaEmpresa/>}/>
        <Route path='/chats' element={<ChatPage/>}/>
        <Route path='' element={<TaskChatLanding/>}/>
      </Routes>
    </Router>

    </>
  )

}



