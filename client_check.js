const axios = require('axios');

//test add user
console.log("test add user");
axios.post('http://localhost:3005/usersCollection', {
  "username": "test_username",
  "nickname": "test_nickname",
  "password": "Test_password1",
})
.then(response => {
  console.log('added user successfully:\n', response.data);
})
.catch(error => {
  console.error('error adding user:\n', error);
});

console.log("\n---------------------------------------------------\n")

// test increment rank
console.log("test increment rank");
axios.put('http://localhost:3005/usersCollection/rank/test_username')
  .then(response => {
    console.log('incremented rank successfully:\n', response.data);
  })
  .catch(error => {
    console.error('error incrementring rank:\n', error);
  });

console.log("\n---------------------------------------------------\n")

// test update coins
console.log("test update coins");

console.log("increment coins");
axios.put('http://localhost:3005/usersCollection/coins?username=test_username&amount=200')
.then(response => {
  console.log('incremented coins successfully:\n', response.data);
})
.catch(error => {
  console.error('error incrementing coins:\n', error);
});


console.log("decrement coins");
axios.put('http://localhost:3005/usersCollection/coins?username=test_username&amount=-100')
.then(response => {
  console.log('decremented coins successfully:\n', response.data);
})
.catch(error => {
  console.error('error decrementing coins:\n', error);
});

console.log("\n---------------------------------------------------\n")

//test update inventory (add item)
console.log("test update inventory (add item)");
axios.put('http://localhost:3005/usersCollection/inventory?username=test_username&itemId=63ff6c98add07a32333307bb')
.then(response => {
  console.log('inventory updated successfully:',response.data);
})
.catch(error => {
  console.error('Error updating inventory:', error);
});

console.log("\n---------------------------------------------------\n")

//test update password
console.log("test update password");
var username;
var oldPassword;
var newPassword;

console.log("test update password - correct username and old password");
username = 'test_username';
oldPassword = 'Test_password1';
newPassword = 'Test_password2';

axios.put(`http://localhost:3005/loginInfoCollection/password`, {
  username: username,
  oldPassword: oldPassword,
  newPassword: newPassword
})
  .then(response => {
    console.log('Password updated successfully:\n', response.data);
  })
  .catch(error => {
    if (error.response && error.response.status === 404) {
      console.error('User not found or old password is incorrect.');
    } else {
      console.error('Error updating password:\n', error.message);
    }
  });

console.log("test update password - correct username and incorrect old password");
username = 'test_username';
oldPassword = 'Test_password123';
newPassword = 'Test_password3';

axios.put(`http://localhost:3005/loginInfoCollection/password`, {
  username: username,
  oldPassword: oldPassword,
  newPassword: newPassword
})
  .then(response => {
    console.log('Password updated successfully:\n', response.data);
  })
  .catch(error => {
    if (error.response && error.response.status === 404) {
      console.error('User not found or old password is incorrect.');
    } else {
      console.error('Error updating password:\n', error.message);
    }
  });

console.log("test update password - incorrect username and correct old password");
username = 'test_username1';
oldPassword = 'Test_password2';
newPassword = 'Test_password3';

axios.put(`http://localhost:3005/loginInfoCollection/password`, {
  username: username,
  oldPassword: oldPassword,
  newPassword: newPassword
})
  .then(response => {
    console.log('Password updated successfully:\n', response.data);
  })
  .catch(error => {
    if (error.response && error.response.status === 404) {
      console.error('User not found or old password is incorrect.');
    } else {
      console.error('Error updating password:\n', error.message);
    }
  });


console.log("\n---------------------------------------------------\n")

//test GET user's inventory from clothesCollection
console.log("test GET user's inventory from clothesCollection");
axios.get('http://localhost:3005/clothesCollection/inventory/test_username')
.then(response => {
  if (response.data == "") {
    console.log("user not found");
  } 
  else {
    console.log('got inventory:\n', response.data);
  }
})
.catch(error => {
  console.error('error getting inventory:\n', error);
});

console.log("\n---------------------------------------------------\n")

// //test delete user
// console.log("test delete user");
// axios.delete('http://localhost:3005/users?username=test_username')
//   .then(response => {
//     console.log(response.data);
//   })
//   .catch(error => {
//     console.error(error);
//   });


// // to check "addUser" method - change the server main - 

// // async function main(){

// //   const client = new MongoClient(uri);

// //   server.listen("3005", async () => {
// //       try {
// //           await client.connect();
// //           db = client.db("runalong");

// //           // await addUser(
// //           //     {
// //           //         "username": "Einat_Saruf",
// //           //         "nickname": "salkal",
// //           //         "rank": 3,
// //           //         "coins": 100,
// //           //         "outfit": [
// //           //           "ObjectId('63ff6c98add07a32333307bb')"
// //           //         ],
// //           //         "inventory": [
// //           //           "ObjectId('63ff6c98add07a32333307bb')"
// //           //         ]
// //           //       }
// //           // )

// //       } catch (e) {
// //           console.error(e);
// //       }
// //   });
// // }

