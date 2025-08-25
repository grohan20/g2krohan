import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyBOSoKqS4hzvfuV02l3JnbDHEit50JATpQ",
  authDomain: "g2k-rohan.firebaseapp.com",
  databaseURL: "https://g2k-rohan-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "g2k-rohan",
  storageBucket: "g2k-rohan.firebasestorage.app",
  messagingSenderId: "848424847169",
  appId: "1:848424847169:web:1855ad3ce4626e3da4c3c0",
}

const app = initializeApp(firebaseConfig)
export const database = getDatabase(app)
