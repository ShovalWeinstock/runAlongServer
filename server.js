// const express = require('express')
// const app = express()
// const port = 3000

const {MongoClient} = require("mongodb");
const Express = require("express");
const BodyParser = require('body-parser');

const server = Express();
server.use(BodyParser.json());
server.use(BodyParser.urlencoded({ extended: true }));

//const client = new MongoClient(process.env["ATLAS_URI"]);
// added "?retryWrites=true&w=majority";" to the end of the string
const uri = "mongodb+srv://shoval:Atlas123@cluster0.dbts3lw.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function validateUser(username, password) {
    // todo - check if the password is valid in the client side
    // todo - check id the username already exsits
    return true;
}

async function addUser(newListing){
    result = null;
    if (await validateUser(newListing)) {
        const result = await db.collection("usersCollenction").insertOne(newListing);
        console.log(`New listing created with the following id: ${result.insertedId}`); //todo delete
    }
    return result;
}

server.post("/usersCollection", async (request, response, next) => {
    try {
        let result = await addUser(request.body);
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});

server.get("/usersCollection/:username:/password", async (request, response, next) => {
    try {
        let result = await db.collection("usersCollenction").findOne({ "username": request.params.username,
                                                "password": request.params.password });
        response.send(result); // todo return the user, not the login info!
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});


// todo change password
// todo change 
// server.put("/plummies/:plummie_tag", async (request, response, next) => {
//     try {
//         let result = await db.collection("usersCollenction").updateOne(
//             { "plummie_tag": request.params.plummie_tag },
//             { "$set": request.body }
//         );
//         response.send(result);
//     } catch (e) {
//         response.status(500).send({ message: e.message });
//     }
// });

server.listen("3000", async () => {
    try {
        await client.connect();
        db = client.db("runalong");
        console.log("Listening at :3000...");
    } catch (e) {
        console.error(e);
    }
});