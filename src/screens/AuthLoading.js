import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  View,
  AsyncStorage,
} from 'react-native';
import PropTypes from 'prop-types';
import User from '../database/User';

export default class AuthLoading extends React.Component {
  async componentDidMount() {
    const { navigation } = this.props;
    const user = await User
    const app = await user.app
    app.auth().onAuthStateChanged((currentUser) => {
      if (currentUser) {
        navigation.navigate('App');
        AsyncStorage
          .setItem('currentUser', JSON.stringify(currentUser))
          .catch(e => console.log('AuthLoading:AsyncStorage error >>', e));
      } else {
        navigation.navigate('Signup');
      }
    }, (error) => {
      navigation.navigate('Login', { error });
    });
  }

  render() {
    return (
      <View>
        <StatusBar barStyle="default" />
        <ActivityIndicator />
      </View>
    );
  }
}

AuthLoading.propTypes = {
  navigation: PropTypes.object,
};