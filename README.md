# Introduction

The application is a website where users can register, login and add deals that they found online, vote for deals and comment accordingly.

## DEMO

You can check out deployed and working version (however only in Lithuanian language as internationalization isn't applied)

[https://dealas-962d3.firebaseapp.com/](https://dealas-962d3.firebaseapp.com/)

## Technical introduction

This is a Nuxt SSR application ran as a Google Cloud function with the help of Firebase.
These files are hosted on Firebase hosting as well.
In addition to that, Firebase storage is being used to upload static files like pictures for deals and Firestore is used as a real time database.

## Requirements

Globally installed firebase

```bash
npm install -g firebase-tools
```

There are already scripts in place that help you build and configure the deployment automatically defined as predeployment rules in `firebase.json`.

You just need to run the deployment command:

```bash
firebase deploy
```
