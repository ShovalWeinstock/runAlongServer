const axios = require('axios');


// add user
// axios.post('http://localhost:3005/usersCollection', {
//   "username": "testuser",
//   "password": "testpassword",
//   "email": "testuser@example.com"
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
axios.put('http://localhost:3005/usersCollection/rank/Einat_Saruf')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });


