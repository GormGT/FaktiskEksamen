const { Task, User } = require("../models/Object"); // Add "Image" if images are in use
const jwt = require('jsonwebtoken');
// Only required for handling images
// const multer = require('multer');

// handles images in the database (only needed for multer)
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage }).single('image');


// creation of jwt
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id, userType) => {
    return jwt.sign({ id, userType }, "don't look", {
        expiresIn: maxAge,
    })
}

//handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };

    //incorrect email
    if(err.message === 'incorrect email'){
        errors.email = 'that email is not registered';
    }

    //incorrect password
    if(err.message === 'incorrect password'){
        errors.password = 'that password is not registered';
    }


    //duplicate error code
    if(err.code === 11000){
        errors.email = 'Email already taken';
        return errors;
    }

    //validation errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}



// ---------------------- controllers ----------------------

module.exports.home_get = (req, res) => {
    res.render("index", {title: "Index"});
}

module.exports.userView_get = (req, res) => {

    // viewedUser = req.params.username;

    // res.render("account", {title: `${req.params.username}'s page`})

    let user;

    jwt.verify(req.cookies.jwt, "don't look", async (err, decodedToken) => {
        if(err){
            console.log(err.message);
        }else{
            user = await User.findById(decodedToken.id);//find user in database
        }}).then(() => {
            console.log(req.params.username);
            if(req.params.username == user.name){
                res.render("creation", {title: "My page"})
            }else{
                console.log("Yeah, no, something isn't right here.")
                res.status(401).send({
                    status: ("You are not allowed to view this page")
                })
            }
        })

}

module.exports.userHome_get = (req, res) => {

    // let user;

    // jwt.verify(req.cookies.jwt, "don't look", async (err, decodedToken) => {
    //     if(err){
    //         console.log(err.message);
    //     }else{
    //         user = await User.findById(decodedToken.id);//find user in database
    //     }}).then(() => {
    //         console.log(req.params.username);
    //         if(req.params.username == user.name){
    //             res.render("creation", {title: "My page"})
    //         }else{
    //             console.log("Yeah, no, something isn't right here.")
    //             res.status(401).send({
    //                 status: ("You are not allowed to view this page")
    //             })
    //         }
    //     })
}

module.exports.guide_get = (req, res) => {
    res.render("guide", {title: "Guide"});
}




// ---------------------- auth controllers ----------------------

module.exports.login_get = (req, res) => {
    res.render("login", {title: "Logg inn"});
}

module.exports.signup_get = (req, res) => {
    res.render("signup", {title: "Opprett bruker"});
}


module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password); //run the login function from Object.js
        const token = createToken(user._id, user.type);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});//create a cookie containing a json web token
        res.status(200).json({ user });
    }
    catch (err){
        const errors = handleErrors(err);
        res.status(400).send({ errors });
    }
}

module.exports.signup_post = async (req, res) => { //fire upon recieving a post request to /signup
    const { name, mail, password, password2 } = req.body;

    try {
        const user = await User.create({ name, mail, password }); //create a new user which will be submitted to the database
        const token = createToken(user._id, user.type);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});//create a cookie containing a json web token
        res.status(201).json({user});
    }
    catch (err){
        const errors = handleErrors(err);
        res.status(400).send({ errors });
    }
}


module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}


module.exports.admin_get = (req, res) => {
    res.render("admin", {title: "Adminside"});
}






// ---------------------- document controllers ----------------------
// The following might require changes depending on the model structure

module.exports.doc_post = (req, res) => {

    // Image version

    // upload(req, res, async function (err) {
    //     if (err instanceof multer.MulterError) {
    //       // A Multer error occurred when uploading.
    //       console.log(err);
    //       res.status(500).send("Error saving image");
    //     } else if (err) {
    //       // An unknown error occurred when uploading.
    //       console.log(err);
    //       res.status(500).send("Error saving image");
    //     } else {
    //       // Everything went fine.
    //       let { name, ability1, ability2, ability3, creator, creatorID } = req.body;
    
    //       const image = new Image({
    //         name: req.file.originalname,
    //         data: req.file.buffer,
    //         contentType: req.file.mimetype,
    //         key: name,
    //       });

    //       jwt.verify(req.cookies.jwt, "don't look", async (err, decodedToken) => {
    //         if(err){
    //             console.log(err.message);
    //         }else{
    //             console.log(decodedToken, decodedToken.userType);
    //             let user = await User.findById(decodedToken.id);//find user in database
    //             console.log(user.name);
    //             creator = user.name;
    //             creatorID = user._id;
    //         }}).then(async () => {
    //             try {
    //                 await image.save();
    //                 const product = await Pokemon.create({ name, ability1, ability2, ability3, creator, creatorID, image });
    //                 res.status(201);
    //                 console.log("Pokomon created:", product);
    //                 res.json(product);
    //               } catch (err) {
    //                 console.log(err);
    //                 res.status(500).send("Error saving image");
    //               }  
    //         })
    //     }
    //   });

      // Normal version

    let data = req.body.data;
    let creatorID;
    // let creator;

      // Check if user is logged in, if true run rest of function
      jwt.verify(req.cookies.jwt, "don't look", async (err, decodedToken) => {
            if(err){
                console.log(err.message);
            }else{
                console.log(decodedToken, decodedToken.userType);
                let user = await User.findById(decodedToken.id);//find user in database
                console.log('Found user:', user.name);
                creatorID = user._id;
                // creator = user.name;
            }}).then(async () => {
                try {
                    // Image version

                    // await image.save();
                    // const doc = await Task.create({ name, ability1, ability2, ability3, creator, creatorID, image });
                    // res.status(201);
                    // console.log("Task created:", doc);
                    // res.json(doc);

                    // Normal version

                    // let finalData = {
                    //     name: data.name,
                    //     property: data.property,
                    //     creatorID: creatorID,
                    //     creator: creator
                    // };

                    let finalData = {
                        name: data.name,
                        creatorID: creatorID
                    }

                    const doc = new Task(finalData);
                    doc.save();
                    res.status(200).send({
                        status: `Upload successful :)`
                    })
                } catch (err) {
                    console.log(err);
                    res.status(500).send("Error saving image");
                }  
            })
}

module.exports.doc_load_recent = async (req, res) => {

    try {
        const foundDocs = await Task.find({}).sort({createdAt: -1}); // If working with images, add .populate("image") after the .find
        res.status(200).send({
            status: {
                foundDocs
            }
        })
    }catch(err){
        console.log(err);
    }
}

module.exports.doc_load_specific = async (req, res) => {

    let foundUser = await User.findOne({name: viewedUser});

    try {
        const foundDocs = await Task.find({creatorID: foundUser._id}).sort({createdAt: -1}); // If working with images, add .populate("image") after the .find
        res.status(200).send({
            status: {
                foundDocs,
                foundUser
            }
        })
    }catch(err){
        console.log(err);
    }
}

module.exports.doc_load_personal = async (req, res) => {
    
    let user;

    jwt.verify(req.cookies.jwt, "don't look", async (err, decodedToken) => {
        if(err){
            console.log(err.message);
        }else{
            user = await User.findById(decodedToken.id);//find user in database
    }}).then(async () => {
        try {
            const foundDocs = await Task.find({creatorID: user._id}).sort({createdAt: -1}); // If working with images, add .populate("image") after the .find
            res.status(200).send({
                status: {
                    foundDocs,
                    user
                }
            })
        }catch(err){
            console.log(err);
        }})
    }

module.exports.doc_update_fetch = async (req, res) => {
    console.log(req.body);

    // for better security, make the site check if the document being updated is owned by the currently logged in user, to prevent people from updating other's documents

    try{
        const foundDoc = await Task.findOne({_id: req.body.id});
        res.status(200).send({
            status: foundDoc
        })
    }
    catch(err){
        console.error(err);
        res.status(400).send({
            status: `Error fetching Task to update ${err}`
        })
    }
}

module.exports.doc_update = async (req, res) => {
    console.log(req.body);

    // for better security, make the site check if the document being updated is owned by the currently logged in user, to prevent people from updating other's documents

    try{
        const docToUpdate = await Task.findOne({_id: req.body.id});
        await docToUpdate.updateOne(req.body.newInfo);
        res.status(200).send({
            status: `Task updated :D ${req.body.id}`
        })
    }
    catch(err){
        console.error(err);
        res.status(400).send({
            status: `Error updating Task ${err}`
        })
    }
}

module.exports.doc_delete = async (req, res) => {
    console.log(req.body);

    try{
        const docToDelete = await Task.findOneAndDelete({_id: req.body.id});
        res.status(200).send({
            status: `Task sent to the shadow realm >:) ${req.body}`
        })
    }
    catch(err){
        console.error(err);
        res.status(400).send({
            status: `Error deleting Task ${err}`
        })
    }

}








// ------------------ Legacy controllers -----------------
module.exports.form_get = (req, res) => {
    res.render("form", {title: "Form"});
}

module.exports.form_post = async (req, res) => {

    const data = req.body;

    const doc = new Blog(data.parcel);

    try{
        doc.save();
        res.status(200).send({
            status: `Upload successful :)`
        })
    }
    catch(err){
        console.error('You broke it', err)
        res.status(400).send({
            status: (`Thing broke`, err)
        })
    }
}

module.exports.blog_readOne = async (req, res) => {

    const data = req.body;
    id = data.parcel;

    if(data){
        try{
            // instead of findOne use just find with an empty object to find all items in db
            const foundDoc = await Blog.findOne({_id: id});
            res.status(200).send({
                status: `${id}`
            })
        }
        catch(err){
            console.error('Thing broke again', err);
            res.status(400).send({
                status: `Not sure what you did, but it didn't work. ${err}`
            })
        }
    }
}

module.exports.doc_legacy_update = async (req, res) => {

    const data = req.body;
    console.log(data);

    try{
        const docToUpdat = await Blog.findOne({_id: data.id});
        await docToUpdat.updateOne(data.updatedDoc);
        res.status(200).send({
            status: `Task updated :D ${data.id}`
        })
    }
    catch(err){
        console.error(err);
        res.status(400).send({
            status: `Not again... ${err}`
        })
    }
}

module.exports.doc_legacy_delete = async (req, res) => {

    const data = req.body;
    console.log(data);

    try{
        const docToUpdat = await Blog.findOneAndDelete({_id: data.parcel});
        res.status(200).send({
            status: `Task sent to the shadow realm >:) ${data.parcel}`
        })
    }
    catch(err){
        console.error(err);
        res.status(400).send({
            status: `How do you keep messing this up???? ${err}`
        })
    }
}