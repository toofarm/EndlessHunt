// import * as firebase from './firebase'
import firebaseApp from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

  var config = {REPLACE_WITH_YOUR_CONFIG_OBJECT}

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
