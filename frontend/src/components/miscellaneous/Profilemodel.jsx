import { ViewIcon } from "@chakra-ui/icons";
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import React from "react";

const Profilemodel = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return(
    <>
   {
    children ? ( <span onClick={onOpen}>{children}</span>

    ):(
        <IconButton 
        d={{base:"flex"}}
        icon={<ViewIcon />}
        onClick={onOpen}
        />
    )
   } 
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="410px" backgroundImage="https://png.pngtree.com/thumb_back/fh260/background/20210629/pngtree-fast-food-truck-company-cute-profile-image_734624.jpg" width="100%">
          {/* <ModalHeader
          fontSize="40px"
          // fontFamily="Work sans"
          as="b"
          display="flex"
          justifyContent="center"
          >{user.name}</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody
          display="flex"
          flexDir="column"
          alignItems="center"
          justifyContent="space-between"
          >
           <Image 
           borderRadius="full"
           boxSize="180px"
           src={user.pic}
           alt={user.name}
           />
           <Text
           fontSize={{base:"28px", md:"30px"}}
          //  fontFamily="Work sans"
           as="b"
    
           >
            Name:{user.name}<br/>
            Email:{user.email}

           </Text>
          

          </ModalBody>

          <ModalFooter>
           </ModalFooter>
        </ModalContent>
      </Modal>

   </>
  )

};

export default Profilemodel;
