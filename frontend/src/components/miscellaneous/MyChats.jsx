import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/Chatprovider";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "../ChatLoading";
import { getSender } from "../../config/ChatLogics";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({fetchAgain,setFetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat,setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();
  const fetchChats = async () => {
    try {
      let data = await fetch("http://localhost:2000/api/chats", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + user.token,
        },
      });
      data = await data.json();
      console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "failed to search",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: setSelectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="cebter"
      p={3}
      bg=""
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "21px", md: "30px" }}
        // fontFamily="work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        as="b"
      >
        MY CHATS...&nbsp;&nbsp;&nbsp;&nbsp;
<GroupChatModal>
        <Button
        d="flex"
        fontSize={{base:"17px", md:"10px", lg:"17px"}}
        rightIcon={<AddIcon />}
        >
        Make Group Chat
        </Button>
        </GroupChatModal>
      </Box>
      <Box
      display="flex"
      flexDir="column"
      p={3}
      
      w="100%"
      h="100%"
      borderRadius="lg"
      overflowY="hidden"
      >
{
    chats ? (
        <Stack overflowY="scroll">
            {
                chats.map((chat)=>(
                    <Box
                    onClick={()=>setSelectedChat(chat)}
                    cursor="pointer"
                    backgroundImage={selectedChat===chat?"https://png.pngtree.com/thumb_back/fh260/background/20210115/pngtree-handheld-mobile-phone-chat-design-concept-image_524282.jpg":"https://www.shutterstock.com/image-vector/internet-social-media-seamless-pattern-260nw-1584865015.jpg"}
                    // color={selectedChat===chat?"white":"black"}
                    fontSize="larger"
                    as="b"
                    px={3}
                    py={2}
                    borderRadius="lg"
                    border="2px solid black"
                    // backgroundImage="https://www.shutterstock.com/image-vector/internet-social-media-seamless-pattern-260nw-1584865015.jpg"
                    key={chat._id}
                    >
                        <Text>
                            {
                            !chat.isGroupChat?
                                getSender(loggedUser,chat.users):chat.chatName                           
                            }
                        </Text>
                      {chat.latestMessage && (
                        <Text
                        fontSize="xs">
                          <b>{chat.latestMessage.sender.name}:</b>
                          {chat.latestMessage.content.length >50 ? chat.latestMessage.content.substring(0,51)+"...":chat.latestMessage.content}
                        </Text>
                      )}  
                    </Box>
                ))
            }

        </Stack>
    ):(
        <ChatLoading />
    )
}
      </Box>
    </Box>
  );
};
export default MyChats;
