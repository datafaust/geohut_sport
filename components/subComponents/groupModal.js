import React, {Component} from 'react';
import {StyleSheet,Modal, TouchableOpacity,View,ActivityIndicator, Switch} from 'react-native';
import {Container, Header, Content, ListItem, List, Icon, Button, Left,Input, Body, Title,Text, Form,Textarea, Right,Tab,Tabs} from 'native-base';
import { connect } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';




class YourGroup extends Component {

    state = {
    

            submittedAnimation: false,
            members:["none here"],
            waitlist:["none here"],
            changedState: false
        
        
    }

    componentDidMount() {

        console.log('first skometing')
        this.getMembers()
        this.getWaitlist()
      }

      componentDidUpdate(prevProps, prevState) {
        // Typical usage (don't forget to compare props):
        if (this.props.id !== prevProps.id || prevState.changedState !== this.state.changedState) {
            this.getMembers()
            this.getWaitlist()
        }
      }


      refreshPage = () =>{
        this.getMembers()
        this.getWaitlist()
      }


 


      getMembers = () =>{
        fetch(`${global.x}/get_group_members/${this.props.id}`)
        .then((res) => res.json())
        .then((res) => {

       

          fetch(`${global.x}/get_users/${res.data[0]["JSON_EXTRACT(members, '$')"]}`)
          .then((res) => res.json())
          .then((res) => {
              //console.log(res.data)
          this.setState({members:res.data})
          
          
          }).catch((error) => {
            console.log(error)
          });
            
        //this.setState({members:JSON.parse(res.data[0]["JSON_EXTRACT(members, '$')"])})
        
        }).catch((error) => {
          console.log(error)
        });
      }

      getWaitlist = () =>{
        console.log('calling waitlist')
        fetch(`${global.x}/get_group_members/${this.props.id}`)
        .then((res) => res.json())
        .then((res) => {

          fetch(`${global.x}/get_users/${res.data[0]["JSON_EXTRACT(waiting, '$')"]}`)
          .then((res) => res.json())
          .then((res) => {
             
          this.setState({waitlist:res.data})
          
          
          }).catch((error) => {
            console.log(error)
          });
            
        //this.setState({members:JSON.parse(res.data[0]["JSON_EXTRACT(members, '$')"])})
        
        }).catch((error) => {
          console.log(error)
        });
      }


      addToGroup = (user_id) => {
       fetch(
          // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
          `${global.x}/remove_from_waitlist?group_id=${this.props.id}&user_id=${user_id}`,
          { method: "PUT" }
        ).catch((error) => {
          console.log(error)
        })

        fetch(
          // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
          `${global.x}/add_group_members?group_id=${this.props.id}&user_id=${user_id}`,
          { method: "PUT" }
        ).catch((error) => {
          console.log(error)
        })

        alert('Added!')

        this.setState({changedState: !this.state.changedState})


      }

      removeFromGroup = (user_id) => {
        fetch(
          // MUST USE YOUR LOCALHOST ACTUAL IP!!! NOT http://localhost...
          `${global.x}/remove_group_members?group_id=${this.props.id}&user_id=${user_id}`,
          { method: "PUT" }
        ).catch((error) => {
          console.log(error)
        })
        alert('Removed!')
        this.setState({changedState: !this.state.changedState})
      }




  render() {


    return (
        <React.Fragment>
        <Modal
          animationType="slide"
          transparent={false}
          visible={true}
          visible={this.props.reducer.yourGroupModal}
          >

<Container>
        <Header style = {{backgroundColor:'#e3e8e6'}}>
        <Left>
            <Button transparent onPress={this.props.closeYourPlaygroundModal}>
              <Icon name='arrow-back' style = {{color:'black'}}/>
            </Button>
          </Left>
          <Body>
            <Title style = {{color:'black'}}>{this.props.title}</Title>
          </Body>
          <Right>
            <TouchableOpacity onPress={this.refreshPage}>
          <MaterialCommunityIcons name="refresh" size={35} color="green" />
          </TouchableOpacity>
          </Right>
        </Header>
        <Tabs tabBarUnderlineStyle={{backgroundColor:'grey'}}>
        <Tab tabStyle ={{backgroundColor: '#e3e8e6'}} activeTextStyle={{color: 'grey', fontWeight: 'bold', fontSize:18}} activeTabStyle={{backgroundColor: '#e3e8e6'}} textStyle={{color: 'grey', fontWeight: 'normal'}} heading="Members">
        
        <List>
        
        {this.state.members.map((object,index) =>
          
          <ListItem  key = {index}>
  <Left>
<Text>{object['first_name'] +' '+ object['last_name']}</Text>
  </Left>
  </ListItem>)}

  </List>

  </Tab>

  {this.props.admin === this.props.reducer.userId[3] &&
          <Tab tabStyle ={{backgroundColor: '#e3e8e6'}} activeTextStyle={{color: 'grey', fontWeight: 'bold', fontSize:18}} activeTabStyle={{backgroundColor: '#e3e8e6'}} textStyle={{color: 'grey', fontWeight: 'normal'}} heading="Admin">

<List>
<ListItem itemDivider>
              <Text style ={{fontWeight:'bold',fontSize:18}}>Waitlist</Text>
            </ListItem>   
        {this.state.waitlist.map((object,index) =>

        
       
          <ListItem  key = {index}>
  <Left>
<Text>{object['first_name'] +' '+ object['last_name']}</Text>
  </Left>
  <Right>
  {object['email'] === this.props.admin?<Text>Admin</Text>:
    <TouchableOpacity 
    onPress={() => this.addToGroup(object['email']) }
    >
<AntDesign name="adduser" size={30} color="green"/>  
</TouchableOpacity>}
  </Right>
        </ListItem>)}
        <ListItem itemDivider>
              <Text style ={{fontWeight:'bold',fontSize:18}}>Members</Text>
            </ListItem> 
            {this.state.members.map((object,index) =>

        
       
<ListItem  key = {index}>
<Left>
<Text>{object['first_name'] +' '+ object['last_name']}</Text>
</Left>
<Right>
{object['email'] === this.props.admin?<Text>Admin</Text>:
<TouchableOpacity 
onPress={() => this.removeFromGroup(object['email']) }

>
<AntDesign name="deleteuser" size={30} color="red"/>  
</TouchableOpacity>}
</Right>
</ListItem>)}

  </List>


          </Tab>
}

            </Tabs>
  
      </Container>


      {this.state.submittedAnimation && (
            <View style={styles.loading}>
              <ActivityIndicator
                animating={this.state.submittedAnimation}
                style={{ left: "0.5%", bottom: "40%" }}
                size="large"
                color="white"
              />
            </View>
          )}


        </Modal>


        </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    backgroundColor: "#666570",
    opacity: 0.8,
  },
    container: {
      
      backgroundColor: '#fff',
      justifyContent: 'center',
      padding: 25
    },
  });



const mapStateToProps = (state) => {
    
    const { reducer } = state
    return { reducer }
  };

  const mapDispachToProps = dispatch => {
    return {
      closeYourPlaygroundModal: () => dispatch({ type: "OPEN_CLOSE_YOUR_GROUP_MODAL", value: false})
      
     
    };
  };

  export default connect(mapStateToProps,
    mapDispachToProps
    )(YourGroup)