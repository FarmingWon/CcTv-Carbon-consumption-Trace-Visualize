import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Counter from './pages/Counter';
import Input from './pages/Input';
import List from './pages/List';
import Train from './pages/Train';
import Header from './pages/Header.js';
import WorldMap from './map';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/about" component={About} />
          <Route path="/Counter" component={Counter} />
          <Route path="/Input" component={Input} />
          <Route path="/List" component={List} />
          <Route path="/Train" component={Train} />
          <Route path="/map" component={WorldMapContainer} />
        </Switch>
        <div className="component-box">
          <WorldMap />
        </div>
      </div>
    </Router>
  );
}

function WorldMapContainer() {
  return null;
}

export default App;
