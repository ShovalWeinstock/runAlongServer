const {MongoClient} = require("mongodb");
const axios = require('axios');
//const server_address = "3.15.7.16:80";
const server_address = "localhost:80";

const uri = "mongodb+srv://shoval:atlas@cluster0.dbts3lw.mongodb.net/test?retryWrites=true&w=majority";
var db;


async function usernameExists(username) {
  try {
      let findUsername = await db.collection("usersCollection").findOne({"username": username});                      
      if(findUsername == null) {
          return false;
      }                       
      return true;
  } catch (e) {
      console.error(e);
      return false;
  }
}

async function testAddUser(username, nickname, password) {
  try {
    console.log("test add user");
    const response = await axios.post('http://' + server_address + '/usersCollection', {
      "username": username,
      "nickname": nickname,
      "password": password
    });
    const exists = await usernameExists(username);
    if(exists) {
      console.log('added user successfully:\n', response.data);
    }
    else {
      console.error('error adding user:\n');
    }
  } catch (error) {
    console.error('error adding user:\n', error);
  }
}

async function testLogin(username, password) {
  try {
    const loginData = {
      username: username,
      password: password
    };

    console.log("testing login...");
    const response = await axios.post('http://' + server_address + '/login', loginData);
    console.log('Login successful:\n', response.data);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error('Invalid username or password.');
    } else if (error.response && error.response.status === 404) {
      console.error('User not found.');
    } else {
      console.error('Error occurred during login:\n', error.message);
    }
  }
}

async function testIncrementRank(username) {
  try {
    console.log("testing increment rank...");
    const response = await axios.put('http://' + server_address + '/usersCollection/rank/' + username);
    console.log('incremented rank successfully:\n', response.data);
  } catch (error) {
    console.error('error incrementing rank:\n', error);
  }
}

async function testUpdateCoins(username, amount) {
  try {
    console.log("testing update coins...");
    const response = await axios.put('http://' + server_address + '/usersCollection/coins?username=' + 
                                      username + '&amount=' + amount);
    console.log('updated coins successfully:\n', response.data);
  } catch (error) {
    console.error('error updating coins:\n', error);
  }
}

async function testUpdateInventory(username, item_id) {
  try {
    console.log("testing update inventory (add item)...");
    const response = await axios.put('http://' + server_address + '/usersCollection/inventory?username=' + 
                                      username + '&itemId=' + item_id);
    console.log('inventory updated successfully:', response.data);
  } catch (error) {
    console.error('Error updating inventory:', error);
  }
}

async function testUpdatePassword(username, oldPassword, newPassword) {
  try {
    console.log("testing update password...");
    const response = await axios.put('http://' + server_address + '/loginInfoCollection/password', {
      "username": username,
      "oldPassword": oldPassword,
      "newPassword": newPassword
    });
    console.log('Password updated successfully:\n', response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error('User not found or old password is incorrect.');
    } else {
      console.error('Error updating password:\n', error.message);
    }
  }
}

async function testGetUserInventory(username) {
  try {
    console.log("testing get user's inventory from clothesCollection...");
    const response = await axios.get('http://' + server_address + '/clothesCollection/inventory/' + username);
    if (response.data == "") {
      console.log("user not found");
    } else {
      console.log('got inventory:\n', response.data);
    }
  } catch (error) {
    console.error('error getting inventory:\n', error);
  }
}

async function testDeleteUser(username) {
  try {
    console.log("testing delete user...");
    const response = await axios.delete('http://' + server_address + '/users?username=' + username);
    let exists = await usernameExists(username);
    if (!exists) {
      console.log('user deleted successfully:');
    }
  } catch (error) {
    console.error('error deleting user:\n', error);
  }
}

async function testPostRaceInfo() {
  console.log("Testing POST race info...");
  try {
    const raceInfo = {
      track_length: "2",
      ran: "0.8",
      runner_username: "test_username",
      time: "12",
      is_winner: "true",
      coins_earned: "15",
      xp_earned: "5"
    };
    const response = await axios.post('http://' + server_address + '/racesCollection', raceInfo);
    console.log('Race info added successfully:\n', response.data);
  } catch (error) {
    console.error('Error occurred while adding race info:\n', error.message);
  }
}

async function testGetUserRaces(username) {
  console.log("Testing get User Races...");
  try {
    const response = await axios.get('http://' + server_address + '/racesCollection/' + username);
    console.log('Got races:', response.data);
  } catch (error) {
    console.error('Error getting races:', error);
  }
}

async function runTests() {

  // connect to db
  const client = new MongoClient(uri);
  try {
    await client.connect();
    db = client.db("runalong");
  } catch (e) {
    console.error(e);
  }

  console.log("test register new valid user");
  await testAddUser("test_username", "test_nickname", "Test_password1");

  console.log("\n---------------------------------------------------\n");

  console.log("test login correct username and correct password");
  await testLogin("test_username", "Test_password1" )

  console.log("\n---------------------------------------------------\n");

  console.log("test login incorrect username and correct password");
  await testLogin("incorrect_username", "Test_password1" )

  console.log("\n---------------------------------------------------\n");

  console.log("test login correct username and incorrect password");
  await testLogin("test_username", "incorrect_password")

  console.log("\n---------------------------------------------------\n");

  await testIncrementRank("test_username");

  console.log("\n---------------------------------------------------\n");
  
  console.log("increment coins");
  await testUpdateCoins("test_username", "200");

  console.log("\n---------------------------------------------------\n");

  console.log("decrement coins");
  await testUpdateCoins("test_username", "-100");

  console.log("\n---------------------------------------------------\n");

  await testUpdateInventory("test_username", "63ff6c98add07a32333307bb");

  console.log("\n---------------------------------------------------\n");

  console.log("test update password - correct username and old password");
  await testUpdatePassword('test_username', 'Test_password1', 'Test_password2');

  console.log("\n---------------------------------------------------\n");

  console.log("test update password - correct username and incorrect old password");
  await testUpdatePassword('test_username', 'Test_password', 'Test_password3');

  console.log("\n---------------------------------------------------\n");

  console.log("test update password - incorrect username and correct old password");
  await testUpdatePassword('test_username1', 'Test_password2', 'Test_password4');

  console.log("\n---------------------------------------------------\n");

  await testGetUserInventory("test_username");

  console.log("\n---------------------------------------------------\n");

  await testPostRaceInfo();

  console.log("\n---------------------------------------------------\n");

  await testGetUserRaces("test_username")

  console.log("\n---------------------------------------------------\n");

  await testDeleteUser("test_username");

}

runTests();

