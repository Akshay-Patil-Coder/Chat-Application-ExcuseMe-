const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const userschema = mongoose.Schema({

    name:{type:String,required:true},

    email:{type:String,required:true,unique:true},

    password:{type:String,required:true},

    pic:{type:String,default:"https://cdn-icons-png.flaticon.com/512/1144/1144760.png"},
},{
    timestamps:true,
})


userschema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)

}

userschema.pre('save',async function(next){
    if(!this.isModified('password')){
       return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
    
})
const User =   mongoose.model("User",userschema)
module.exports = User;