import React from 'react';
import {FilterContext} from './FilterContext';
import {JWTContext} from './JWTContext';

export class LogoutButton extends React.Component {
  ReturnLoginPage = (JWT) => {
    let formDiv = document.getElementById("inputForm");
    formDiv.style.visibility = "visible";

    let formContainerDiv = document.getElementById("loginPageBackgroundId");
    formContainerDiv.style.background = "rgba(255,255,255,1)";
    formContainerDiv.style.visibility = "visible";
  }

  render() {

    return (
      <div className = "logoutButton">
         <JWTContext.Consumer>
         {(jwt) => (

             <FilterContext.Consumer>
               {(filters) => (

                   <button onClick={event=> {filters.clearEverything(); jwt.logoutJWT(); this.ReturnLoginPage(jwt.state.jwt);}}>Logout</button>

               )}
             </FilterContext.Consumer>

         )}
         </JWTContext.Consumer>
      </div>
    );
  }

}
