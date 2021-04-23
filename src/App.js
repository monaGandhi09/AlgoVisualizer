import React from "react";
import "./App.css";
import SortingVisualizer from "./SortingVisualizer/SortingVisualizer";
import Header from "./layout/Header.js";
import { BrowserRouter as Router, Route } from "react-router-dom";
import About from "./pages/About";
import Home from "./pages/Home";
import PathFindingVisualizer from "./PathFindingVisualizer/PathFindingVisualizer";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Route
          path="/sortingVisualizer"
          render={(props) => (
            <React.Fragment>
              <SortingVisualizer></SortingVisualizer>
            </React.Fragment>
          )}
        />
        <Route
          path="/pathFindingVisualizer"
          render={(props) => (
            <React.Fragment>
              <PathFindingVisualizer></PathFindingVisualizer>
            </React.Fragment>
          )}
        />
        <Route path="/about" component={About} />
        <Route exact path="/" component={Home} />
      </div>
    </Router>
  );
}

export default App;
