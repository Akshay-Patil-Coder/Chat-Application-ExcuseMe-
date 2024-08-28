import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../Context/Chatprovider";
import UserBadgeItem from "../userAvitor/UserBadgeItem";
import UserListItem from "../userAvitor/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain,setFetchAgain,fetchMessage}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleRemove = async(user1) => {
    if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
        toast({
            title: "Your Not A Admin",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
       return;
    }
    try {
        setLoading(true)
        let response = await fetch(
            "http://localhost:2000/api/chats/groupremove",
            {
              method: "PUT",
              headers: {
                Authorization: "Bearer " + user.token,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                chatId: selectedChat._id,
                userId: user1._id
              }),
            }
          ); 
          response = await response.json();
        //   console.log(response)

          user1._id === user._id? setSelectedChat():setSelectedChat(response);
       setFetchAgain(!fetchAgain)
       fetchMessage();

       setLoading(false)
        
    } catch (error) {
        toast({
            title: "Eroor Occured",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
    setLoading(false);    
    }
  };
  const handleAddUser = async(user1) => {
    if(selectedChat.users.find((u)=>u._id===user1._id)){
        toast({
            title: "Users Already Their",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
          return;
       
    }
    if(selectedChat.groupAdmin._id !== user._id){
        toast({
            title: "Your Not A Admin",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
       return;
    }
try {
    setLoading(true);
   
    let response = await fetch(
        "http://localhost:2000/api/chats/groupadd",
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + user.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId: selectedChat._id,
            userId: user1._id
          }),
        }
      );    
      response = await response.json();
      setSelectedChat(response);
      setFetchAgain(!fetchAgain);

      setLoading(false);  
} catch (error) {
    toast({
        title: "Eroor Occured",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
     setLoading(false)
    
}
  };
  const handleRename = async () => {
    if (!groupChatName){return;}

    try {
      setRenameLoading(true);

      let response = await fetch(
        "http://localhost:2000/api/chats/grouprename",
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + user.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId: selectedChat._id,
            chatName: groupChatName,
          }),
        }
      );
      response = await response.json();
      console.log(response);

      setSelectedChat(response);
      setFetchAgain(!fetchAgain);


      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Eroor Occured",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleSearch =async(query) => {
    setSearch(query);
    if(!query){
        return;
    }
    try {
        setLoading(true);
        let data = await fetch("http://localhost:2000/api/user/?search="+search,{
            method:"GET",
            headers:{
              Authorization :"Bearer "+user.token,
  
             },
          })
        data= await data.json();
        setLoading(false);
        setSearchResult(data);


          
    } catch (error) {
        toast({
            title: "Eroor Occured",
            description:"failed to load",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
         
        setLoading(false)

    }
  };
  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._d}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users in agroup"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {
                loading?(<Spinner size="lg" />):(
                     searchResult?.map((user)=>(
                        <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={()=> handleAddUser(user)}
                        />
                     ))
                )
            }
          </ModalBody>

          <ModalFooter>
            <Button  colorScheme="red">
              Leave Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default UpdateGroupChatModal;
