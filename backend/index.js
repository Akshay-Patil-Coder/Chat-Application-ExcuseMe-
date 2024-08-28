const express = require('express');
const connectDb = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatsRoutes = require('./routes/chatsRoutes');
const messageRoutes = require('./routes/messageRoutes')
const cors = require('cors');
const app = express();

connectDb();

const corsOptions={
    origin:"http://localhost:5173",
    methods:"GET,POST,PUT,DELETE,HEAD,PATCH",
    credentials:true,
};

app.use(cors(corsOptions))
app.use(express.json())

app.get('',(req,resp)=>{
    resp.send('api is running')
})

app.use('/api/user',userRoutes)
app.use('/api/chats',chatsRoutes)
app.use('/api/message',messageRoutes)

const server = app.listen(2000,console.log('it is running on 2000 port'))
const io = require('socket.io')(server,{
    pingTimeOut:60000,
       cors:{
        origin:"http://localhost:5173"
    }
})
io.on("connection",(socket)=>{
    console.log("connected to socket.io ");
    socket.on('setup',(userData)=>{
        socket.join(userData._id);
        socket.emit('connected');
    });
    socket.on("join chat",(room)=>{
        socket.join(room);
    });
    socket.on("typing",(room)=>socket.in(room).emit("typing"));
    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"));
    socket.on('new message',(newMessageRecieved)=>{
var chat = newMessageRecieved.chat;
if(!chat.users) return console.log('users not found');
   
chat.users.forEach(user => {
    if(user._id == newMessageRecieved.sender._id)
return;
    socket.in(user._id).emit('message recieved',newMessageRecieved);    
});
});
socket.off('setup',()=>{
    console.log('Discoonected');
    socket.leave(userData._id);
});
});