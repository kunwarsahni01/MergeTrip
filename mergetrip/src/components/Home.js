import './Home.css';
import React from 'react';
import leftBoarding from './BoardingLeft.svg';
import { useHistory } from 'react-router';

const Home = () => {
  const history = useHistory();
  return (
    <div className='HomePage'>
      <style>
        @import url("https://use.typekit.net/osw3soi.css");
      </style>
      <img src={leftBoarding} className='Homepage-left' alt='boarding-left' />
      <img src={leftBoarding} className='Homepage-right' alt='boarding-right' />
      <button className='HomePage-button' onClick={() => { history.push('/login'); }}>
        Sign Up
      </button>
      <header className='HomePage-header'>
        MERGETRIP
        <span className='HomePage-subtitle'>No More Stress</span>
      </header>
    </div>
  );
};

export default Home;
