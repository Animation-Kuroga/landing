
"restrict"
const axios = require("axios");
const fs = require("fs");
const args = require('yargs').argv;

const isForApp = args.forApp;
console.log(args)
const exe = async (lan) => {
  try {
    const text = await trans(lan);
    await writeToFile(lan, text.replace(/\\n/g, '\n'))
    console.log(`${isForApp ? 'app' : 'web'}: ${lan} translated success`);
  } catch (e) {
    console.warn(`${isForApp ? 'app' : 'web'}: ${lan} translated failed: ${e}`);
  }
  return;
}

const writeToFile = (lan, text) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(`translations/${isForApp ? 'app' : 'langs'}/${lan}.md`, text, (error, data) => {
      error ? reject(error) : resolve(data);
    });
  });
}

const readFromFile = async () => {
  return new Promise((resolve, reject) => {
    fs.readFile(`translations/${isForApp ? 'app' : 'langs'}/en.md`, (error, content) => {
      error ? reject(error) : resolve(content.toString());
    });
  });
}

const trans = async (lan) => {
  const text = await readFromFile();
  const data = JSON.stringify([{Text: text}])
  const options = {
    method: 'POST',
    url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
    params: {
      'to[0]': lan,
      from: 'en',
      'api-version': '3.0',
      profanityAction: 'NoAction',
      textType: 'plain'
    },
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': '2cb47d77c7msh5d475ac228b765bp115ff3jsn074d43e9fef8',
      'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
    },
    data: data
  };
  
  return axios.request(options).then(function (response) {
    return response.data[0].translations[0].text;
  });
}

[
  'zh',
  'zh-TW',
  'zh-HK',
  'ja',
  'ko',
  'zh',
  'da',
  'nl',
  'fi',
  'fr',
  'de',
  'el',
  'hi',
  'it',
  'ja',
  'ko',
  'pl',
  'ru',
  'es',
  'sv',
  'th',
  'uk'
].forEach(async (v) => {
  await exe(v)
})
// exe();
// axios.request(options).then(function (response) {
// 	console.log(response.data);
// }).catch(function (error) {
// 	console.error(error);
// });