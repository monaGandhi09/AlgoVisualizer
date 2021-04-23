import React from "react";
import "./About.css";

function About() {
  return (
    <React.Fragment>
      <div className="about">
        <br />
        <br />
        <br />
        <h2 id="h4">
          This project mainly consists of two profiles Sorting Visualizer and
          Pathfinding Visualizer.Sorting Visualizer makes it easy for us to
          understand the working of different sorting methods.
        </h2>
        <h5>
          Pathfinding Visualizer is a useful efficient way to understand
          pathfinding problems using Mathematical Algorithms such as Dijkstra
          Algorithm, BFS Algorithm and DFS Algorithm.
        </h5>

        <footer>
          <h6>OUR TEAM</h6>
          <div id="table">
            <li>Atharva Vichare</li>
            <li>Mona Gandhi</li>
            <li>Hrim Gandhi</li>
            <li>Rohan Vora</li>
          </div>
          <h7>
            We are students of second year Computer Engg Students from VJTI
            College working on our Web Technology Lab Project.
          </h7>
        </footer>
        <p>This is a Algorithm Visualizer app v1.0.0.</p>
      </div>
    </React.Fragment>
  );
}

export default About;
