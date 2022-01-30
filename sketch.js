// A* algo - terminology from CPSC 322 UBC

var cols = 50;
var rows = 50;
var grid = new Array(cols); 

var frontier = []; // set of UNEXPLORED nodes which are reachable = FRONTIER 
var exploredNodes = []; // set of explored nodes
var start; // starting node
var end;  // goal node
var w,h;
var path = [];
var noSolution = false;

function removeFromArray(arr, elt) {
  for (var i = arr.length - 1; i>=0; i--){
    if (arr[i] == elt){
      arr.splice(i,1);
    }
  }
}

function heuristic(a,b){
  var d = abs(a.i-b.i) + abs(a.j-b.j); // manhatten distance
  return d;
}

function Spot(i,j){
  this.i = i; // x co-ordinate 
  this.j = j; // y co-ordinate
  this.f = 0; // total cost
  this.g = Infinity; // path cost so far
  this.h = 0; // heurstic 
  this.neighbors = [];
  this.previous = undefined;
  this.wall = false;

  if (random(1) <0.4){ // 40% chance spot is a wall
    this.wall = true;
  }

  this.show = function(col){
    fill(col);
    if (this.wall){ // fill wall with black;
      fill(0);
    }
    noStroke();
    rect(this.i * w, this.j *h, w-1, h-1)
  }

  this.addNeighbors = function(grid){
    var i = this.i;
    var j = this.j;
    // edge checking for validility
    if (i <cols - 1){
      this.neighbors.push(grid[i+1][j]);
    }
    if (i <0){
      this.neighbors.push(grid[i-1][j]);
    }
   
    if (j < rows - 1){
      this.neighbors.push(grid[i][j+1]);
    }

    if (j <0) {
      this.neighbors.push(grid[i][j-1]);
    }

    if (i > 0 && j > 0){
      this.neighbors.push(grid[i-1][j-1]);
    }

    if (i < cols-1 && j > 0){
      this.neighbors.push(grid[i+1][j-1]);
    }
    
    if (i > 0 && j < rows-1){
      this.neighbors.push(grid[i-1][j+1]);
    }

    if (i < cols-1 && j <rows-1){
      this.neighbors.push(grid[i+1][j+1]);
    }
  }
}

function setup() {
  createCanvas(800,800);
  console.log('A*');
  frameRate(30); // draw executions per second

  w = width / cols;
  h = height / rows;

  for (var i = 0; i < cols; i++){
    grid[i] = new Array(rows);
  }

  for (var i = 0; i < cols; i++){
    for (var j= 0; j < rows; j++){
      grid[i][j] = new Spot(i,j);
    }
  }

  for (var i = 0; i < cols; i++){
    for (var j= 0; j < rows; j++){
      grid[i][j].addNeighbors(grid);
    }
  }

start = grid[0][0];
end = grid[cols-1][rows-1];
start.wall = false;
end.wall = false;

frontier.push(start);

console.log(grid);


}

function draw() {

  if (frontier.length > 0){

    var winner = 0;
    // find node with lowest f value - this is what we will search
    for (var i = 0; i < frontier.length ; i++){
      if (frontier[i].f < frontier[winner].f) {
        winner = i;
      }
    }

    var current = frontier[winner]; // current = lowest f value node not yet explored

    if (current === end){ // finish if current is end node

      noLoop(); // p5.js to end looping of draw
      console.log("DONE");
    }

    // update frontier/explored arrays
    removeFromArray(frontier,current);
    exploredNodes.push(current);

    var neighbors = current.neighbors;
    for (var i=0; i< neighbors.length; i++){
      var neighbor = neighbors[i];

      if (!exploredNodes.includes(neighbor) && !neighbor.wall){
        var tempGvalue = current.g + 1;
        var newPath = false;
        // check before updating g(n) - path length for node 

        if (frontier.includes(neighbor)){ // neighbour in frontier
          if (tempGvalue < neighbor.g){ // new path is shorter than old path update
            neighbor.g = tempGvalue;
            newPath = true;
          }
          // neighbour not in frontier
        } else {
          neighbor.g = tempGvalue;
          newPath = true;
          frontier.push(neighbor); // add neighbour to frontier
        }

        // only update f(n) if newpath is found - new path MUST have better f(n)
        // DO NOT update values for paths that are worse 
        if (newPath){
          neighbor.h = heuristic(neighbor,end);
          neighbor.f = neighbor.g + neighbor.h; // overall f value of node 
  
          neighbor.previous = current; // sets previous node to create chain
        }
      }
      
    }
  } else {
    // case for no solution
    console.log("no solution");
    noSolution = true;
    noLoop(); // p5.js to end looping of draw
 
  }

  //----------------------------------------------------------------------------
  background(0);


  // blank grid white background
  for (var i = 0; i < cols; i++){
    for (var j = 0; j < rows;j++){
      grid[i][j].show(color(255));
    }
  }
  // closet set = red
  for (var i = 0; i < exploredNodes.length; i++){
    exploredNodes[i].show(color('#EC7063'));

  }
  // open set = green
  for (var i = 0; i < frontier.length; i++){
    frontier[i].show(color('#2ECC71'));
  }
  if (!noSolution){
    path = []; // empty array
    var temp = current; // current is last node
    path.push(temp); // add last node into array
    while (temp.previous){
      path.push(temp.previous); // add previous node
      temp = temp.previous; // update to make previous node new target
    }
  }

  // for (var i = 0; i < path.length; i++){
  //   path[i].show(color('#3498DB'));
  // }

  // for nicer path line, 215 to 217 for basic grid lines
  stroke('#83EEFF');
  strokeWeight(w / 2);
  noFill();
  beginShape();
  for (var i = 0; i < path.length; i++){
    vertex(path[i].i*w +w/2,path[i].j *h +h/2)
  }
  endShape();
}
