import React from 'react';
import Select from 'react-select';
import "react-select/dist/react-select";
import {FilterContext} from './FilterContext';

const prefinedMonth = {
  label: "months",
  options: [
    {value: '1', label: 'January'},
    {value: '2', label: 'February'},
    {value: '3', label: 'March'},
    {value: '4', label: 'April'},
    {value: '5', label: 'May'},
    {value: '6', label: 'June'},
    {value: '7', label: 'July'},
    {value: '8', label: 'August'},
    {value: '9', label: 'September'},
    {value: '10', label: 'October'},
    {value: '11', label: 'November'},
    {value: '12', label: 'December'},
  ]
}

const endpoints = ["areas", "ages", "genders", "years"];

const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const groupBadgeStyles = {
  backgroundColor: '#EBECF0',
  borderRadius: '15em',
  color: 'black',
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 'normal',
  lineHeight: '1',
  minWidth: 1,
  padding: '0.16666666666667em 0.5em',
  textAlign: 'center',
};

const formatGroupLabel = data => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);


var groupedOptions = [];
groupedOptions.push(prefinedMonth);

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {jwt: this.props.key, values: [], grabbed: false};
  }

  fetchGroups(){
    let getParam = { method: "GET" };
    //https://172.22.30.154:443/login
    var baseUrl = "https://cab230.hackhouse.sh/";//"https://localhost:443/";
    var self = this;

    for (var e = 0; e < endpoints.length; e++ ){
      let endpoint = endpoints[e];
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

          var groupedOption = {label:endpoint, options: tempEndpointOptions};

          groupedOptions.push(groupedOption);
          self.setState({values: groupedOptions});

          })
          .catch(function(error) {
            console.log(
              "There has been a problem with your fetch operation: ",
              error.message
            );
          });
        }

  }

  handleChange(selectedFilters) {
    selectedFilters.forEach( selectedFilter => {
      var referenceOptions = this.state.values;
      var groupJSON;
      var groupOptionArray;
      for (var e = 0; e < endpoints.length; e++) {
        groupJSON = referenceOptions[e];
        groupOptionArray = groupJSON["options"];
        if (groupOptionArray.includes(selectedFilter)){
          //console.log(groupJSON["label"]);
        }
      }
      //console.log(`Selected: ${selectedFilter.label} ${selectedFilter.value}`);
    });

  }

  render() {
    if (!this.state.grabbed) {
      this.fetchGroups();
      this.setState({grabbed: true});
    }

    return (

    <div className="searchBar">
      <h3>Now filter by age, area, gender and/or years</h3>
      <FilterContext.Consumer>
      {(context) => (
        <Select id="searchBar"
        closeMenuOnSelect={false}
        isMulti
        value = {context.state.filtersRaw}
        options={this.state.values}
        formatGroupLabel={formatGroupLabel}
        onChange={event=> {context.setFilters(event, this.state.values);}}
        />
      )}
      </FilterContext.Consumer>
     </div>



    );
  }
}
// put in redner function for all the selections, and then... use context to store the grabbed values.
export default SearchBar;
