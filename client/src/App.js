import React from "react";
import ReactDOM from "react-dom";

import "./styling/styles.css";
import "./styling/filters.css";
import "./styling/googlemaps.css";
import "./styling/table.css";
import "./styling/bargraph.css";


import ResultTypeSelector from './ResultTypeSelector';
import SearchBar from './SearchBar';
import SearchOffences from './SearchOffences';
import AuthenticationForm from './AuthenticationForm';
import SearchButton from "./SearchButton";

import {FilterProvider} from './FilterContext';
import {JWTProvider} from './JWTContext';
import {LogoutButton} from './LogoutButton';
import {ChartWrapper} from './Chart.js';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {jwt: ""}
  }


 render() {
   return (
         <div>
            <JWTProvider>

            <AuthenticationForm/>

           <div className = "homepage">
             <FilterProvider>
             <div className="menu">
              <ul>
              <li> <h1>CrimeConsumers</h1></li>
               <li><LogoutButton/></li>
              </ul>
             </div>

            <div className="content">
            <div className = "filters">
            <SearchOffences/>
            <SearchBar/>
            <ResultTypeSelector />
            <SearchButton />
            </div>

            <ChartWrapper />
            </div>
             </FilterProvider>
             <h2 id = "userMessage"></h2>
             </div>

             </JWTProvider>



         </div>
     );
   }

}




const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);


export default App;
