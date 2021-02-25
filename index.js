const kickStarterUrl="https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json";
const movieSalesUrl="https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";
const videoGameSales="https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

const canvasHeight = 800;
const canvasWidth = 800;

var movieArr=[];
var gameArr=[];

d3.select("body").append("title").text("Treemap Diagram")
.attr("id","title");

var svg = d3.select("#main").append("svg");

fetch(kickStarterUrl)
    .then(response=>response.json())
    .then(data=>{
        console.log(data);
        fetch(movieSalesUrl)
            .then(response=>response.json())
            .then(dataMovie=>{
                console.log(dataMovie);
            })
    })