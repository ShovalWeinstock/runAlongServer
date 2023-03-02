// const express = require('express')
// const app = express()
// const port = 3000

// function validateUser(username, password) {

// }

// function addUser(username, password, nickname) {

// }

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

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

var collection;

server.post("/usersCollection", async (request, response, next) => {
    try {
        let result = await collection.insertOne(request.body);
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});

server.get("/plummies/:plummie_tag", async (request, response, next) => {
    try {
        let result = await collection.findOne({ "username": request.params.username,
                                                "password": request.params.password });
        response.send(result); // todo return the user, not the login info!
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});

server.get("/plummies/:id", async (request, response, next) => {});
server.put("/plummies/:plummie_tag", async (request, response, next) => {});




server.listen("3000", async () => {
    try {
        await client.connect();
        collection = client.db("runalong").collection("usersCollection");
        console.log("Listening at :3000...");
    } catch (e) {
        console.error(e);
    }
});