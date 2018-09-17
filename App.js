'use strict';
import SearchPage from './SearchPage';//import searchpage class from SearchPage.js
import React, { Component } from 'react'; // 1
import {
  Platform,
  StyleSheet,
  Text,
  View,
  NavigatorIOS
} from 'react-native';

export default class App extends Component{
  render(){
    return(
      <NavigatorIOS
        style={styles.container}
        initialRoute={{title: 'Property Finder', component: SearchPage,}}
      />
    );
  }
}
const styles = StyleSheet.create({ 
  description: {
    fontSize: 18,
    textAlign: 'center',
    color: '#656565',
    marginTop: 65,
  },
  container:{
    flex:1,
  }
 }); // 4
