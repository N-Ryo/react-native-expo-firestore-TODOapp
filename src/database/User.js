/* eslint-disable class-methods-use-this */
import Database from './Database';

class User extends Database {
  signup = async (email, password) => {
    try {
      const response = await this.app.auth().createUserWithEmailAndPassword(email, password);
      this.app.auth().onAuthStateChanged(async (currentUser) => {
        const profile = {
          uid: currentUser.uid,
          name: currentUser.displayName,
          email: currentUser.email,
        };
        await this.database.collection("users").doc(currentUser.uid).set(profile)
      });
      return this._success(response);
    } catch (e) {
      return this._error(e);
    }
  }

  login = async (email, password) => {
    try {
      const self = await this;
      const response = await self.app.auth().signInWithEmailAndPassword(email, password);
      return this._success(response);
    } catch (e) {
      return this._error(e);
    }
  }

  logout = async () => {
    try {
      const self = await this;
      const response = await self.app.auth().signOut();
      return this._success(response);
    } catch (e) {
      console.log(e)
      return this._error(e);
    }
  }

  forgotPassEmail = async (email) => {
    try {
      const response = this.app.auth().sendPasswordResetEmail(email);
      return this._success(response);
    } catch (e) {
      return this._error(e);
    }
  }

  _success = obj => (
    obj ? { status: 'success', ...obj } : { status: 'success' }
  );

  _error = err => (
    { status: 'error', ...err }
  );
}

const user = new User();
// export { user };
export default user;