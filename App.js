/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import {withAuthenticator} from 'aws-amplify-react-native'

import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


class App extends Component{

  componentWillMount(){
    const userId = "4892a632-7295-4e70-adfb-9bc79bce0f86"
    this.deleteUser(userId)
    
  }

  listUsers= async()=>{
    const listUsers = `
      query listUsers{
        listUsers {
          items{
            id
            email
            password
          }
        }
      }
    `
    await API.graphql(graphqlOperation(listUsers)).then(res=>{
      console.log(res.data.listUsers.items)
    }).catch(err => console.log('Error: ', err))
  }

  createUser=async (user)=>{
    const userQuery=`
      mutation createUser{
        createUser(input: {
            email: ${user.email},
            password: ${user.password}
        }){
            id
            email
            password
        }
      }
    `
      await API.graphql(graphqlOperation(userQuery)).then(res=>{
          console.log(res.data.createUser)
      }).catch(err => console.log('Error: ', err))
  }

  deleteUser = async(id)=>{
    const deleteUser=`
      mutation deleteUser{
        deleteUser(input: {id: "${id}"}){
          id
          email
          password
        }
      }
    `
    await API.graphql(graphqlOperation(deleteUser)).then(res=>{
      console.log(res.data.deleteUser)
    }).catch(err => console.log('Error: ', err))
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Distributed System</Text>
        <Text style={styles.instructions}>Innopolis University</Text>
        <Button title='Users' onPress={this.listUsers}/>
        {/* <Text style={styles.instructions}>{instructions}</Text> */}
      </View>
    );
  }
}

export default withAuthenticator(App, {includeGreetings: true})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#55a',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#fff'
  },
  instructions: {
    textAlign: 'center',
    color: '#fff',
    marginBottom: 5,
  },
});
