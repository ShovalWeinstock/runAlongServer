const axios = require('axios');

async function addUser(username, nickname, password) {
  try {
    console.log("test add user");
    const response = await axios.post('http://localhost:3005/usersCollection', {
      "username": username,
      "nickname": nickname,
      "password": password
    });
    console.log('added user successfully:\n', response.data);
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
    const response = await axios.post('http://localhost:3005/login', loginData);
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

async function incrementRank(username) {
  try {
    console.log("testing increment rank...");
    const response = await axios.put('http://localhost:3005/usersCollection/rank/' + username);
    console.log('incremented rank successfully:\n', response.data);
  } catch (error) {
    console.error('error incrementing rank:\n', error);
  }
}

async function updateCoins(username, amount) {
  try {
    console.log("testing update coins...");
    const response = await axios.put('http://localhost:3005/usersCollection/coins?username=' + username + '&amount=' + amount);
    console.log('updated coins successfully:\n', response.data);
  } catch (error) {
    console.error('error updating coins:\n', error);
  }
}

async function updateInventory(username, item_id) {
  try {
    console.log("testing update inventory (add item)...");
    const response = await axios.put('http://localhost:3005/usersCollection/inventory?username=' + username + '&itemId=' + item_id);
    console.log('inventory updated successfully:', response.data);
  } catch (error) {
    console.error('Error updating inventory:', error);
  }
}

async function updatePassword(username, oldPassword, newPassword) {
  try {
    console.log("testing update password...");
    const response = await axios.put(`http://localhost:3005/loginInfoCollection/password`, {
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

async function getUserInventory(username) {
  try {
    console.log("testing get user's inventory from clothesCollection...");
    const response = await axios.get('http://localhost:3005/clothesCollection/inventory/' + username);
    if (response.data == "") {
      console.log("user not found");
    } else {
      console.log('got inventory:\n', response.data);
    }
  } catch (error) {
    console.error('error getting inventory:\n', error);
  }
}

async function deleteUser(username) {
  try {
    console.log("testing delete user...");
    const response = await axios.delete('http://localhost:3005/users?username=' + username);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

async function postRaceInfo() {
  console.log("Testing POST race info...");
  try {
    const raceInfo = {
      track_length: 1000,
      ran: 800,
      runner_id: "63ff66eaadd07a32333307b8",
      time: 10,
      is_winner: true,
      coins_earned: 150,
      xp_earned: 80
    };
    const response = await axios.post('http://localhost:3005/racesCollection', raceInfo);
    console.log('Race info added successfully:\n', response.data);
  } catch (error) {
    console.error('Error occurred while adding race info:\n', error.message);
  }
}

async function getUserRaces(runnerId) {
  try {
    const response = await axios.get(`http://localhost:3005/racesCollection/${runnerId}`);
    console.log('Got races:', response.data);
  } catch (error) {
    console.error('Error getting races:', error);
  }
}


async function runTests() {
  await addUser("test_username", "test_nickname", "Test_password1");

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

  await incrementRank("test_username");

  console.log("\n---------------------------------------------------\n");
  
  console.log("increment coins");
  await updateCoins("test_username", "200");

  console.log("\n---------------------------------------------------\n");

  console.log("decrement coins");
  await updateCoins("test_username", "-100");

  console.log("\n---------------------------------------------------\n");

  await updateInventory("test_username", "63ff6c98add07a32333307bb");

  console.log("\n---------------------------------------------------\n");

  console.log("test update password - correct username and old password");
  await updatePassword('test_username', 'Test_password1', 'Test_password2');

  console.log("\n---------------------------------------------------\n");

  console.log("test update password - correct username and incorrect old password");
  await updatePassword('test_username', 'Test_password', 'Test_password3');

  console.log("\n---------------------------------------------------\n");

  console.log("test update password - incorrect username and correct old password");
  await updatePassword('test_username1', 'Test_password2', 'Test_password4');

  console.log("\n---------------------------------------------------\n");

  await getUserInventory("test_username");

  console.log("\n---------------------------------------------------\n");

  // await deleteUser("test_username");

  console.log("\n---------------------------------------------------\n");

  await postRaceInfo();

  console.log("\n---------------------------------------------------\n");

  await getUserRaces("63ff66eaadd07a32333307b8")
}

runTests();

