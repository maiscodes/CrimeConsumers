import React from 'react';
import Select from 'react-select';
import "react-select/dist/react-select";
import {FilterContext} from './FilterContext';



class SearchOffences extends React.Component {
  constructor(props) {
    super(props);
    this.state = {values: [], grabbed: false, selectedValue: ""};
  }

  fetchOffences() {
    let endpoint = "offences";
    let getParam = { method: "GET" };
    //https://172.22.30.154:443/
    var baseUrl = "https://cab230.hackhouse.sh/";
    var self = this;
    var url = baseUrl + endpoint;
    console.log(url);

      fetch(encodeURI(url, getParam))
        .then(function(response) {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Network response was not ok.");
        })
        .then(function(result) {
          var tempEndpointOptions = [];
          for (var i=0; i < result[endpoint].length; i++ ){
              var singleOption = {value: '', label: ''};
              singleOption.value = result[endpoint][i];
              singleOption.label = result[endpoint][i];
              tempEndpointOptions.push(singleOption);
          }

          self.setState({values: tempEndpointOptions});
          return tempEndpointOptions;

          })
          .catch(function(error) {
            console.log(
              "There has been a problem with your fetch operation: ",
              error.message
            );
          });
  }

  addOffence(selectedOffence){
    this.setState({selectedValue: selectedOffence});
  }

  render() {
  if (!this.state.grabbed) {
    this.fetchOffences();
    this.setState({grabbed: true});
  }

    return (
    <FilterContext.Consumer>
    {(context) => (
      <div className="searchBar">
        <h3>Choose an offence*</h3>
        <h4 id="offenceError" className = "error"></h4>
        <Select id = "searchOffences"
        closeMenuOnSelect={false}
        isSearchable = {true}
        value = {context.state.filters.offence}
        options={this.state.values}
        onChange={event=> {context.setOffence(event);}}
        />
       </div>
    )}
    </FilterContext.Consumer>
    );
  }
}


export default SearchOffences;
