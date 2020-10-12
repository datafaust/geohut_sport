import React, {Component} from 'react';
import {StyleSheet,Modal, TouchableOpacity} from 'react-native';
import {Container, Header, Content, Card, CardItem,  Button, Left,Right, Body, Title,Text, Tab, Tabs,TabHeading} from 'native-base';
import { connect } from 'react-redux';
import PageTemplate from "./subComponents/Header";
import { View } from 'react-native-animatable';
import moment from "moment";




class Players extends Component {

    state = {
         players: [],
         preChecks: []
    }

    componentDidMount() {
        this.getPlayers()
        
    }

    getPlayers = () => {
      
    fetch(`${global.x}/players/${this.props.reducer.playgroundId}`)
    .then((res) => res.json())
    .then((res) => {
        
    this.setState({players:res.data})
    }).catch((error) => {
      console.log(error)
    });


    fetch(`${global.x}/pre_checks/${this.props.reducer.playgroundId}`)
    .then((res) => res.json())
    .then((res) => {
        
    this.setState({preChecks:res.data})
    }).catch((error) => {
      console.log(error)
    });

}




  //FUNCTION: LOGS OUT
  logout = () => {
    firebase
      .auth()
      .signOut()
      .catch((error) => console.log(error));

    this.props.navigation.navigate("StartScreen");
  };

// selectPlayground = (name,id,lat,lon) => {
// this.props.storePlayground(name,id,lat,lon)

// }


  render() {

  console.log(global.addr)
      
    return (
      <Container>
        <PageTemplate title={"Players"} logout={this.logout} />
        <Tabs tabBarUnderlineStyle={{backgroundColor:'grey'}}>
        <Tab tabStyle ={{backgroundColor: '#5cb85c'}} activeTextStyle={{color: '#fff', fontWeight: 'bold', fontSize:18}} activeTabStyle={{backgroundColor: '#5cb85c'}} textStyle={{color: '#fff', fontWeight: 'normal'}} heading="Playing Now"
          >
        <View style={styles.container}>
        <Button style ={{margin:10}}
                    full
                    rounded
                    success
                    onPress={this.getPlayers}>

                        <Text style = {{color:'white'}}>Refresh</Text>
                    </Button>

                    

                    <Text style = {{fontSize:19}}>Checked In:</Text>
    <Text style = {{fontSize:50}}>{this.state.players.length}</Text>
    </View>
 
        <Content>
          <Card>
          {this.state.players.map((object,index) =>
          
            <CardItem key = {index} style = {{flex:1}}>
              <Left>
              <Text style = {{fontSize:11}}>{object["first_name"]} {object["last_name"]}</Text>  
              </Left>
              <Text style = {{fontSize:11}}>{moment(object["checkin_datetime"]).format('LT')}</Text>
              
            
              
            </CardItem>
        
          )}
          </Card>
        </Content>
      </Tab>
      <Tab tabStyle ={{backgroundColor: '#5cb85c'}} activeTextStyle={{color: '#fff', fontWeight: 'bold', fontSize:18}} activeTabStyle={{backgroundColor: '#5cb85c'}} textStyle={{color: '#fff', fontWeight: 'normal'}} heading="Coming to Play"
          >
      <View style={styles.container}>
        <Button style ={{margin:10}}
                    full
                    rounded
                    success
                    onPress={this.getPlayers}>

                        <Text style = {{color:'white'}}>Refresh</Text>
                    </Button>

                    

                    <Text style = {{fontSize:19}}>Pre-Checked In:</Text>
    <Text style = {{fontSize:50}}>{this.state.preChecks.length}</Text>
    </View>
 
        <Content>
          <Card>
          {this.state.preChecks.map((object,index) =>
        
            <CardItem key = {index}>
              <Left>
              <Text style = {{fontSize:11}} >{object["first_name"]} {object["last_name"]}</Text>  
              </Left>
              <Right><Text style = {{fontSize:11}}>{moment(object["pre_checkin_datetime"]).format('LT')}</Text></Right>
              
            
              
            </CardItem>
        
  )}
          </Card>
        </Content>
      </Tab>


        </Tabs>

      </Container>
    );
  }
}



const mapStateToProps = (state) => {
    
    const { reducer } = state
    return { reducer }
  };

  const mapDispachToProps = dispatch => {
    return {
      //onModalOne: () => dispatch({ type: "CLOSE_MODAL_1", value: false}),
     // storePlayground: (name,id,lat,lon) => dispatch({ type: "STORE_PLAYGROUND", value: name,value1: id, value2:lat,value3:lon})
     
    };
  };

  export default connect(mapStateToProps,
    mapDispachToProps
    )(Players)

    const styles = StyleSheet.create({
      container: {
       
        backgroundColor: "#fff",
        alignItems: "center"
        
      }
    })