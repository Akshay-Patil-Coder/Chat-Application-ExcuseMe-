import React from 'react';
import { Box, Flex, Icon, Text, Link } from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box
    
      as="footer"
      textAlign="center"
      py="4"
      bg="#F0FFFF"
      color="black"
      p="5px 10px 5px 10px"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    //   fontWeight="semibold"
      boxShadow="md"
    >
     <Flex>
      <Text fontSize="sm" mt="2" as="b">
      <h4>ExcuseMe!</h4>
      </Text>
      </Flex>   <Flex>
      <Text fontSize="sm" mt="2" as="b">
      <h4>Made By Akshay Mohan Patil</h4>
      </Text>
      </Flex>

        <Flex>
          <Link href="#" target="_blank" rel="noopener noreferrer" mx="2">
            <Icon as={FaFacebook} boxSize="6" color="black" _hover={{ color: 'blue.500' }} />
          </Link>
          <Link href="#" target="_blank" rel="noopener noreferrer" mx="2">
            <Icon as={FaTwitter} boxSize="6" color="black" _hover={{ color: 'blue.400' }} />
          </Link>
          <Link href="#" target="_blank" rel="noopener noreferrer" mx="2">
            <Icon as={FaInstagram} boxSize="6" color="black" _hover={{ color: 'purple.400' }} />
          </Link>
        </Flex>
    </Box>
  );
};

export default Footer;
