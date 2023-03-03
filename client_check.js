const axios = require('axios');

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


axios.get('http://localhost:3005/loginInfoCollection?username=EinatSaruf&password=123')
.then(response => {
  if (response.data == "") {
    console.log("not found");
  } 
  else {
    console.log(response.data);
  }
})
.catch(error => {
  console.error(error);
});
