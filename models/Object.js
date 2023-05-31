const mongoose = require('mongoose');
const { isEmail } = require('validator'); //check if the input email is valid
const bcrypt = require('bcrypt');

// create a schema (AKA database item)

// Example object, containing image property

// const pokeSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     ability1: {
//         type: String,
//         required: true
//     },
//     ability2: {
//         type: String,
//         required: true
//     },
//     ability3: {
//         type: String,
//         required: true
//     },
//     creator: {
//         type: String,
//         required: false
//     },
//     creatorID: {
//         type: String,
//         required: false
//     },
//     image: {
//         type: Object,
//         required: false
//     }
// }, { timestamps: true })

const TaskSchema = new mongoose.Schema({
    date: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    creatorID: {
        type: String,
        required: false,
    },
    creator: {
        type: String,
        required: false
    }
}, {timestamps: true})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please type a username"]
    },
    mail: {
        type: String,
        unique: true,
        required: [true, "Please type an email"],
        validate: [isEmail, 'Invalid email']
    },
    password: {
        type: String,
        required: [true, "Please type a password"]
    },
    type: {
        type: String,
        required: true,
        default: "User"
    }
}, { timestamps: true })

// For storing database images

// const imgSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     data: {
//         type: Buffer,
//         required: true
//     },
//     contentType: {
//         type: String,
//         required: true
//     },
//     key: {
//         type: String,
//         required: false
//     }
// }, { timestamps: true })

// hash user passwords before they get added to the database
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})


// confirm new database additions
TaskSchema.post('save', function (doc, next) {
    console.log('New task was created and saved');
    next();
})

userSchema.post('save', function (doc, next) {
    console.log('New user was created and saved');
    next();
})


// static method to login user
userSchema.statics.login = async function(mail, password){
    const user = await this.findOne({ mail }); //if it finds a user, return it and place it inside the const
    if (user){
        const auth = await bcrypt.compare(password, user.password);//if password matches, assign true to auth const
        if(auth){
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}


// create a model to use in the database, whatever that means
const Task = mongoose.model('task', TaskSchema);
const User = mongoose.model('user', userSchema);
// For saving images
// const Image = mongoose.model('image', imgSchema);

console.log(Task);
console.log(User);

//export the user model to use elsewhere. In this case, the database
module.exports = {
    Task,
    User
}