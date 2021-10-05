import React, { Component } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";



class SimpleForm extends Component {
  constructor() {
    super();
    this.state = {
        username: "",
        password: "",
    };
    this.onInputchange = this.onInputchange.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    
  }

  onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onSubmitForm() {
    console.log(this.state)
    this.createAccount();
  }

  createAccount() {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, this.state.username, this.state.password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log("Login Succesful")
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
        // ..
      });
    
  }

  render() {
    const { items } = this.state;

    return (
      <div>
        <div>
          <label>
            Username :
            <input
              name="username"
              type="text"
              value={this.state.username}
              onChange={this.onInputchange}
            />
          </label>
        </div>
        <div>
          <label>
            Password :
            <input
              name="password"
              type="text"
              value={this.state.password}
              onChange={this.onInputchange}
            />
          </label>
        </div>
        <div>
            <button onClick={this.onSubmitForm}>Submit</button>
        </div>
      </div>
    );
  }
}

export default SimpleForm;