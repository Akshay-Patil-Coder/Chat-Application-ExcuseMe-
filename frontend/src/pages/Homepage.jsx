import React, { useEffect } from 'react';
import { Container,Box,Text,TabList,Tab,TabPanels,Tabs,TabPanel} from '@chakra-ui/react'
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';
import {useNavigate} from "react-router-dom"
import Footer from '../components/Footer';

const HomePage=()=>{

  const navigate = useNavigate();

  useEffect(()=>{
      const user= JSON.parse(localStorage.getItem("userInfo"));
      if(user){
          navigate('/chats');
      }
  },[navigate]);


    return(
<Container maxW='xl' centerContent>
<Box 
d="flex"
justifyContent="center"
p={3}
bg={"white"}
w="100%"
m="40px 0 12px 0"
borderRadius="lg"
borderWidth="1px"
textAlign="center"
>
    <Text fontSize="4xl"   color="cornflowerblue" as="b"><h1>Excuse Me</h1></Text>
</Box>
<Box bg={"white"} w="100%" p={4} color="black" borderRadius="lg" borderWidth="1g">
<Tabs variant='soft-rounded' >
  <TabList mb="1em">
    <Tab width="50%">Login</Tab>
    <Tab width="50%">Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel><Login /></TabPanel>
    <TabPanel><Signup /></TabPanel>
  </TabPanels>
</Tabs>
</Box>

</Container>

    )
}
export default HomePage;