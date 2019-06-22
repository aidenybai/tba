const TBA = require('./index.js');
const client = new TBA.Client({ token: 'nSQGhb0z2yECaPhAVOIbU5LflZddP3epEvaQYoHPmdleWQ4GmP7uRCDORsChxYve' });

client.getStatus()
  .then((json) => {
    console.log(json);
  })
  .catch((err) => {
    console.error(err);
  });