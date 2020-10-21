import React from 'react';
import {JWTContext} from './JWTContext'

class AuthenticationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {submission: ""}
  }

  handleClickRegister(event){
    this.setState({submission: "register"});
  }

  handleClickLogin(event){
    this.setState({submission: "login"});
  }

  render() {
    return (

      <div className="loginPageBackground" id="loginPageBackgroundId">
        <JWTContext.Consumer>
          {(context) => (
          <form id = "inputForm"
          onSubmit={event=> {context.setJWT(event, this.state.submission);}}>
          <div className ="formContents">
          <h1> Welcome to CrimeConsumers </h1>
          <h2> Australia's best crimestats </h2>
          <h3 id="formMessage"></h3>
          <label htmlFor="email">Email: </label>
          <input name="email" id="email" type="text" />
          <label htmlFor="password">Password: </label>
          <input name="password" id="password" type="password" />
          <div className= "formButtons">
          <button type="submit" onClick={this.handleClickLogin.bind(this)} >Login</button>
          <button type="submit" onClick={this.handleClickRegister.bind(this)}>Register</button>
          </div>
          </div>
        </form>
          )}
      </JWTContext.Consumer>
      </div>
    )

  }
}

export default AuthenticationForm;
