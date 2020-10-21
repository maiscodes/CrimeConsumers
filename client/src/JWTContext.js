
import React, {createContext} from 'react';

export const JWTContext = createContext();

const clearInputs = () => {
  let inputEmail = document.getElementById("email");
  inputEmail.value = "";

  let inputPassword = document.getElementById("password");
  inputPassword.value = "";
}

export class JWTProvider extends React.Component {
  state = { jwt: ""};

  handleSubmission(event, type){
    event.preventDefault();
    if (type === "register") {
      console.log("Registration has been activated");
      if (event.target.elements.email.value === "" || event.target.elements.password.value ==="") {
        let messageDiv = document.getElementById("formMessage");
        messageDiv.style.color = "red";
        messageDiv.innerHTML = "Hey, you have one or more empty fields.";
      }
      else {
        this.Register(
          event.target.elements.email.value,
          event.target.elements.password.value
        );
        console.log("Registration has been completed");
      }
    }
    if (type === "login") {
      if (event.target.elements.email.value === "" || event.target.elements.password.value ==="") {
        let messageDiv = document.getElementById("formMessage");
        messageDiv.style.color = "red";
        messageDiv.innerHTML = "Hey, you have one or more empty fields.";
      }
      else {
        console.log("Login has been activated");
          this.Login(
          event.target.elements.email.value,
          event.target.elements.password.value
        );
        console.log("Login has been completed");
      }
    }
  }

  Register(email, password) {
    var body = "email=" + email + "&password=" + password;
    //https://172.22.30.154:443/register
    fetch("https://cab230.hackhouse.sh/register", {
      method: "POST",
      body: body,
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      }
    })
      .then(function(response) {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok");
      })
      .then(function(result) {
        let messageDiv = document.getElementById("formMessage");
        messageDiv.style.color = "green";
        messageDiv.innerHTML = "Successfully registered! Please login with your new details.";
      })
      .catch(function(error) {
        let messageDiv = document.getElementById("formMessage");
        messageDiv.style.color = "red";
        messageDiv.innerHTML = "Oh no, something came up. Please try again or use a new email.";
        console.log(
          "There has been a problem with your fetch operation: ",
          error.message
        );
      });
  }


  Login = (email, password) => {
    var body = "email=" + email + "&password=" + password;
    //https://172.22.30.154:443/login
    fetch("https://cab230.hackhouse.sh/login", {
      method: "POST",
      body: body,
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      }
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Oops! Network response was not ok.");
      })
      .then((result) => {
        let errorMessage = document.getElementById("formMessage");
        errorMessage.innerHTML = "";

        let JWT = result.access_token;
        console.log("Successfuly logged in");
        this.setState({jwt: JWT});

        clearInputs();
        let formDiv = document.getElementById("inputForm");
        formDiv.style.visibility = "hidden";

        let formContainerDiv = document.getElementById("loginPageBackgroundId");
        formContainerDiv.style.background = "rgba(0,0,0,0)";
        formContainerDiv.style.visibility = "hidden";

      })
      .catch(function(error) {
        let errorMessage = document.getElementById("formMessage");
        errorMessage.style.color = "red";
        errorMessage.innerHTML = "The email and password you have entered do not match our records. Please try again.";
        console.log(
          "Oh no! There was a problem with this operation. Please try again. ",
          error.message
        );
      });
  }

  clearJWT = () => {
    console.log("JWT has been cleared");
    this.setState({jwt: ""});
  }


  render(){
    return(
      <JWTContext.Provider value={{state: this.state, setJWT: (event, type) => {this.handleSubmission(event, type);}, logoutJWT: () =>{this.clearJWT();}}}>
        {this.props.children}
      </JWTContext.Provider>

    );
  }
}
