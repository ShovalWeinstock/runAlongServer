const {MongoClient, ObjectId} = require("mongodb");
const Express = require("express");
const BodyParser = require('body-parser');

const server = Express();
server.use(BodyParser.json());
server.use(BodyParser.urlencoded({ extended: true }));

//const client = new MongoClient(process.env["ATLAS_URI"]);
//added "?retryWrites=true&w=majority";" to the end of the string
const uri = "mongodb+srv://shoval:Atlas123@cluster0.dbts3lw.mongodb.net/test?retryWrites=true&w=majority";

var db;


/**
 * Check if the given user information is valid
 */
async function isValidUser(userInfo) {
    // todo - check if the password is valid in the client side?
    try {
        let usernameIsTaken = await db.collection("usersCollection").findOne({"username": userInfo.username});                      
        if(usernameIsTaken != null) {
            return false; // invalid user
        }                       
        return true; // valid user
    } catch (e) {
        console.error(e);
        return false;
    }
}


/**
 * Add the given user to the DB (if it is valid) 
 */
async function addUser(newListing){
    result = null;
    if (await isValidUser(newListing)) {
        const result = await db.collection("usersCollection").insertOne(newListing);
        console.log(`New listing created with the following id: ${result.insertedId}`); //todo delete
    }
    else {
        console.log("username is taken"); // todo delete
    }
    return result;
}


/**
 * POST new user 
 * 'http://localhost:3005/usersCollection'
 */
server.post("/usersCollection", async (request, response, next) => {
    try {
        let result = await addUser(request.body);
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});


/**
 * return the object of the user with the given id
 */
async function getUserById(id) {
    try {
        let result = await db.collection("usersCollection").findOne({"_id": new ObjectId(id)});                                              
        return result;
    } catch (e) {
        console.error(e);
    }
}


/**
 * GET user by username and password
 * 'http://localhost:3005/loginInfoCollection?username=USERNAME&password=PASSWORD'
 */
server.get("/loginInfoCollection", async (request, response, next) => {
    try {
        let result = await db.collection("loginInfoCollection").findOne({ "username": request.query.username, 
                                                                          "password": request.query.password });
        if(result != null) {
            var str = result.userRef;
            var userId = str.substring(str.indexOf("(") + 1, str.indexOf(")")).replace(/'/g, '');
            result = await getUserById(userId)
        }   

        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});


/**
 * UPDATE rank by username (increase by 1)
 * 'http://localhost:3005/usersCollection/rank/USERNAME'
 */
server.put("/usersCollection/rank/:username", async (request, response, next) => {
    try {
        let result = await db.collection("usersCollection").updateOne(
            { username: request.params.username },
            { $inc: { rank: 1 } }
        );
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});


/**
 * UPDATE coins given username and amount of coins
 * 'http://localhost:3005/usersCollection/coins?username=USERNAME&amount=AMOUNT'
 */
server.put("/usersCollection/coins", async (request, response, next) => {
    try {
        let result = await db.collection("usersCollection").updateOne(
            { username: request.query.username },
            { $inc: { coins: parseInt(request.query.amount) } }
        );
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});


/**
 * UPDATE invenntory given username and item id
 * 'http://localhost:3005/usersCollection/inventory?username=USERNAME&itemId=ID'
 */
server.put("/usersCollection/inventory", async (request, response, next) => {
    try {
        let result = await db.collection("usersCollection").updateOne(
            { username: request.query.username },
            { $push: {inventory: new ObjectId(request.query.itemId)} }
        );
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});


async function main(){

    const client = new MongoClient(uri);

    server.listen("3005", async () => {
        try {
            await client.connect();
            db = client.db("runalong");
        } catch (e) {
            console.error(e);
        }
    });
}

main().catch(console.error);
