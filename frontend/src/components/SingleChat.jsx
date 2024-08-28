import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ChatState } from "../Context/Chatprovider";
import { AddIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import Profilemodel from "./miscellaneous/Profilemodel";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { useEffect, useState } from "react";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import io from 'socket.io-client'
import Lottie, {} from 'react-lottie'
import animationData from '../animations/typing.json'
import './extra.css'
const ENDPOINT = "http://localhost:2000";
var socket,selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat,notification,setNotification } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
 const [socketConnected,setSocketConnected]= useState(false);
 const [typing,setTyping]=useState(false);
 const [istyping,setIsTyping]=useState(false);


const defaultOptions ={
  loop:true,
  autoplay:true,
  animationData:animationData,
  rendererSettings:{
    preserveAspectRatio:"xMidYMid slice"
  },

};

  const toast = useToast();

  const fetchMessage = async () => {
    if (!selectedChat) return;
    try {
      let data = await fetch(
        "http://localhost:2000/api/message/" + selectedChat._id,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      );
      data = await data.json();
      console.log(data);
      setMessages(data);
      setLoading(false);
      socket.emit('join chat',selectedChat._id);
    } catch (error) {
      toast({
        title: "Eroor Occured",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(()=>{
    socket = io(ENDPOINT);
    socket.emit('setup',user);
    socket.on("connected",()=>setSocketConnected(true));
    socket.on('typing',()=>setIsTyping(true));
    socket.on('stop typing',()=>setIsTyping(false));
},[]);
 
  useEffect(() => {
    fetchMessage();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(()=>{
    socket.on('message recieved',(newMessageRecieved)=>{
        if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
if(!notification.includes(newMessageRecieved)){
  setNotification([newMessageRecieved,...notification]);
  setFetchAgain(!fetchAgain);
}
        }else{
            setMessages([...messages,newMessageRecieved]);
        }
    })
  })
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
        socket.emit('stop typing',selectedChat._id)
      try {
        setNewMessage("");

        let data = await fetch("http://localhost:2000/api/message", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + user.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: newMessage,
            chatId: selectedChat._id,
          }),
        });
        data = await data.json();
        socket.emit('new message',data)
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Eroor Occured",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  let lastTypingTime = new Date().getTime();
const timerLength = 3000; // 3 seconds

const typingHandler = (e) => {
    // Update the state with the new message
    setNewMessage(e.target.value);

    // Check if socket is connected before proceeding
    if (!socketConnected) return;

    // If not currently typing, set typing state and emit 'typing' event
    if (!typing) {
        setTyping(true);
        socket.emit('typing', selectedChat._id);
    }

    // Reset last typing time
    lastTypingTime = new Date().getTime();

    // Set a timeout to emit 'stop typing' event after timerLength milliseconds
    setTimeout(() => {
        const timeNow = new Date().getTime();
        const timeDiff = timeNow - lastTypingTime;
        if (timeDiff >= timerLength && typing) {
            socket.emit('stop typing', selectedChat._id);
            setTyping(false);
        }
    }, timerLength);
};return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            as="b"
            px={2}
            w="100%"
            // fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <Profilemodel user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessage={fetchMessage}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            // bg="#E8E8E8"
            backgroundImage="https://www.shutterstock.com/image-vector/seamless-pattern-social-media-networking-600nw-1039923571.jpg"
            w="100%"
            h="100%"
            borderRadius="lg"
            border="5px solid black"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignItems="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                {istyping?<div>
                  <Lottie
                  options={defaultOptions}
                    width={70}
                    style={{marginBottom:15,marginLeft:0}}
                    />
                </div>:<></>}
             
              <Input
                variant="filled"
                bg=""
                placeholder="Enter Message"
                onChange={typingHandler}
                value={newMessage}
                size="lg"
                errorBorderColor='red.300'
              />
              
       
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
         
          backgroundSize="cover"  // Ensures the image covers the entire background area
          backgroundPosition="center"  // Centers the image horizontally and vertically
          // backgroundRepeat="no-repeat"
          backgroundImage="https://i.pinimg.com/736x/c5/71/71/c57171a250aa9dda506a13a63ce16127.jpg"
          w="100%"
        >
          <Text  pb={3} as="b" >
            <h2>Click on a user to start chatting...</h2>
          </Text>
        </Box>
      )}
    </>
  );
};
export default SingleChat;
