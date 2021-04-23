import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Header extends Component {
  render() {
    return (
      <span>
        <header style={headerStyle}>
          <h1 style={{ textAlign: "center", fontSize: "24" }}>
            Algorithm Visualizer
          </h1>
          <Link to="/" style={linkStyle}>
            Home
          </Link>{" "}
          |
          <Link to="/about" style={linkStyle}>
            {" "}
            About
          </Link>{" "}
          |
          <Link to="/sortingVisualizer" style={linkStyle}>
            {" "}
            Sorting Visualizer
          </Link>{" "}
          |
          <Link to="/pathFindingVisualizer" style={linkStyle}>
            {" "}
            PathFinding Visualizer
          </Link>
        </header>
      </span>
    );
  }
}

const headerStyle = {
  background: "#333",
  color: "#fff",
  textAlign: "center",
  padding: "5px",
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
};
