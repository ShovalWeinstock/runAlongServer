const {MongoClient} = require("mongodb");
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
async function validateUser(userInfo) {
    // todo - check if the password is valid in the client side
    // todo - check if the username already exsits
    return true;
}

/**
 * Add the given user to the DB (if it is valid) 
 */
async function addUser(newListing){
    result = null;
    if (validateUser(newListing)) {
        const result = await db.collection("usersCollection").insertOne(newListing);
        console.log(`New listing created with the following id: ${result.insertedId}`); //todo delete
    }
    return result;
}

/**
 * POST new user 
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
 * GET user by username and password
 */
server.get("/loginInfoCollection", async (request, response, next) => {
    try {
        let result = await db.collection("loginInfoCollection").findOne({ "username": request.query.username, 
                                                                          "password": request.query.password });
        if(result != "") {
            userId = result._id
            result = getUser(userId)
        }                                                                  
        response.send(result); // todo return the user, not the login info!
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});


// put requests:
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


async function main(){

    const client = new MongoClient(uri);

    server.listen("3005", async () => {
        try {
            await client.connect();
            db = client.db("runalong");

            // await addUser(
            //     {
            //         "username": "Einat Sarufaaaaaa",
            //         "nickname": "salkal",
            //         "rank": 3,
            //         "coins": 100,
            //         "outfit": [
            //           "ObjectId('63ff6c98add07a32333307bb')"
            //         ],
            //         "inventory": [
            //           "ObjectId('63ff6c98add07a32333307bb')"
            //         ]
            //       }
            // )

        } catch (e) {
            console.error(e);
        }
    });
}

main().catch(console.error);
