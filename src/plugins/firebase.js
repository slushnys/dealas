// <!-- The core Firebase JS SDK is always required and must be listed first -->
// <script src="https://www.gstatic.com/firebasejs/7.5.0/firebase-app.js"></script>

// <!-- TODO: Add SDKs for Firebase products that you want to use
//      https://firebase.google.com/docs/web/setup#available-libraries -->
// <script src="https://www.gstatic.com/firebasejs/7.5.0/firebase-analytics.js"></script>
import firebase from 'firebase'
import 'firebase/firestore' // if use firestore
import 'firebase/storage' // if use storage
import { firebaseConfig } from '@/configs/firebase'
// Your web app's Firebase configuration

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
  // firebase.analytics()
}
// firebase.firestore().settings({ timestampsInSnapshots: true })

export const db = firebase.firestore()
export const auth = firebase.auth()
export const storage = firebase.storage()

export default (context) => {
  const { store } = context

  return new Promise((resolve, reject) => {
    try {
      auth.onAuthStateChanged((user) => {
        resolve(store.dispatch('auth/fetchUser', user))
      })
    } catch (error) {
      reject(error)
    }
  })
}
