import { CloseIcon } from "@chakra-ui/icons";
import { Box, Image, Text } from "@chakra-ui/react";

const UserBadgeItem=({user,handleFunction})=>{
    return(
        <Box
        px={2}
        py={1}
        // borderRadius="lg"
        m={1}
        mb={2}
        variant="solid"
        fontSize={15}
        backgroundColor="skyblue"
        color="black"
        cursor="pointer"
        onClick={handleFunction}
        >
    <Text as="b">     
    {user.name}
    </Text>
    &nbsp;

    <CloseIcon pl={1} color="red"/>

        </Box>
    )

}
export default UserBadgeItem;