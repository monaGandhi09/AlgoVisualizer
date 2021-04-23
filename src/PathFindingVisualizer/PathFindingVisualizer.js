import React, { Component } from "react";
import Node from "./Node/Node";
import {
  dijkstra,
  getNodesInShortestPathOrderDijkstra,
} from "../algorithms/dijkstra";
import { bfs, getNodesInShortestPathOrderBfs } from "../algorithms/bfs";
import { dfs, getNodesInShortestPathOrderDfs } from "../algorithms/dfs";

import "./PathFindingVisualizer.css";

let startRow = 10;
let startCol = 15;
let finishRow = 10;
let finishCol = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      mouseForWeights: false,
      splNodesMousePressed: null,
      prevNode: null,
      start: null,
      finish: null,
      algodone: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
    document.addEventListener("keydown", this.onkeypress.bind(this));
  }

  resetGrid() {
    startRow = 10;
    startCol = 15;
    finishRow = 10;
    finishCol = 35;
    for (let row = 0; row < 19; row++) {
      for (let col = 0; col < 50; col++) {
        const node = createNode(col, row);
        if (node.isStart) {
          document.getElementById(`node-${row}-${col}`).className =
            "node node-start";
        } else if (node.isFinish)
          document.getElementById(`node-${row}-${col}`).className =
            "node node-finish";
        else
          document.getElementById(`node-${row}-${col}`).className = "node node";
      }
    }
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  onkeypress(e) {
    if (e.keyCode === 87) {
      const flag = !this.state.mouseForWeights;
      this.setState({ mouseForWeights: flag });
    }
  }

  handleMouseDown(row, col) {
    const { grid } = this.state;
    const newNode = grid[row][col];
    if (newNode.isStart) {
      this.setState({
        splNodesMousePressed: "start",
        prevNode: newNode,
      });
    } else if (newNode.isFinish) {
      this.setState({
        splNodesMousePressed: "finish",
        prevNode: newNode,
      });
    } else if (this.state.mouseForWeights) {
      const newGrid = getNewGridWithWeightToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    } else {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }

  handleMouseEnter(row, col) {
    if (this.state.splNodesMousePressed != null) {
      let newGrid = moveSpecialNode(
        this.state.grid,
        row,
        col,
        this.state.splNodesMousePressed
      );
      if (this.state.prevNode != null) {
        const prev = this.state.prevNode;
        newGrid = moveSpecialNode(
          this.state.grid,
          prev.row,
          prev.col,
          this.state.splNodesMousePressed
        );
      }
      const node = createNode(col, row);
      this.setState({ grid: newGrid, prevNode: node });
    }
    if (!this.state.mouseIsPressed) return;
    else {
      let newGrid = null;
      if (this.state.mouseForWeights) {
        newGrid = getNewGridWithWeightToggled(this.state.grid, row, col);
      } else newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    }
  }

  handleMouseUp(row, col) {
    if (this.state.splNodesMousePressed != null) {
      let newGrid = moveSpecialNode(
        this.state.grid,
        row,
        col,
        this.state.splNodesMousePressed
      );
      const prev = this.state.prevNode;
      newGrid = moveSpecialNode(
        this.state.grid,
        prev.row,
        prev.col,
        this.state.splNodesMousePressed
      );
      if (this.state.splNodesMousePressed === "start") {
        startRow = prev.row;
        startCol = prev.col;
      } else if (this.state.splNodesMousePressed === "finish") {
        finishRow = prev.row;
        finishCol = prev.col;
      }
      this.setState({ grid: newGrid, prevNode: null });
    }
    this.setState({
      mouseIsPressed: false,
      splNodesMousePressed: null,
    });
  }

  animate(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node current";
      }, 9.97 * i);
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node current";
        if (node.isStart) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited start";
        } else if (node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited finish";
        } else if (node.isWeight)
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited weight";
        else
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited";
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (node.isStart) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-shortest-path-start";
        } else if (node.isFinish)
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-shortest-path-finish";
        else if (node.isWeight)
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-shortest-path weight";
        else
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-shortest-path";
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    this.clearpath();
    let { grid } = this.state;
    const startNode = grid[startRow][startCol];
    const finishNode = grid[finishRow][finishCol];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrderDijkstra(
      finishNode
    );
    this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
    this.setState({ algodone: true });
  }

  visualizeBfs() {
    this.clearpath();
    this.removeWeights(this.state.grid);
    const { grid } = this.state;
    const startNode = grid[startRow][startCol];
    const finishNode = grid[finishRow][finishCol];
    const visitedNodesInOrder = bfs(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrderBfs(finishNode);
    this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeDfs() {
    this.clearpath();
    this.removeWeights(this.state.grid);
    const { grid } = this.state;
    const startNode = grid[startRow][startCol];
    const finishNode = grid[finishRow][finishCol];
    const visitedNodesInOrder = dfs(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrderDfs(finishNode);
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      const node = nodesInShortestPathOrder[i];
      console.log(node.row + " " + node.col);
    }
    this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  removeWeights = (grid) => {
    const newGrid = grid.slice();
    for (let row = 0; row < 19; row++) {
      for (let col = 0; col < 50; col++) {
        if (newGrid[row][col].isWeight) {
          newGrid[row][col].isWeight = false;
          document.getElementById(`node-${row}-${col}`).className = "node node";
        }
      }
    }
  };

  removeWalls = (grid) => {
    const newGrid = grid.slice();
    for (let row = 0; row < 19; row++) {
      for (let col = 0; col < 50; col++) {
        if (newGrid[row][col].isWall) {
          newGrid[row][col].isWall = false;
          document.getElementById(`node-${row}-${col}`).className = "node node";
        }
      }
    }
  };

  clearpath = () => {
    const { grid } = this.state;
    const newGrid = grid.slice();
    let walls = [];
    let weight = [];
    for (let row = 0; row < 19; row++) {
      for (let col = 0; col < 50; col++) {
        const node = newGrid[row][col];
        if (node.isWall) walls.push(node);
        if (node.isWeight) {
          weight.push(node);
          document.getElementById(`node-${row}-${col}`).className =
            "node node-weight";
        }
        if (node.isStart)
          document.getElementById(`node-${row}-${col}`).className =
            "node node-start";
        if (node.isFinish)
          document.getElementById(`node-${row}-${col}`).className =
            "node node-finish";
        if (!node.isWeight && !node.isStart && !node.isFinish && !node.isWall)
          document.getElementById(`node-${row}-${col}`).className = "node node";
        const newNode = createNode(col, row);
        newGrid[row][col] = newNode;
      }
    }
    this.setState({ newGrid });
    this.setState({ mouseIsPressed: true });
    if (walls !== null) {
      for (let i = 0; i < walls.length; i++) {
        const node = walls[i];
        const newGrid = getNewGridWithWallToggled(
          this.state.grid,
          node.row,
          node.col
        );
        this.setState({ newGrid });
      }
    }
    this.setState({ mouseForWeights: true });
    if (weight !== null) {
      for (let i = 0; i < weight.length; i++) {
        const node = weight[i];
        const newGrid = getNewGridWithWeightToggled(
          this.state.grid,
          node.row,
          node.col
        );
        this.setState({ newGrid });
      }
    }
    this.setState({ mouseForWeights: false, mouseIsPressed: false });
  };

  clearWallsAndWeights() {
    this.removeWeights(this.state.grid);
    this.removeWalls(this.state.grid);
    this.clearpath();
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <p></p>
        <button
          onClick={() => this.resetGrid()}
          className="btn btn-primary btn-lg active"
        >
          Clear Board
        </button>
        <button
          onClick={() => this.clearpath()}
          className="btn btn-primary btn-lg active"
        >
          Clear Path
        </button>
        <button
          onClick={() => this.clearWallsAndWeights()}
          className="btn btn-primary btn-lg active"
        >
          Clear Walls and Weights
        </button>
        <button
          onClick={() => this.visualizeDijkstra()}
          className="btn btn-primary btn-lg active"
        >
          Visualize Dijkstra's Algorithm
        </button>
        <button
          onClick={() => this.visualizeBfs()}
          className="btn btn-primary btn-lg active"
        >
          Visualize BFS Algorithm
        </button>
        <button
          onClick={() => this.visualizeDfs()}
          className="btn btn-primary btn-lg active"
        >
          Visualize DFS Algorithm
        </button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {
                    row,
                    col,
                    isFinish,
                    isStart,
                    isWall,
                    isWeight,
                  } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      isWeight={isWeight}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp(row, col)}
                      row={row}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}
const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 19; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};
const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === startRow && col === startCol,
    isFinish: row === finishRow && col === finishCol,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    isWeight: false,
    previousNode: null,
  };
};
const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  if (node.isFinish || node.isStart) return newGrid;
  const newNode = {
    ...node,
    isWeight: false,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithWeightToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  if (node.isFinish || node.isStart) return newGrid;
  const newNode = {
    ...node,
    isWall: false,
    isWeight: !node.isWeight,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const moveSpecialNode = (grid, row, col, value) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  if (value === "start") {
    const newNode = {
      ...node,
      isStart: !node.isStart,
    };
    newGrid[row][col] = newNode;
  } else if (value === "finish") {
    const newNode = {
      ...node,
      isFinish: !node.isFinish,
    };
    newGrid[row][col] = newNode;
  }
  return newGrid;
};
