const functions = require("firebase-functions");
const { Nuxt } = require("nuxt-start");

const nuxtConfig = require("./nuxt.config.js");

const config = {
  ...nuxtConfig,
  dev: false,
  debug: false,
  buildDir: ".nuxt",
  publicPath: "public"
};

const nuxt = new Nuxt(config);

let isReady = false;

async function handleRequest(req, res) {
  if (!isReady) {
    try {
      isReady = await nuxt.ready();
    } catch (error) {
      process.exit(1);
    }
  }
  await nuxt.render(req, res);
}

exports.ssrapp = functions.https.onRequest(handleRequest);
