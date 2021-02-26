const kickStarterUrl =
"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json";
const movieSalesUrl =
"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";
const videoGameSales =
"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

const height = 800;
const width = 1300;

var movieArr = [];
var gameArr = [];

d3.select("body").append("title").text("Treemap Diagram").attr("id", "title");
format = d3.format(",d");

const ratio = 1;

var svg = d3.select("#main").append("svg")
.attr("id", "canvas")
.attr("height",height)
.attr("width",width);

const div = d3.select("#main").append("div").attr("id","tooltip");

fetch(videoGameSales)
.then((response) => response.json())
.then((data) => {
  
  const legendBlockValues = data.children.map(child=>child.name);
  color = d3.scaleOrdinal(d3.schemeCategory10);
  
  color.domain(legendBlockValues);
  console.log(color.domain());
  console.log(legendBlockValues);
    const root = treemap(data);
    const leaf = svg.selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

  leaf.append("rect")
      .attr("fill", d => {
         while (d.depth > 1) 
          d = d.parent;
         return color(d.data.name);
         })
      .attr("fill-opacity", 0.6)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("class","tile")
      .attr("data-name",d=>d.data.name)
      .attr("data-category",d=>d.data.category)
      .attr("data-value",d=>d.data.value)
      .on("mouseover",(event,d)=>{
        div.transition()
            .duration(500)
            .style("opacity",1)
            .attr("data-value",()=>{
              var check = (Math.round(parseFloat(d.value)*100)/100).toFixed(2);
              //  ).toFixed(2);
              return d.value;
            });
        
        div.html(d.data.name+"<br />"+d.data.category+"<br />"+d.data.value)
            .style("left",(event.pageX-30)+"px")
            .style("top",(event.pageY-60)+"px");
      })
      .on("mouseout",()=>{
        div.transition()
            .duration(500)
            .style("opacity",0);
      });

  leaf.append("text")
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g))
    .join("tspan")
      .attr("x", 3)
      .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
      .text(d => d);


const legendBlockCanvas = d3.select("#main").append("svg")
                            .attr("id","legend-canvas")
                            .attr("width",width);



const legendBlock = legendBlockCanvas.append("g")
                    .attr("id","legend")
                    .attr("transform","translate("+(width/3)+",0)");
                    // .attr("transform",
                    // "translate("+(width/3)+","
                    // +(height-150)+")");


 legendBlock
            .selectAll("rect")
            .data(legendBlockValues)
            .enter()
            .append("rect")            
            .attr("height",22)
            .attr("width",22)
            .attr("x",(d,i)=>(Math.floor(i/4)*100))
            .attr("y",(d,i)=>((i%4)*35))
            .style("fill",d=>color(d))
            .attr("class","legend-item");

 legendBlock.selectAll("text").data(legendBlockValues)
            .enter()
            .append("text")
            .text(d=>d)
            .attr("x",(d,i)=>(Math.floor(i/4)*100+35))
            .attr("y",(d,i)=>((i%4)*35+15))
            .style("font-size","14px");
  });

function treemap(data) {

  console.log(data);
  return (d3.treemap()
    .tile(d3.treemapSquarify.ratio(1))
    .size([width/ratio, height])
    .padding(1)
    .round(false)(d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value)));
} 