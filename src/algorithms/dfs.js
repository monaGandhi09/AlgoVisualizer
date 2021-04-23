export function dfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  let flagwalls = false;
  let flagwallf = false;
  if (startNode.isWall) flagwalls = true;
  if (finishNode.isWall) flagwallf = true;
  startNode.isWall = false;
  finishNode.isWall = false;
  startNode.distance = 0;
  let stack = [];
  stack.push(startNode);
  while (!!stack.length) {
    let x = stack[stack.length - 1];
    if (x.isVisited) {
      stack.pop();
      continue;
    }
    x.isVisited = true;
    visitedNodesInOrder.push(x);
    if (x === finishNode) {
      if (flagwalls) startNode.isWall = true;
      if (flagwallf) finishNode.isWall = true;
      return visitedNodesInOrder;
    }
    const unvisitedNeighbors = getUnvisitedNeighbors(x, grid);
    for (const neighbor of unvisitedNeighbors) {
      if (neighbor.isWall) continue;
      neighbor.previousNode = x;
      stack.push(neighbor);
    }
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  if (row > 0) neighbors.push(grid[row - 1][col]);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

/*function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}*/

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function getNodesInShortestPathOrderDfs(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
