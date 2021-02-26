const kickStarterUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json";
const movieSalesUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";
const videoGameSales =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

const height = 1000;
const width = 1200;

var movieArr = [];
var gameArr = [];

d3.select("body").append("title").text("Treemap Diagram").attr("id", "title");
format = d3.format(",d");
color = d3.scaleOrdinal(d3.schemeCategory10);
// .round(true);

var svg = d3.select("#main").append("svg")
.attr("id", "canvas")
.attr("height",height)
.attr("width",width);

fetch(videoGameSales)
  .then((response) => response.json())
  .then((data) => {

    const root = treemap(data);
    const leaf = svg.selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);


  leaf.append("rect")
      .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
      .attr("fill-opacity", 0.6)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0);

  leaf.append("text")
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g))
    .join("tspan")
      .attr("x", 3)
      .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
      .text(d => d);



  });

function treemap(data) {

  console.log(data);
  return (d3.treemap()
    .tile(d3.treemapBinary)
    .size([width+300, height])
    .padding(1)
    .round(true)(d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value)));
} 