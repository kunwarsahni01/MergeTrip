import React, { Component } from "react";
import './HomePage.css';
import { withRouter } from 'react-router-dom';
import leftBoarding from './BoardingLeft.svg'
import rightBoarding from './BoardingRight.svg'
import downArrow from './DownArrow.svg'
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

  scroll() {
    window.scrollBy(0, 8000);
  }

  toTop() {
    window.scrollBy(0, -100000);
  }


  render() {
    return (
      <><div className="HomePage" id="HomePage">
        <img src={leftBoarding} className="Homepage-left" alt="boarding-left" />
        <img src={rightBoarding} className="Homepage-right" alt="boarding-right" />
        <style>
          @import url("https://use.typekit.net/osw3soi.css");
        </style>
       
        <button className="home-button" onClick={this.toTop}>
          MergeTrip
        </button>
        <button className="HomePage-button" onClick={this.onSignUp}>
          Log In / Sign Up
        </button>
        
        <h1 className="HomePage-header">
          MERGETRIP
          <span className="HomePage-subtitle">No More Stress</span>
          <button className="HomePage-Scroll-Button" onClick={this.scroll}>
            <img src={downArrow}></img>
          </button>
        </h1>
        
        {
          //<a className="HomePage-Scroll-Button" href="#pageTwo"><span></span><img src={downArrow}></img></a>
        }
        

        <header className="HomePage-subtitle" id="pageTwo">MergeTrip can seemlesly create 
          travel itineraries just by linking to your email
          <a id="secondPage">See if this works</a>
        </header>

        
      </div>
      {/*}
      <div className="HomePage" id="pageTwo">
        Second page going here later
        <header className="HomePage-subtitle">MergeTrip can seemlesly create 
          travel itineraries just by linking to your email
          <a id="secondPage">See if this works</a>
        </header>
      </div>
    */}
      </>
    );
  }

}

export default withRouter(HomePage);