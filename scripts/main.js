//references
//California Map from https://github.com/scottpham/california-counties
//Line Graph Reference https://bl.ocks.org/mbostock/3883245


//array to keep track of county objects
var counties = [];
var clickedCounty = '';
var selYear = ''

//read in data from csv
d3.csv("./data/drought.csv", function(data){
  console.log(data);

  data.forEach(function(datum){

    //search through counties array to see if current county has been found
    var found_county = false;
    var county_index=-1;
    for(var i =0; i<counties.length; i++){

      if(datum.County === counties[i].countyName){

        found_county = true; //found county object in county array
        county_index = i; //save location in array
        break;
      }
    }

    //if county has been found
    if(found_county){
      var year = datum.ReleaseDate.substring(0,4); //extract year from release date string

      function getData(year) {
        var result = '';
        var i;
        for(i = 0; i < 6; i++) {
          result += 'counties[county_index].droughtLevels' + year + '[' + i + '] += parseInt(datum.';
          if(i != 5) {
            result += 'D' + i + ');\n';
          } else {
            result += 'None);\n';
          }
        }
        result += 'counties[county_index].dataCount' + year + '++;\n'
        return result;
      }

      //store running total of each drought level for each year
      eval(getData(year));
    } //end of if county found

    //append new county object
    //store county into counties array, then process information
    else{

      //create new county object, store county name, create drought level arrays
      var countyObject = new Object();
      countyObject.countyName = datum.County; //save county name
      //create arrays to store average drought levels for each year

      for(var j = 2000; j < 2018; j++) {
        eval('countyObject.droughtLevels' + j + ' = Array(6)');
        for(var i =0; i<6; i++){
          eval('countyObject.droughtLevels' + j + '[i] = 0');
        }
      }

      //keep track number of entries for each year to find average
      for(var i = 2000; i < 2018; i++) {
        eval('countyObject.dataCount' + i + '= 0');
      }

      var year = datum.ReleaseDate.substring(0,4); //extract year from release date string

      function getData2(year) {
        var result = '';
        var i;
        for(i = 0; i < 6; i++) {
          result += 'countyObject.droughtLevels' + year + '[' + i + '] += parseInt(datum.'
          if(i != 5) {
            result += 'D' + i + ');\n';
          } else {
            result += 'None);\n';
          }
        }
        result += 'countyObject.dataCount' + year + '++;\n'
        return result;
      }

      //
    eval(getData2(year));

      //save new object into array
      counties.push(countyObject);
    } //end of else statement

  });//end of datum for each function


for(var i = 0; i<counties.length; i++){
  for(var j = 0; j <6; j++){
    for(var k = 2000; k < 2018; k++) {
      eval('counties[i].droughtLevels' + k + '[j] = Math.ceil(counties[i].droughtLevels' + k + '[j] / counties[i].dataCount' + k + ')');
    }
  }
} //find average drought levels by dividing running total by number of data entires for each year

}) //end of d3 csv function

var width = 900,
height = 600;

var  projection = d3.geoMercator()
.scale(1000 * 2)
.center([-120, 36])
.translate([width/2, height/2]);

  var path = d3.geoPath()
  .projection(projection);

  var svg = d3.select("#map").append("svg")
  .attr("width", width)
  .attr("height", height);

  d3.json("./scripts/caCountiesTopoSimple.json", function(error, ca){

    svg.append("path")
    .datum(topojson.feature(ca, ca.objects.subunits))
    .attr("class", "land")
    .attr("d", path);

    //bind feature data to the map
    svg.selectAll(".subunit")
    .data(topojson.feature(ca, ca.objects.subunits).features)
    .enter().append("path")
    .attr("class", function(d) { return "subunit " + d.properties.name; })
    .attr("d", path)
      .on("mouseover", function(d){ //tooltip
        div.transition()
        .duration(200)
        .style("opacity", .9);
        div.html(d.properties.fullName)
        .style("left", (d3.event.pageX) + 10 + "px")
        .style("top", (d3.event.pageY - 30) + "px");
      })
      .on("mouseout", function(d) {
        div.transition()
        .duration(500)
        .style("opacity", 0.0);
      });


    //exterior border
    svg.append("path")
    .datum(topojson.mesh(ca, ca.objects.subunits, function(a, b) { return a === b;}))
    .attr("d", path)
    .attr("class", "exterior-boundary");

    //tooltop declaration
    var div = d3.select("#map").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  });

for(var i = 2000; i < 2018; i++) {
  eval('var clicked' + i + '=false');
}

//when clicking a year, updates which year is selected

function updateYear(clickedYear){
  for(var i = 2000; i < 2018; i++) {
    eval('clicked' + i + '=false');
  }
  eval('clicked' + clickedYear + '=true');

  for(var i = 2000; i < 2018; i++) {
    if(eval('clicked' + i)){
      document.getElementById(i.toString()).style.border = "solid black 4px";
    }
    else{
      document.getElementById(i.toString()).style.border = "none";
    }
  }
  //creates border to highlight which year is selected
  selYear = clickedYear;
  updateRadialGraph(clickedCounty, clickedYear, "#radBar");

} //end of update clicked


for(var i = 0; i < 5; i++) {
  eval('var clickedd' + i + '= false');
}
var clickedNone = false;

//updates which drought button is selected
function updateDrought(clickedDrought){
  for(var i = 0; i < 5; i++) {
    eval('clickedd' + i + '= false');
  }
  clickedNone = false;
  switch(clickedDrought){
    case 'none':
    clickedNone = true;
    break;

    case 'short_term':
    clickedd0 = true;
    break;

    case 'moderate':
    clickedd1 = true;
    break;

    case 'severe':
    clickedd2 = true;
    break;

    case 'extreme':
    clickedd3 = true;
    break;

    case 'exceptional':
    clickedd4 = true;
    break;
  } //end of switch statement

  //creates border to indicate which drought level is selected
  if(clickedNone){
    document.getElementById("none").style.border = "solid black 4px";
  } else {
    document.getElementById("none").style.border = "none";
  }

  if(clickedd0){
    document.getElementById("short_term").style.border = "solid black 4px";
  } else {
    document.getElementById("short_term").style.border = "none";
  }

  if(clickedd1){
    document.getElementById("moderate").style.border = "solid black 4px";
  } else {
    document.getElementById("moderate").style.border = "none";
  }

  if(clickedd2){
    document.getElementById("severe").style.border = "solid black 4px";
  } else{
    document.getElementById("severe").style.border = "none";
  }

  if(clickedd3){
    document.getElementById("extreme").style.border = "solid black 4px";
  } else {
    document.getElementById("extreme").style.border = "none";
  }

  if(clickedd4){
    document.getElementById("exceptional").style.border = "solid black 4px";
  } else {
    document.getElementById("exceptional").style.border = "none";
  }

} //end of update drought

mapColor = d3.scaleLinear()
  .domain([1, 100])
  .interpolate(d3.interpolateHcl)
  .range([d3.rgb('#FFFFFF'), d3.rgb('#E62E00')]);

//fills each subunit based on what year and drought level is selected
//compares drought level value based on county object for a year
//if the value is within a certain range, the color opacity is selected and filled
function updateFill(){

for(var z = 2000; z < 2018; z++) {

  if(eval('clicked' + z)){
    for(var y = 0; y < 6; y++){
    var clickLevel = 'clicked';
    if(y == 5) {
      clickLevel += 'None'
    } else {
      clickLevel += 'd' + y;
    }
    if(eval(clickLevel)){
      svg.selectAll(".subunit")
      .on('click', function() {

        clickedCounty = '';
        //parsing to find county name of current subunit, then compared to county object county name
        if(this.classList.length == 2){
          for(var i=1; i<this.classList.length; i++){
            clickedCounty += this.classList[i];
          }

          clickedCounty += " ";
          clickedCounty += "County";
        }

        else{
          for(var i=1; i<this.classList.length; i++){

            if(i === (this.classList.length -1)){
              clickedCounty += this.classList[i];
              clickedCounty += " ";
              clickedCounty += "County";
            }

                  //add spaces
                  else{
                    clickedCounty += this.classList[i];
                    clickedCounty += " ";
                  }

                }//end of for loop
              } //end of class list greater than 3
        console.log(clickedCounty);
        updateRadialGraph(clickedCounty, selYear, "#radBar");
        updateLine(clickedCounty, "#lineG");

      })
      .style('fill',function(){

        var county_name="";

        //parsing to find county name of current subunit, then compared to county object county name
        if(this.classList.length == 2){
          for(var i=1; i<this.classList.length; i++){
            county_name += this.classList[i];
          }

          county_name += " ";
          county_name += "County";
        }

        else{
          for(var i=1; i<this.classList.length; i++){

            if(i === (this.classList.length -1)){
              county_name += this.classList[i];
              county_name += " ";
              county_name += "County";
            }

                  //add spaces
                  else{
                    county_name += this.classList[i];
                    county_name += " ";
                  }

                }//end of for loop
              } //end of class list greater than 3


              //fill based on drought level value
              for(var i =0; i<counties.length; i++){
                if(county_name === counties[i].countyName){
                  return mapColor(eval('counties[i].droughtLevels' + z + '[' + y + ']'));
                }
            }//end of for loop
          });//end of fill function
        } //end of clicked none
      }
    }//end of clicked 2017
  }
}//end of update fill

(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("d3-scale")) :
  typeof define === "function" && define.amd ? define(["exports", "d3-scale"], factory) :
  (factory(global.d3 = global.d3 || {}, global.d3));
  }(this, function(exports, d3Scale) {
  'use strict';

  function square(x) {
    return x * x;
  }

  function radial() {
    var linear = d3Scale.scaleLinear();

    function scale(x) {
    return Math.sqrt(linear(x));
    }

    scale.domain = function(_) {
    return arguments.length ? (linear.domain(_), scale) : linear.domain();
    };

    scale.nice = function(count) {
    return (linear.nice(count), scale);
    };

    scale.range = function(_) {
    return arguments.length ? (linear.range(_.map(square)), scale) : linear.range().map(Math.sqrt);
    };

    scale.ticks = linear.ticks;
    scale.tickFormat = linear.tickFormat;

    return scale;
  }

  exports.scaleRadial = radial;

  Object.defineProperty(exports, '__esModule', {value: true});
  }));

function eraseRad(container){
  d3.select(container).select("svg").remove();
  }

  function updateRadialGraph(countyName, year, container){
    console.log(countyName);
      var widthRad = 700,
          heightRad = 600,
          innerRadius = 90,
          outerRadius = 290 * 0.71;
  
    eraseRad(container);
  
      var svgRad = d3.select(container)
                  .append("svg")
                    .attr("width", widthRad)
                    .attr("height", heightRad);
  
      var g = svgRad.append("g").attr("transform", "translate(" + widthRad / 2 + "," + heightRad * 0.50 + ")");
  
      var x2 = d3.scaleBand()
          .range([0, 2 * Math.PI])
          .align(0);
  
      var y2 = d3.scaleRadial()
      .range([innerRadius, outerRadius]);
  
      var dataActual = [
        {category:'Short Term', Val: 0},
        {category:'Moderate', Val: 0},
        {category:'Severe', Val: 0},
        {category:'Extreme', Val: 0},
        {category:'Exceptional', Val: 0},
        {category:'None', Val: 0}
        ];
  
        for(var i = 0; i < counties.length; i++){
          if(counties[i].countyName === countyName){
            for(var j = 0; j < dataActual.length; j++){
            dataActual[j].Val = eval('counties[i].droughtLevels' + year + '[' + j + ']');
            }
          }
        }
  
      x2.domain(dataActual.map(function(d) { return d.category; }));
      y2.domain(([0, d3.max(dataActual, function(d) { return d.Val; })]));
      //z.domain(dataRad.columns.slice(0,1));
  
      //console.log(data.columns.slice(1));
      var color = function(categoryName){
        if(categoryName === 'None'){
          return "#069FBC";
        }
        else if(categoryName === 'Short Term'){
          return "#7D6403";
        }
        else if(categoryName === 'Moderate'){
          return "#CB3F00";
        }
        else if(categoryName === 'Severe'){
          return "#E62E00";
        }
        else if(categoryName === 'Extreme'){
          return "#D90000";
        }
        else if(categoryName === 'Exceptional'){
          return "#5C0101";
        }
      };
  
      var label = g.append("g")
        .selectAll("g")
        .data(dataActual)
        .enter().append("g")
        .attr("text-anchor", "middle")
        .attr("transform", function(d) { return "rotate(" + ((x2(d.category) + x2.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)"; });
  
      label.append("line")
        .attr("x2", -5)
        .attr("stroke", "#abc");
  
      label.append("text")
        .attr("fill", function(d){
                  var colorName = "";
                  colorName += color(d.category);
                  return colorName;
                })
        .attr("stroke", function(d){
                  var colorName = "";
                  colorName += color(d.category);
                  return colorName;
                })
        .attr("transform", function(d) { return (x2(d.category) + x2.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,16)" : "rotate(-90)translate(0,-9)"; })
        .text(function(d) { return d.category; });
  
          g.append("g")
          .selectAll("g")
          .data(dataActual)
          .enter().append("g")
          .attr("fill", function(d){
                    var colorName = "";
                    colorName += color(d.category);
                    return colorName;
                  })//function(d) { return z(d.key); })
          .append("path")
          .attr("d", d3.arc()
            .innerRadius(function() { return innerRadius; })
            .outerRadius(function(d) { return y2(d.Val); })
            .startAngle(function(d) { return x2(d.category); })
            .endAngle(function(d) { return x2(d.category) + x2.bandwidth(); })
            .padAngle(0.01)
            .padRadius(innerRadius)
           )
           .on('mouseover', function(datum, index, nodes) {
                      // select our tooltip
                      var tooltip = d3.select('#tooltip');
  
                      // make sure our tooltip is going to be displayed
                      tooltip.style('display', 'block');
  
                      // set the initial position of the tooltip
                      tooltip.style('left', d3.event.pageX+13);
                      tooltip.style('top', d3.event.pageY+13);
  
                      // set our tooltip to have the values for the 
                      // element that we're mousing over
                      tooltip.html(datum.Val + "%");
            
                      d3.select(this).style("fill", function() {
                        return d3.rgb(d3.select(this).style("fill")).darker(0.4);
                      });
          })
          .on('mousemove', function(datum, index, nodes) {
              // select our tooltip
              var tooltip = d3.select('#tooltip');
  
              // update the position if the user's moved the mouse 
              //in the element
              tooltip.style('left', d3.event.pageX+13);
              tooltip.style('top', d3.event.pageY+13);
          })
          .on('mouseleave', function(datum, index, nodes) {
              // select our tooltip 
              var tooltip = d3.select('#tooltip');
  
              // hide tooltip if we leave the element we've been 
              // mousing over
              tooltip.style('display', 'none');
              d3.select(this).style("fill", function() {
                return d3.rgb(d3.select(this).style("fill")).brighter(0.4);
              });
            });
          
        var yAxis = g.append("g")
        .attr("text-anchor", "end");
  
        var yTick = yAxis
        .selectAll("g")
        .data(y2.ticks(10).slice(1))
        .enter().append("g");
  
        yTick.append("circle")
          .attr("fill", "none")
          .attr("stroke", "#abc")
          .attr("stroke-opacity", 0.5)
          .attr("r", y2);
  
        yTick.append("text")
          .attr("x", -6)
          .attr("y", function(d) { return -y2(d); })
          .attr("dy", "0.35em")
          .attr("z-index", 2)
          .attr("fill", "none")
          .attr("stroke", "#fff")
          .attr("stroke-width", 5)
          .text(y2.tickFormat(10, "s"));
  
        yTick.append("text")
          .attr("x", -6)
          .attr("y", function(d) { return -y2(d); })
          .attr("dy", "0.35em")
          .text(y2.tickFormat(10, "s"));
  
        yAxis.append("text")
          .attr("x", -6)
          .attr("y", function(d) { return -y2(y2.ticks(10).pop()); })
          .attr("dy", "-0.65em")
          .text("Percentage");
  
          d3.select(container).select("svg").select("g")
          .append("text")
          .attr("x", 0)
          .attr("y", -heightRad/2.20)
          .attr("text-anchor", "middle")
          .style("font-size", "30px")
          .style("fill", 'darkcyan')
          .text("Average Annual Drought Level Percentages");
  
          d3.select(container).select("svg").select("g")
          .append("text")
          .attr("x", 0)
          .attr("y", -heightRad/2.50)
          .attr("text-anchor", "middle")
          .style("font-size", "30px")
          .style("fill", 'darkcyan')
          .text("for " + countyName + " in the year " + year);
  }

function updateLine(counti, contain){

  eraseRad(contain);

  var svg3 = d3.select(contain).append("svg").attr("height", 600).attr("width", 1300),
    margin = {top: 80, right: 20, bottom: 30, left: 50},
    width2 = 960 - margin.left - margin.right,
    height2 = 500 - margin.top - margin.bottom,
    g = svg3.append("g").attr("transform", "translate(280, 5)");

  var parseTime = d3.timeParse("%Y%m%d");

  var x = d3.scaleTime()
      .rangeRound([0, width2]);

  var y = d3.scaleLinear()
      .rangeRound([height2, 0]);

  // var line1 = d3.line()
  //     .x(function(d) { return x(d.ReleaseDate); })
  //     .y(function(d) { return y(d.None); });

  var line2 = d3.line()
      .x(function(d) { return x(d.ReleaseDate); })
      .y(function(d) { return y(d.D0); });

  var line3 = d3.line()
      .x(function(d) { return x(d.ReleaseDate); })
      .y(function(d) { return y(d.D1); });

  var line4 = d3.line()
      .x(function(d) { return x(d.ReleaseDate); })
      .y(function(d) { return y(d.D2); });

  var line5 = d3.line()
      .x(function(d) { return x(d.ReleaseDate); })
      .y(function(d) { return y(d.D3); });

  var line6 = d3.line()
      .x(function(d) { return x(d.ReleaseDate); })
      .y(function(d) { return y(d.D4); });

  d3.csv("./data/drought.csv", function(d) {
  	if (d.County === counti ){
	    d.ReleaseDate = parseTime(d.ReleaseDate);
	    d.None = +d.None;
	    d.D0 = +d.D0;
	    d.D1 = +d.D1;
	    d.D2 = +d.D2;
	    d.D3 = +d.D3;
	    d.D4 = +d.D4;

      return d;
	}
  }, function(error, data) {
    if (error) throw error;

    x.domain(d3.extent(data, function(d) { return d.ReleaseDate; }));
    y.domain(d3.extent(data, function(d) { return d.None; }));

    g.append("g")
        .attr("transform", "translate(0," + height2 + ")")
        .call(d3.axisBottom(x))
      .select(".domain")
        .remove();

    g.append("g")
        .call(d3.axisLeft(y))
      .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Percentage");

    // g.append("path")
    //     .datum(data.sort())
    //     .attr("fill", "none")
    //     .attr("stroke", "#2ECCFA")
    //     .attr("stroke-linejoin", "round")
    //     .attr("stroke-linecap", "round")
    //     .attr("stroke-width", 1.5)
    //     .attr("d", line1);

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#7D6403")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line2);

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#CB3F00")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line3);

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#E62E00")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line4);

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#D90000")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line5);

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#5C0101")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line6);

    d3.select(contain).select("svg").select("g")
        .append("text")
        .attr("x", 420)
        .attr("y", 435)
        .attr("text-anchor", "middle")
        .style("font-size", "30px")
        .style("fill", 'darkcyan')
        .text("Line Graph Showing Different Drought Levels for the Selected County");
  });
}