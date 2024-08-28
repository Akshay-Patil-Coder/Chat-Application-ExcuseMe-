import {
    Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../Context/Chatprovider";
import UserListItem from "../userAvitor/UserListItem";
import UserBadgeItem from "../userAvitor/UserBadgeItem";
const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedusers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user, chats, setChats } = ChatState();
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      let data = await fetch(
        "http://localhost:2000/api/user/?search=" + search,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      );

      data = await data.json();
      console.log(data);
      setLoading(false);
      setSearchResult(data);
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
  const handleSubmit =async () => {
    if(!groupChatName || !selectedusers)
    {
        toast({
            title: "please fill all the fields",
            status: "Warning",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
     return;    

    }
    try {
      let ids = [];
      ids = await JSON.stringify(selectedusers.map((u) => u._id))
      console.log(ids)
      
        const response = await fetch("http://localhost:2000/api/chats/group", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + user.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: groupChatName,
                users:ids
            })
        });
    
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    
        const data = await response.json();
        console.log(data)
        setChats([data, ...chats]); // Assuming chats is the existing array of chats
           onClose();
        toast({
            title: "New Group Created",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
    } catch (error) {
        toast({
            title: "Unsuccess to create group",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });

    }
  };
  const handleDelete = (deleteuser) => {
    setSelectedUsers(selectedusers.filter((sel)=>sel._id !== deleteuser._id))
  };
  const handleGroup = (userToAdd) => {
    if (selectedusers.includes(userToAdd)) {
      toast({
        title: "user already added",
        status: "Warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    setSelectedUsers([...selectedusers, userToAdd]);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            Crete Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="blue" alignItems="center">
            <FormControl>
              <Input
                placeholder="ChatName"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
            {
            selectedusers.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
            </Box>
            {loading ? (
              <div>loading</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default GroupChatModal;
