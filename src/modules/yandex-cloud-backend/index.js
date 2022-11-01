const fetch = require("node-fetch");

module.exports.handler = async function (event) {
  const text = event.queryStringParameters.text;
  let targetLanguageCode = event.queryStringParameters.targetLanguage;
  if (!targetLanguageCode) {
    targetLanguageCode = "en";
  }
  const response = await fetch(
    "https://translate.api.cloud.yandex.net/translate/v2/translate",
    {
      method: "POST",
      headers: {
        Authorization: "Api-Key ...",
      },
      body: JSON.stringify({
        targetLanguageCode,
        texts: [text],
      }),
    }
  );
  const result = await response.json();
  return {
    statusCode: 200,
    body: {
      translations: result.translations,
    },
  };
};
