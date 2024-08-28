import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { useToast } from "@chakra-ui/react";
  import {useNavigate} from "react-router-dom"

  
  const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
const navigate = useNavigate();

    
    const submitHandler = async ()=>{
      setLoading(true);
      if( !email || !password)
        {
          toast({
                title: "Please Fill All The Fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
             setLoading(false);
             return;
        }
          try {
            
            let data =  await fetch("http://localhost:2000/api/user/login",{
              method:"POST",
              headers:{
                "Content-Type":"application/json"
              },
              body:JSON.stringify({email,password})
            });

            console.log(data.ok);
            if(data.ok){
            toast({
              title: "Login succesfully",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          }
          else{
            toast({
              title: "Email Or Password Anything Is Wrong",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          }
          data = await data.json();

            localStorage.setItem('userInfo',JSON.stringify(data));
            console.log(data)
            setLoading(false);
          navigate('/chats')


          } catch (error) {
            toast({
              title: "Something Error",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
           setLoading(false);
          }
   
    }
    return (
      <VStack spacing="5px" color="black">
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Enter Your Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
        colorScheme="blue"
        width="100%"
        style={{marginTop:15}}
        onClick={submitHandler}
        >
          LogIn
        </Button>
      </VStack>
    );
  };
  
export default Login