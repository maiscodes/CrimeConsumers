import React from 'react';
import {FilterContext} from './FilterContext';
import {JWTProvider, JWTContext} from './JWTContext';


class SearchButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { results: [] };
  }

  searchResults = (filters, JWT, filterContext) => {
    if(!filters["offence"].value){
      document.getElementById("offenceError").innerHTML = "Please select an offence";
      return;
    }
    //console.log("filters contains");
      //console.log(filters["offence"].value);
      let endpoint = ["offence", "area", "age", "year", "gender"];
      let filterUrl = "offence=" + filters[endpoint[0]].value;

      for (var e = 1; e < endpoint.length; e++) {
        var selectedEndpoint = filters[endpoint[e]];
        if (selectedEndpoint == "" || selectedEndpoint == []) {
          //console.log(endpoint[e] + "is empty");
        }
        else{
          var selectionEndpoint = filters[endpoint[e]];
          //console.log("selectionEdnpoint is");
          //console.log(selectionEndpoint);
          var selected = "";
          filterUrl += "&" + endpoint[e] + "=";
          for (var s = 0; s < selectionEndpoint.length; s++) {
            filterUrl += selectionEndpoint[s].value;
            if (s < selectionEndpoint.length - 1) {
              filterUrl += ",";
            }
          }
          console.log(filterUrl);
        }
      }

      //The parameters of the call
      let getParam = { method: "GET" };
      //console.log("jwt of search button is");
      //console.log({JWT});
      let head = { Authorization: `Bearer ${JWT}` };
      getParam.headers = head;

      //The URL
      //https://172.22.30.154:443/search?

      const baseUrl = "https://cab230.hackhouse.sh/search?";

      const url = baseUrl + filterUrl;
      console.log(url);

      fetch (encodeURI(url),getParam)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((result) => {
        this.setState({results: result["result"]}, function(){
            console.log(this.state.results)});
        filterContext.setResults(this.state.results);

      })
      .catch(function(error) {
        document.getElementById("resultMessage").innerHTML = "Whoops something went wrong. Please refresh and try again";
        console.log("Problem with fetch: ",error.message);
      });
  }

  render() {
    return (
      <div className="search">
         <JWTContext.Consumer>
         {(jwt) => (

             <FilterContext.Consumer>
               {(filters) => (

                   <button onClick={event=> {this.searchResults(filters.state.filters, jwt.state.jwt, filters); }}>View Statistics</button>

               )}
             </FilterContext.Consumer>

         )}
         </JWTContext.Consumer>
      </div>
    );
  }


}

export default SearchButton;
