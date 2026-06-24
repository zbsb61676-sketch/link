fetch('https://www.linkedin.com/in/williamhgates')
  .then(res => console.log('Valid Status:', res.status))
  .catch(err => console.log(err));

fetch('https://www.linkedin.com/in/thisprofiledoesnotexist123456789')
  .then(res => console.log('Invalid Status:', res.status))
  .catch(err => console.log(err));
