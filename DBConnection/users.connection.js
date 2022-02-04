const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const USER_ID = process.env.USER_ID 
const USER_KEY = process.env.USER_KEY
const uri = `mongodb+srv://${USER_ID}:${USER_KEY}@cluster0.v9m59.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function getUser(username, password){
    console.log(USER_ID)
    console.log(USER_KEY)
    return new Promise( (resolve, reject) =>{
        client.connect(err => {            
            const collection = client.db("Piano").collection("users");
            collection.findOne({ username: username }, async (err, result) => {
                if (err) {
                    reject('Database Error Ocurred')
                }
                if (result) {
                    if(await bcrypt.compare(password, result.password)) {
                        resolve({
                            id: result.id,
                            username: result.username, 
                            compositions: result.compositions 
                        })
                    } else{
                        reject('Username or Password incorrect')
                    }                    
                } else {
                    reject('Username or Password incorrect')
                }
                client.close();
            });
        });
    })    
}

async function userExists(username){
    return new Promise( (resolve, reject) =>{
        client.connect(err => {            
            const collection = client.db("Piano").collection("users");
            collection.findOne({ username: username }, async (err, result) => {
                if (err) {
                    reject('Database Error Ocurred')
                }
                if (result) {
                    resolve(true)                                  
                } else {
                    resolve(false)
                }
                client.close();
            });
        });
    })    
}

function createUser(username, password){
    return new Promise( async (resolve, reject) =>{
        const userExistsResponse = await userExists(username)
        if(userExistsResponse){
            reject({status: 409, message: 'El usuario ya se encuentra registrado'})
        }
        client.connect(err => {
            const newUser = {
                id: new Date().valueOf(),
                username,
                password,
                compositions: []
            };
            const collection = client.db("Piano").collection("users");
            collection.insertOne(newUser, function (err) {
                if (err) {
                    reject({status: 500, message: 'Database Error Ocurred'})
                } else {
                    resolve({message: 'User created!'}) 
                }
                client.close();
            });
        });
    })
}

function updateUserCompositions(id, compositions) {    
    return new Promise( (resolve, reject) =>{
        client.connect(err => {
            const query = {id}
            const newValue = { $set: {compositions}}            
            const collection = client.db("Piano").collection("users");
            collection.updateOne(query, newValue, (err) => {
                if (err) {
                    reject('Database Error Ocurred')
                } else {
                    resolve({message: 'User modified!'})
                }
                client.close();
            });
        });
    })
}


function deleteUsers() {
    return new Promise((resolve, reject) => {
        client.connect(err => {
            const collection = client.db("Piano").collection("users");
            collection.deleteMany({}, (err, obj) => {
                if (err) {
                    reject('Database Error Ocurred')
                } else {
                    resolve({ message: obj.deletedCount + " document(s) deleted" })
                }
                client.close();
            });
        });
    })
}

module.exports = {getUser, createUser, updateUserCompositions, deleteUsers}