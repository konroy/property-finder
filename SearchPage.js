'use strict';
import SearchResults from './SearchResults';
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Button,
    ActivityIndicator,
    Image,
    ScrollView,
  } from 'react-native';

function urlForQueryAndPage(key, value, pageNumber){
    const data={
        country: 'uk',
        pretty: '1',
        encoding: 'json',
        listing_type: 'buy',
        action: 'search_listings',
        page: pageNumber,
    };
    data[key] = value;

    const querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');

    return 'https://api.nestoria.co.uk/api?' + querystring;
}

//urlForQueryAndPage doesn’t depend on SearchPage, so it’s implemented as a free function rather than a method.
//It first creates the query string based on the parameters in data. 
//Then it transforms the data into name=value pairs separated by ampersands. 
//Finally, it calls the Nestoria API to return the property listings.

export default class SearchPage extends Component{
    
    constructor(props){
        super(props);
        this.state={
            searchString: 'liverpool',
            isLoading: false, //isLoading property will keep track of whether a query is in progress.
            message: '',
        };
    }

    _onSearchTextChanged = (event) => {
        console.log('_onSearchTextChanged');
        this.setState({searchString: event.nativeEvent.text});
        console.log('Current: '+this.state.searchString+', Next: '+event.nativeEvent.text);
    };//this is event handler

    _executeQuery = (query) => {
        console.log(query);
        this.setState({isLoading: true});

        fetch(query)
            .then(response => response.json())
            .then(json => this._handleResponse(json.response))
            .catch(error =>
                this.setState({
                    isLoading: false,
                    message: 'Opps' + error
                })
            );
        //This makes use of the fetch function, which is part of the Fetch API. The asynchronous response is returned as a Promise. 
        //The success path calls _handleResponse which you’ll define next, to parse the JSON response.
    };
    //will eventually run the query, but for now it simply logs a message to the console 
    //and sets isLoading appropriately so the UI can show the new state.

    _onSearchPressed = () => {
        const query = urlForQueryAndPage('place_name', this.state.searchString, 1);
        this._executeQuery(query);
    };
    //configures and initiates the search query. This should kick off when the Go button is pressed. 
    
    _handleResponse = (response) => {
        this.setState({isLoading: false , message: ''});
        if (response.application_response_code.substr(0,1) === '1'){
            this.props.navigator.push({
                title: 'Results',
                component: SearchResults,
                passProps: {listings: response.listings}
            });
            //This navigates to your newly added SearchResults component and passes in the listings from the API request. 
            //Using the push method ensures the search results are pushed onto the navigation stack, 
            //which means you’ll get a Back button to return to the root.
         }
         else{
             this.setState({message: "Location not recognized. Please try again"});
         }
    };
    //This clears isLoading and logs the number of properties found if the query was successful.

    render(){
        const spinner = this.state.isLoading ? <ActivityIndicator size='large'/> : null;
            //This is a ternary if statement that optionally adds an activity indicator, 
            //depending on the component’s isLoading state.
        return (
            <ScrollView>
            <View style={styles.container}>
                <Text style={styles.description}>
                    Search Houses to Buy!
                </Text>
                <Text style={styles.description}>
                     Search by place-name or postcode.
                </Text>
                <View style={styles.flowRight}>
                    <TextInput
                    style={styles.searchInput}
                    value={this.state.searchString}
                    onChange={this._onSearchTextChanged}
                    placeholder='Search'/>
                 <Button
                    onPress={this._onSearchPressed}
                    color='#48BBEC'
                    title='Go'/>
                </View>
                <Image source={require('./Resources/house.png')}
                    style={styles.image}/>
                {spinner}
                <Text style={styles.description}>{this.state.message}</Text>
            </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    description: {
        marginBottom: 20,
        fontSize: 20,
        textAlign: 'center',
        color: '#656565'
    },
    container: {
        padding: 30,
        marginTop: 65,
        alignItems: 'center'
    },
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    searchInput: {
        height: 36,
        padding: 4,
        marginRight: 5,
        flexGrow: 1,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#48BBEC',
        borderRadius: 8,
        color: '#48BBEC',
    },
    image: {
        width: 217,
        height: 138,
    },
});