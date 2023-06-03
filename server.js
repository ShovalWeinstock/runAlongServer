const {MongoClient, ObjectId} = require("mongodb");
const Express = require("express");
const BodyParser = require('body-parser');

const server = Express();
server.use(BodyParser.json());
server.use(BodyParser.urlencoded({ extended: true }));

//const client = new MongoClient(process.env["ATLAS_URI"]);
//added "?retryWrites=true&w=majority";" to the end of the string
const uri = "mongodb+srv://shoval:atlas@cluster0.dbts3lw.mongodb.net/test?retryWrites=true&w=majority";

var db;


/**
 * Check if the given user information is valid
 */
async function isValidUser(userInfo) {
    // todo - check if the password is valid in the client side?
    try {
        let findUsername = await db.collection("usersCollection").findOne({"username": userInfo.username});                      
        if(findUsername == null) {
            return true; // username isn't taken - valid user
        }                       
        return false; // invalid user
    } catch (e) {
        console.error(e);
        return false;
    }
}


/**
 * Add the given user to the DB (if it is valid) 
 */
async function addUser(newListing){
    var result = null;
    if (await isValidUser(newListing)) {
        let userObject = {username: newListing.username,
                          nickname: newListing.nickname,
                          rank: 0, 
                          coins: 0,
                          inventory: [new ObjectId("6454d79c01ba82fa1931ea53"),
                                      new ObjectId("6454d76001ba82fa1931ea50"),
                                      new ObjectId("6454d82501ba82fa1931ea56") ],
                          bottom: new ObjectId("6454d79c01ba82fa1931ea53"),
                          top: new ObjectId("6454d76001ba82fa1931ea50"),
                          shoes: new ObjectId("6454d82501ba82fa1931ea56")};
        result = await db.collection("usersCollection").insertOne(userObject);
        let loginInfo = {username: newListing.username,
                         password: newListing.password,
                         userRef: result.insertedId};
        await db.collection("loginInfoCollection").insertOne(loginInfo);
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
        if (result) {
            response.send(result);
        }
        else {
            response.status(404).send();
        }
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});


/**
 * return the object of the user with the given id
 */
async function getUserById(id) {
    try {
            let result = await db.collection("usersCollection").findOne({"_id": id});                                              
            return result;
        } 
    catch (e) {
        console.error(e);
    }
}


// POST login
// 'http://localhost:3005/login'
server.post("/login", async (request, response, next) => {
    try {
        const { username, password } = request.body;
        const loginInfo = await db.collection("loginInfoCollection").findOne({ "username": username, "password": password });

        if (loginInfo) {
            const user = await getUserById(loginInfo.userRef);
            if (user) {
                response.send(user);
            } else {
                response.status(404).send({ message: "User not found." });
            }
        } else {
            response.status(401).send({ message: "Invalid username or password." });
        }
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});


/**
 * GET shop items
 * 'http://localhost:3005/clothesCollection'
 */
server.get("/clothesCollection", async (request, response, next) => {
    try {
        let result = await db.collection("clothesCollection").find({});
        if(result) {
            response.send(await result.toArray());
        } 
        else {
            response.status(404).send();
        }
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});


/**
 * GET items from clothesCollection based on user's inventory
 * 'http://localhost:3005/clothesCollection?username=USERNAME'
 */
server.get("/clothesCollection/inventory/:username", async (request, response, next) => {
    try {
        let username = request.params.username;
        let user = await db.collection("usersCollection").findOne({"username": username});
        if (user) {
            const inventoryIds = user.inventory.map(id => new ObjectId(id));
            const clothes = await db.collection("clothesCollection").find({ "_id": { $in: inventoryIds } }).toArray();
            response.send(clothes);
        } else {
            response.status(404).send({ message: "User not found." });
        }
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
        if (result) {
            response.send(result);
        }
        else {
            response.status(404).send();
        }
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
        if (result) {
            response.send(result);
        }
        else {
            response.status(404).send();
        }
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
        if (result) {
            response.send(result);
        }
        else {
            response.status(404).send();
        }
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});

/**
 * UPDATE the outfit (top, bottom, shoes) of the given user
 * "http://localhost:3005/usersCollection/outfit?username=USERNAME"
 */
server.put("/usersCollection/outfit", async (request, response, next) => {
    try {
        let result = await db.collection("usersCollection").updateOne(
            { username: request.query.username },
            { $set: {top: new ObjectId(request.body.top), bottom: new ObjectId(request.body.bottom), shoes: new ObjectId(request.body.shoes)} }
        );
        if (result) {
            response.send(result);
        }
        else {
            response.status(404).send();
        }
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});


// DELETE user by username
// 'http://localhost:3005/users?username=USERNAME'
server.delete("/users", async (request, response, next) => {
    try {
        const username = request.query.username;
        const result1 = await db.collection("usersCollection").deleteOne({ username: username }); 
        const result2 = await db.collection("loginInfoCollection").deleteOne({ username: username });

        if (result1.deletedCount > 0 && result2.deletedCount > 0) {
            response.send({ message: "User deleted successfully." });
        } else {
            response.status(404).send({ message: "User not found." });
        }
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});


/**
 * UPDATE the password of the given user
 * "http://localhost:3005/usersCollection/password"
 */
server.put("/loginInfoCollection/password", async (request, response, next) => {
    try {
        const username = request.body.username;
        const oldPassword = request.body.oldPassword;
        const newPassword = request.body.newPassword;

        // try to get the user using the oldPassword
        const loginInfo = await db.collection("loginInfoCollection").findOne({ "username": username, "password": oldPassword });
        if (!loginInfo) {
            response.status(404).send();
            return;
        }
        
        // success -> the old password is correct. change it to the new password.
        let result = await db.collection("loginInfoCollection").updateOne(
            { username: username },
            { $set: {password: newPassword} }
        );
        if (result) {
            response.send(result);
        }
        else {
            response.status(404).send();
        }
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});


/**
 * POST race info
 * 'http://localhost:3005/racesCollection'
 */
server.post("/racesCollection", async (request, response, next) => {
    try {
        let raceInfo = request.body;
        let new_race = 
            {
                track_length: parseInt(raceInfo.track_length),
                ran: parseFloat(raceInfo.ran),
                runner_id: new ObjectId(raceInfo.runner_id),
                time: parseFloat(raceInfo.time),
                is_winner: Boolean(raceInfo.is_winner),
                coins_earned: parseInt(raceInfo.coins_earned),
                xp_earned: parseInt(raceInfo.xp_earned)
            };          
        let result = await db.collection("racesCollection").insertOne(new_race);
        if (result) {
            response.send(result);
        }
        else {
            response.status(404).send();
        }
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});


/**
 * GET items from racesCollection based on user's runner_id
 * 'http://localhost:3005/racesCollection?runner_id=ID
 */
server.get("/racesCollection/:runner_id", async (request, response, next) => {
    try {
      const runnerId = request.params.runner_id;
      const races = await db.collection("racesCollection").find({ "runner_id": new ObjectId(runnerId) }).toArray();
      response.send(races);
    } catch (e) {
      response.status(500).send({ message: e.message });
    }
  });

  server.get("/lastRace/:runner_id", async (request, response, next) => {
    try {
      const runnerId = request.params.runner_id;
      const races = await db.collection("racesCollection").find({ "runner_id": new ObjectId(runnerId) }).toArray();
      response.send(races.slice(-1));
    } catch (e) {
      response.status(500).send({ message: e.message });
    }
  });
  

async function main(){

    const client = new MongoClient(uri);

    server.listen("80", async () => {
        try {
            await client.connect();
            db = client.db("runalong");
            console.log("Listening on port 80")
        } catch (e) {
            console.error(e);
        }
    });
}

main().catch(console.error);
