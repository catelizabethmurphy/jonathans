import './styles.css'
import * as d3 from 'd3'
import { annotation } from 'd3-svg-annotation'

// 1. ACCESS DATA *******************************
const data = await d3.csv("data/jonathans.csv")

// 2. DRAW CANVAS  *******************************
const margin = {
  top: 60,
  right: 30,
  bottom: 50,
  left: 40
}
const width = 800 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

const svg = d3.select("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)

const chart = svg.append("g")
  .classed("chart", true)
  .attr("transform", `translate(${margin.left}, ${margin.top})`)

// 3. CREATE X AXIS *******************************
const xScale = d3
  .scaleBand()
  .domain(data.map(d => +d.year))
  .range([0, width])
  .padding(0.4)

const xAxis = chart
  .append("g")
  .attr("transform", `translate(0, ${height})`)
  .classed("x-axis", true)
  .call(
    d3.axisBottom(xScale)
        .tickValues(data.map(d => +d.year).filter(year => year % 10 === 0))
  )
    .append("text")
      .attr("font-family", "PT Sans, sans-serif")
      .attr("text-anchor", "center")
      .attr("fill", "black")
      .attr("font-size", "1.25em")
      .attr("x", (width / 2))
      .attr("y", 40)
      .text("Year")

// 4. CREATE Y AXIS *******************************
const yScale = d3
  .scaleLinear()
  .domain([0, d3.max(data, d => +d.count)])
  .domain([0, 25000])
  .range([height, 0])

const yAxis = chart
  .append("g")
  .attr("transform", `translate(0, 0)`)
  .classed("y-axis", true)
  .call(
    d3.axisLeft(yScale)
      .tickValues([0, 5000, 10000, 15000, 20000, 25000])
      .tickFormat(d3.format(","))
  )
    .append("text")
      .attr("text-anchor", "start")
      .attr("font-family", "PT Sans, sans-serif")
      .attr("fill", "black")
      .attr("font-size", "1.25em")
      .attr("x", -20)
      .attr("y", -10)
      .text("Number of Jonathans Born")

const color = d3.scaleSequential(d3.interpolateTurbo).domain(yScale.domain())

// Create the path generator
const line = d3.line()
    .curve(d3.curveStep)
    .x(d => xScale(+d.year) + xScale.bandwidth() / 2)
    .y(d => yScale(+d.count))

// Append the path to the chart
chart.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "url(#line-gradient)")
    .attr("stroke-width", 2)
    .attr("d", line)

// apply gradient
const gradient = svg.append("defs")
  .append("linearGradient")
  .attr("id", "line-gradient")
  .attr("gradientUnits", "userSpaceOnUse")
  .attr("x1", 0)
  .attr("y1", yScale(0))
  .attr("x2", 0)
  .attr("y2", yScale(25000))

// Create multiple stops so the gradient shows the full Turbo (rainbow) interpolator
const domain = yScale.domain()
const nStops = 6
// this loop creates multiple stops along the gradient, each with a color corresponding to a value in the domain
for (let i = 0; i < nStops; i++) {
  const t = i / (nStops - 1)
  // this calculates the value in the domain corresponding to the current stop, which is used to determine the color of the stop
  const value = domain[0] + t * (domain[1] - domain[0])
  // this appends a stop to the gradient with the appropriate offset and color
  gradient.append("stop")
    .attr("offset", `${t * 100}%`)
    .attr("stop-color", color(value))
    .attr("stop-opacity", 1)
}

chart.selectAll("path")
    .attr("stroke", "url(#line-gradient)")

// add interactivity
let tooltipData = null
function filterTooltipData(d) {
  const year = +d.year
  const count = +d.count
  tooltipData = {
    year: year,
    count: count
  }
}

function positionTooltip(event) {
  const [x, y] = d3.pointer(event)
  tooltip
    .style("left", `${x + margin.left}px`)
    .style("top", `${y}px`)
}

const tooltip = d3.select("#tooltip")
  .data([tooltipData])
  .style("position", "absolute")
  .style("background", "rgb(255, 255, 255)")
  .style("color", "black")
  .style("z-index", "10")
  .style("display", "none")
  .style("padding", "8px")
  .style("border", "1px solid #939393")
  .style("drop-shadow", "0 6px 24px rgba(20, 27, 59, 0.79)")

// Add invisible point elements (one per data item) to capture pointer events
chart.selectAll(".point")
  .data(data)
  .join("circle")
  .classed("point", true)
  .attr("cx", d => xScale(+d.year) + xScale.bandwidth() / 2)
  .attr("cy", d => yScale(+d.count))
  .attr("r", 8)
  .attr("fill", "transparent")
  .attr("cursor", "pointer")
  .on("mouseover", function(event, d) {
    d3.select(this).attr("fill", "rgba(0,0,0,0.05)")
    filterTooltipData(d)
    tooltip
      .style("display", "block")
      .html(`
        <strong style="color: black; font-weight: bold;">${tooltipData.year}</strong>
        <br>
        Number of Jonathans Born: ${tooltipData.count.toLocaleString()}
      `)
    positionTooltip(event)
  })
  .on("mousemove", function(event, d) {
    positionTooltip(event)
  })
  .on("mouseout", function(event, d) {
    d3.select(this).attr("fill", "transparent")
    tooltip.style("display", "none")
  })

// add legend above the chart showing gradient
const legendWidth = 300
const legendHeight = 18

// create a horizontal legend gradient (objectBoundingBox so it maps to the rect)
let defs = svg.select("defs")
if (defs.empty()) defs = svg.append("defs")

const legendGrad = defs.append("linearGradient")
  .attr("id", "legend-gradient")
  .attr("gradientUnits", "objectBoundingBox")
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "100%")
  .attr("y2", "0%")

// create stops for the legend gradient using the same color scale
for (let i = 0; i < nStops; i++) {
  const t = i / (nStops - 1)
  const value = domain[0] + t * (domain[1] - domain[0])
  legendGrad.append("stop")
    .attr("offset", `${t * 100}%`)
    .attr("stop-color", color(value))
    .attr("stop-opacity", 1)
}

const legend = svg.append("g")
  .classed("legend", true)
  .attr("transform", `translate(${margin.left - 35}, ${margin.top - 60})`)

legend.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", legendWidth)
  .attr("height", legendHeight)
  .style("fill", "url(#legend-gradient)")
  .style("stroke", "#333")
  .style("stroke-width", "1px")
  .style("rx", 3)
  .style("ry", 3)

// add a scale below the legend (maps domain to legend width)
const legendScale = d3.scaleLinear()
  .domain(domain)
  .range([0, legendWidth])

const legendAxis = d3.axisBottom(legendScale)
  .tickValues([domain[0], 5000, 10000, 15000, 20000, domain[1]])
  .tickFormat(d3.format(","))
  .tickSize(6)

legend.append("g")
  .attr("transform", `translate(0, ${legendHeight})`)
  .call(legendAxis)
  .call(g => g.select('.domain').remove())

legend.append("text")
  .attr("x", legendWidth / 2)
  .attr("y", -8)
  .attr("text-anchor", "middle")
  .attr("font-family", "PT Sans, sans-serif")
  .attr("fill", "black")
  .attr("font-size", "0.9em")
  .text("Number of Jonathans Born")

// annotation for 1992 point
const annotationData = {
  note: {
    title: "1992",
    label: "Year of Jonathan Meltzer 🙌 ",
    wrap: 70
  },
  connector: {
    end: "none",
    type: "line",
    points: 1,
    lineType : "horizontal"
  },
  x: xScale(1992) + xScale.bandwidth() / 2,
  y: yScale(data[112].count),
  dy: -30,
  dx: 5
}

const annotationData2 = {
  note: {
    title: "1971",
    label: "Year of Jonathan Hamm 🔥",
    wrap: 70
  },
  connector: {
    end: "none",
    type: "line",
    points: 1,
    lineType : "horizontal"
  },
  x: xScale(1971) + xScale.bandwidth() / 2,
  y: yScale(data[91].count),
  dy: -30,
  dx: -40
}

const makeAnnotation = annotation()
  .annotations([annotationData, annotationData2])

chart.append("g")
  .call(makeAnnotation)
  .attr("z-index", "-1")

// put image of jon meltzer on the chart
const imgWidth = 80
const imgHeight = 80

chart.append("image")
    .attr("xlink:href", "/images/jon.jpeg")
    // put image to right of the annotation text
    .attr("x", xScale(1992) + xScale.bandwidth() / 2 + 80)
    .attr("y", yScale(data[112].count) - imgHeight - 25)
    .attr("width", imgWidth)
    .attr("height", imgHeight)

chart.append("image")
    .attr("xlink:href", "/images/hamm.png")
    // put image to left of the annotation text
    .attr("x", xScale(1971) + xScale.bandwidth() / 2 - imgWidth - 110)
    .attr("y", yScale(data[91].count) - imgHeight - 25)
    .attr("width", imgWidth)
    .attr("height", imgHeight)