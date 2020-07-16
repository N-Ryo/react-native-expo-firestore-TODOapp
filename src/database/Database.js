import firebase from 'firebase';
import 'firebase/firestore'

export default class Database {
  static instance;

  constructor() {
    if (!Database.instance) {
      return this.createInstance();
    }

    return Database.instance;
  }

  createInstance = async () => {
    const firebaseConfig = {
      apiKey: "AIzaSyApmsLCNSWLjYhJgA68ceC6mv8jo30TFeY",
      authDomain: "awesomeproject-d54a1.firebaseapp.com",
      databaseURL: "https://awesomeproject-d54a1.firebaseio.com",
      projectId: "awesomeproject-d54a1",
      storageBucket: "awesomeproject-d54a1.appspot.com",
      messagingSenderId: "336315412032",
      appId: "1:336315412032:web:bd7a4c3df7fef2237f39a5"
    };

    this.app = firebase.initializeApp(firebaseConfig);
    this.database = this.app.firestore();
    Database.instance = this;
    console.log(Database.instance.app.auth())
    return Database.instance;
  }
}