// import * as firebase from './firebase'
import firebaseApp from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

var config = {
    apiKey: "AIzaSyBiDdge5fKT51vEWUH1S-6JjtGB8zUzKhM",
    authDomain: "the-hunt-c4a4c.firebaseapp.com",
    databaseURL: "https://the-hunt-c4a4c.firebaseio.com",
    projectId: "the-hunt-c4a4c",
    storageBucket: "the-hunt-c4a4c.appspot.com",
    messagingSenderId: "388329766106"
    }

  if (!firebaseApp.apps.length) {
      firebaseApp.initializeApp(config)
  }

  const auth = firebaseApp.auth()
  const db = firebaseApp.database()
  const storage = firebaseApp.storage()

  export {
      auth,
      db,
      storage
  }