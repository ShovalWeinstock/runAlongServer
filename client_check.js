const axios = require('axios');


// add user
// axios.post('http://localhost:3005/usersCollection', {
//   "username": "testuser",
//   "nickname": "banani",
//   "password": "testpassword",
// })
// .then(response => {
//   console.log(response.data);
// })
// .catch(error => {
//   console.error(error);
// });



// get user object by username and password
// axios.get('http://localhost:3005/loginInfoCollection?username=EinatSaruf&password=123')
// .then(response => {
//   if (response.data == "") {
//     console.log("not found");
//   } 
//   else {
//     console.log(response.data);
//   }
// })
// .catch(error => {
//   console.error(error);
// });

// increment rank
// axios.put('http://localhost:3005/usersCollection/rank/Einat_Saruf')
//   .then(response => {
//     console.log(response.data);
//   })
//   .catch(error => {
//     console.error(error);
//   });

//update coins
axios.put('http://localhost:3005/usersCollection/coins?username=EinatSaruf&amount=110')
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error);
});


// update coins (add item)
// axios.put('http://localhost:3005/usersCollection/inventory?username=Einat_Saruf&itemId=63ff6c98add07a32333307bb')
// .then(response => {
//   console.log(response.data);
// })
// .catch(error => {
//   console.error(error);
// });




// to check "addUser" method - change the server main - 

// async function main(){

//   const client = new MongoClient(uri);

//   server.listen("3005", async () => {
//       try {
//           await client.connect();
//           db = client.db("runalong");

//           // await addUser(
//           //     {
//           //         "username": "Einat_Saruf",
//           //         "nickname": "salkal",
//           //         "rank": 3,
//           //         "coins": 100,
//           //         "outfit": [
//           //           "ObjectId('63ff6c98add07a32333307bb')"
//           //         ],
//           //         "inventory": [
//           //           "ObjectId('63ff6c98add07a32333307bb')"
//           //         ]
//           //       }
//           // )

//       } catch (e) {
//           console.error(e);
//       }
//   });
// }

