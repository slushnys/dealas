const functions = require("firebase-functions");
const { Nuxt } = require("nuxt-start");
// const { Nuxt } = require("nuxt");
// const express = require("express");
// const app = express();

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
const readyPromise = nuxt
  .ready()
  .then(() => {
    isReady = true;
  })
  .catch(() => {
    process.exit(1);
  });

async function handleRequest(req, res) {
  if (!isReady) {
    await readyPromise;
  }
  // res.set("Cache-Control", "public, max-age=1, s-maxage=1");
  await nuxt.render(req, res);
}

// app.get("*", handleRequest);
// app.use(handleRequest);

// exports.ssrapp = functions.https.onRequest((req, res) => nuxt.render(req, res));
exports.ssrapp = functions.https.onRequest(handleRequest);
