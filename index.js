const kickStarterUrl =
"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json";
const movieSalesUrl =
"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";
const videoGameSales =
"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

const height = 800;
const width = 1200;



d3.select("body").append("title").text("Treemap Diagram").attr("id", "title");
format = d3.format(",d");

const ratio = 1;


const div = d3.select("#main").append("div").attr("id","tooltip");


function  createTreeMap(data){
  console.log(data);
  var svg = d3.select("#canvas").append("svg")
  .attr("id", "canvasSvg")
  .attr("height",height)
  .attr("width",width);
  
  const legendBlockValues = data.children.map(child=>child.name);
  color = d3.scaleOrdinal(d3.schemeCategory10);
  
  color.domain(legendBlockValues);
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
            .style("opacity",0);
      });

  leaf.append("text")
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g))
    .join("tspan")
      .attr("x", 3)
      .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
      .text(d => d);


const legendBlockCanvas = d3.select("#canvas").append("svg")
                            .attr("id","legend-canvas")
                            .attr("width",width);



const legendBlock = legendBlockCanvas.append("g")
                    .attr("id","legend")
                    .attr("transform","translate("+(width/4)+",0)");
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
            .attr("x",(d,i)=>(Math.floor(i/4)*160))
            .attr("y",(d,i)=>((i%4)*35))
            .style("fill",d=>color(d))
            .attr("class","legend-item");

 legendBlock.selectAll("text").data(legendBlockValues)
            .enter()
            .append("text")
            .text(d=>d)
            .attr("x",(d,i)=>(Math.floor(i/4)*160+35))
            .attr("y",(d,i)=>((i%4)*35+15))
            .style("font-size","14px");
}

function treemap(data) {
  return (d3.treemap()
    .tile(d3.treemapSquarify.ratio(1))
    .size([width/ratio, height])
    .padding(1)
    .round(false)(d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value)));
} 

$(".navLink").on("click",(event)=>{
  event.preventDefault();
  var choice = (event.target.id);
  clearDisplay();
  if(choice=="movie"){
    $("#description-h").text("Movie Sales");
    $("#description-p").text("Top 100 Most Sold Movies Grouped by Genre");
    fetch(movieSalesUrl)
    .then((response) => response.json())
    .then((data) => {
      createTreeMap(data);
    });
  }else if(choice=="video"){
    $("#description-h").text("Video Game Sales");
    $("#description-p").text("Top 100 Most Sold Video Games Grouped by Platform");
    fetch(videoGameSales)
    .then((response) => response.json())
    .then((data) => {
      createTreeMap(data);
    });
  }else{
    $("#description-h").text("Kickstarter Sales");
    $("#description-p").text("Top 100 Most Sold Kickstarter Projects by Categories");
    fetch(kickStarterUrl)
    .then((response) => response.json())
    .then((data) => {
      createTreeMap(data);
    });
  }
})
  fetch(videoGameSales)
  .then((response) => response.json())
  .then((data) => {
    createTreeMap(data);
  });

  function clearDisplay(){
    d3.select("#canvas").selectAll("*").remove();
  }