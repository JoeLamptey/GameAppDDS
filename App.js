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
import {Auth} from 'aws-amplify'

import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });


class App extends Component{

  constructor(props){
    super(props)

    this.state = {
      users: [],
      current: {email: 'email', phone: 'phone'}
    }
  }

  componentWillMount(){
    // const userId = "4892a632-7295-4e70-adfb-9bc79bce0f86"
    // this.deleteUser(userId)
    Auth.currentAuthenticatedUser().then((user)=>{
      let email = user.attributes.email
      let phone = user.attributes.phone_number
      //let user = { email, phone } 
      // console.log(user.attributes.email)
      // console.log(user.attributes.phone_number)
      this.setState({current: {email, phone}})
    }).catch(err=> console.log(err))
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
      users = res.data.listUsers.items
      console.log(res.data.listUsers.items)
      this.setState({users})
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
        <Text style={styles.welcome}>Distributed System Game</Text>
        <Text style={styles.instructions}>Innopolis University</Text>
        <Text style={styles.instructions}>
          [ {this.state.current.email}, {this.state.current.phone} ]
        </Text>
        {/* <Button title='Start Game' onPress={this.listUsers}/> */}
        <Button title='Start Game' />
      </View>
    );
  }
}

export default withAuthenticator(App, {includeGreetings: false})

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
