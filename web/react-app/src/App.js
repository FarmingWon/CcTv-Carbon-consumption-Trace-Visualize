import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

// import Home from './pages/Home';
import About from './pages/About';
import Counter from './pages/Counter';
import Input from './pages/Input';
import List from './pages/List';
import Train from './pages/Train';
import Header from './pages/Header.js';
import WorldMap from './map';
import Intensity from './pages/Intensity.js';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          {/* <Route path="/" exact component={Home} /> */}
          <Route path="/about" component={About} />
          <Route path="/Counter" component={Counter} />
          <Route path="/Input" component={Input} />
          <Route path="/List" component={List} />
          <Route path="/Train" component={Train} />
          <Route path="/map" component={WorldMap} />
          <Route path="/intensity" component={Intensity} />
        </Switch>
        <div className="big-container">
          <div className="component-container">
            <div className="component-box">
              <Train />
              <div className="map-component-box">
                <WorldMap />
                <div className="intensity-box">
                  <Intensity />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
