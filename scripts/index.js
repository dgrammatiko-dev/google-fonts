const axios = require('axios');
const dotenv = require('dotenv');
const _ = require('lodash')
const {readFile, writeFile, stat} = require('fs').promises;

const main = async () => {
  const result = dotenv.config()
  const googleKey = result.googleKey || process.env.googleKey;
  const file = 'docs/fonts.json'
  const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${googleKey}`
  const response = await axios({
    method: 'GET',
    url: url,
  });

  const stats = await stat(file);
  if (!stats.isFile()) {
    await writeFile(file, JSON.stringify(response.data, '', 2));
  } else {
    const currentData = await readFile(file, {encoding: 'utf-8'});
    const currentDataObj = JSON.parse(currentData);

    if (!_.isEqual(currentDataObj, response.data)) {
      console.log('not')
      await writeFile(file, JSON.stringify(response.data, '', 2));
    }
  }
}

main();
