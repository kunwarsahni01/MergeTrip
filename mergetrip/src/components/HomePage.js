import React, { Component } from "react";
import './HomePage.css';
import { withRouter } from 'react-router-dom';
import leftBoarding from './BoardingLeft.svg'
import rightBoarding from './BoardingRight.svg'
import downArrow from './DownArrow.svg'
import imgOne from './pgTwoImgOne.svg'
import globe from './Heavy-L.svg'

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
    window.scrollBy(0, -10000);
  }


  render() {
    return (
      <><div className="HomePage">
        <img src={leftBoarding} className="Homepage-left" alt="boarding-left" />
        <img src={rightBoarding} className="Homepage-right" alt="boarding-right" />
        <style>
          @import url("https://use.typekit.net/osw3soi.css");
        </style>
       
        <button className="home-button" onClick={this.toTop}>
         <img src={globe} className="header-globe"></img> MergeTrip
        </button>
        <button className="HomePage-button" onClick={this.onSignUp}>
          Log In / Sign Up
        </button>
        
        <h1 className="HomePage-header">
          <img src={globe} className="globe"></img>MERGETRIP
          <span className="HomePage-subtitle">No More Stress</span>
          <button className="HomePage-Scroll-Button" onClick={this.scroll}>
            <img src={downArrow} className="scroll-img"></img>
          </button>
        </h1>
      </div>
      <div className="secondPage">
        {/*<img src={imgOne} class="secondPage-imgOne"></img>*/}
        <p className="first-description">
          MergeTrip can seemlesly create 
          travel itineraries just by linking to your email
        </p>
        {/*<p class="test">TESTING SOME STUFF</p>*/}
        <h2>Just filling some space so I can test the scrolling</h2>
        <h2>Just filling some space so I can test the scrolling</h2>
        <h2>Just filling some space so I can test the scrolling</h2>
        <h2>Just filling some space so I can test the scrolling</h2>

        
      </div>

      </>
    );
  }

}

export default withRouter(HomePage);