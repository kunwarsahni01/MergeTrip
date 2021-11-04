import React, { Component } from "react";
import leftBoarding from './BoardingLeft.svg'
import './Home.css';
import { withRouter } from 'react-router';

export class Home extends Component {
    constructor() {
        super();
        this.onSignUp = this.onSignUp.bind(this);
    }

    onSignUp() {
        this.redirect();
    }

    redirect() {
        this.props.history.push('/login');
    }

    render() {
        return (
            <div className="HomePage">
                <style>
                    @import url("https://use.typekit.net/osw3soi.css");
                </style>
                <img src={leftBoarding} className="Homepage-left" alt="boarding-left" />
                <img src={leftBoarding} className="Homepage-right" alt="boarding-right" />
                <button className="HomePage-button" onClick={this.onSignUp}>
                    Sign Up
                </button>
                <header className="HomePage-header">
                    MERGETRIP
                    <span className="HomePage-subtitle">No More Stress</span>
                </header>
            </div>
        );
    }

}



export default withRouter(Home);