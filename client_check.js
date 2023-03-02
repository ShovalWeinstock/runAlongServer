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


axios.get('http://localhost:3005/loginInfoCollection/EinatSaruf/123')
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error);
});
