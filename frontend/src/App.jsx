import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './Home'
import About from './About'
import Navbar from './Navbar'
import { Button, ButtonGroup } from '@chakra-ui/react'
import HomePage from './pages/Homepage'
import ChatPage from './pages/ChatPage'
import Footer from './components/Footer'

function App() {
  

  return (
    <>   
     <div className='App'>
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/chats' element={<ChatPage />}/>
      
    </Routes>
    </div>
    </>

  )
}

export default App
