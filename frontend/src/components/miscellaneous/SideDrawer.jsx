import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../../Context/Chatprovider";
import Profilemodel from "./Profilemodel";
import { useNavigate } from "react-router-dom";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvitor/UserListItem";
import { getSender } from "../../config/ChatLogics";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { user,setSelectedChat,chats,setChats,notification,setNotification} = ChatState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
const toast = useToast();


  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };


  const handleSearch=async ()=>{
    if(!search){
        toast({
            title: "please insert something in search bar",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top-left",
          });
          return;
    }
    try {
        setLoading(true)
       console.log(user.token)
        let data = await fetch("http://localhost:2000/api/user/?search="+search,{
          method:"GET",
          headers:{
            Authorization :"Bearer "+user.token,

           },
        })

        data= await data.json();
        console.log(data);

        setLoading(false)
        setSearchResult(data);
        
    } catch (error) {
        toast({
            title: "Error Occured",
            description:"failed to search",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        
    }
  };

  const accessChats=async (userId)=>{
    try {
      setLoadingChat(true)
      
      let data = await fetch("http://localhost:2000/api/chats",{
        method:"POST",
        headers:{
          Authorization :"Bearer "+user.token,
          "Content-Type":"application/json",
         },
         body:JSON.stringify({userId})
      })
data = await data.json();

console.log(data);

if(!chats.find((c)=>c._id === data._id)) setChats([data, ...chats])

setSelectedChat(data);
setLoadingChat(false);
onClose();
      
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description:"failed to search",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    
      
    }
  }
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="search Users To chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text d={{ base: "none", nd: "flex" }} px="4" as="i" fontSize="larger">
                Search User

            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" color="cornflowerblue" as="b">

          <h3>ExcuseMe!</h3>

        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No new Messages"}
{notification.map(notif=>(

<MenuItem key={notif._id} onClick={()=>{
  setSelectedChat(notif.chat);
  setNotification(notification.filter((n)=>n !== notif));
}}>
{notif.chat.isGroupChat?"new Message in "+notif.chat.chatName:"New Message from "+getSender(user,notif.chat.users)}
</MenuItem>
))}

            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <Profilemodel user={user}>
                <MenuItem>My Profile</MenuItem>
              </Profilemodel>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px"><Text as="b" fontSize="larger">Find Friends</Text></DrawerHeader>
          <DrawerBody backgroundImage="https://cdni.iconscout.com/illustration/premium/thumb/group-chatting-4431111-3692634.png">
            <Box display="flex" pb={2}>
              <Input
                placeholder="search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
              onClick={handleSearch}
              >
                Search
              </Button>
            </Box>
            {
            loading ? (
                <ChatLoading />
            ):(
                searchResult?.map(user => (
                    <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={()=>accessChats(user._id)}
                    />
                ))

            )
        }
        {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>

        </DrawerContent>
      </Drawer>
    </>
  );
};
export default SideDrawer;
