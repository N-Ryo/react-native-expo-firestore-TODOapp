import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { styles as GlobalStyles } from '../utils/styles'


export const Header = (props) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{props.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    textAlign: 'center',
    justifyContent: 'center'
  },
  headerText: {
    fontSize: GlobalStyles.fontSize,
    fontWeight: '800'
  }
});