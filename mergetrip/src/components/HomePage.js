import React, { Component } from "react";
import './HomePage.css';
import { withRouter } from 'react-router-dom';
import leftBoarding from './BoardingLeft.svg'
import rightBoarding from './BoardingRight.svg'
import scrollButton from './ScrollButton.svg'

class HomePage extends Component {
  constructor() {
    super();
    this.onSignUp = this.onSignUp.bind(this);
  }

  onSignUp() {
    this.redirect();
  }

  redirect() {
    this.props.history.push('/account');
  }
  /*
  pageScroll() {
    window.scrollBy (500, 500);
  }*/

  render() {
    return (
      <><div className="HomePage" id="PageOne">
        <img src={leftBoarding} className="Homepage-left" alt="boarding-left" />
        <img src={rightBoarding} className="Homepage-right" alt="boarding-right" />
        <style>
          @import url("https://use.typekit.net/osw3soi.css");
        </style>
        <button className="HomePage-button" onClick={this.onSignUp}>
          Sign Up
        </button>
        <header className="HomePage-header">
          MERGETRIP
          <span className="HomePage-subtitle">No More Stress</span>
        </header>
        <a className="HomePage-Scroll-Button" href="#pageTwo"><span></span>Button</a>

        
      </div>
      <div className="HomePage" id="pageTwo">
        Second page going here later
        <header className="HomePage-subtitle">MergeTrip can seemlesly create 
          travel itineraries just by linking to your email
          <a id="secondPage">See if this works</a>
        </header>
      </div></>
    );
  }

}

//<button className="HomePage-Scroll-Button" href="#secondPage">button</button>

export default withRouter(HomePage);