import * as d3 from "d3";
import * as topojson from "topojson-client";
import { latLongCommunities } from "./communities";
import {
  infectedFebruary,
  infectedMarch,
  ResultEntry
} from "./stats";
const spainjson = require("./spain.json");
const d3Composite = require("d3-composite-projections")

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", 1024)
  .attr("height", 800)
  .attr("style", "background-color: #FBFAF0");

const aProjection = d3Composite
  .geoConicConformalSpain()
  .scale(3300)
  .translate([500, 400]);

const geoPath = d3.geoPath().projection(aProjection);

const geojson = topojson.feature(
  spainjson,
  spainjson.objects.ESP_adm1
);

const calculateRadiusBasedOnAffectedCases = (comunidad: string, data: ResultEntry[]) => {
  const entry = data.find(item => item.name === comunidad);

  const maxAffected = data.reduce(
    (max, item) => (item.value > max ? item.value : max),
    0
  );

const affectedRadiusScale = d3
    .scaleLinear()
    .domain([0, maxAffected])
    .clamp(true)
    .range([0, 50]);
  return entry ? affectedRadiusScale(entry.value) : 0;
};

const updateCircles = (data: ResultEntry[]) => {
  console.log("cosa")
  const circles = svg.selectAll("circle");
  circles
    .data(latLongCommunities)
    .merge(circles as any)
    .transition()
    .duration(500)
    .attr("r", d => calculateRadiusBasedOnAffectedCases(d.name, data));
};

svg
  .selectAll("path")
  .data(geojson["features"])
  .enter()
  .append("path")
  .attr("class", "country")
  .attr("d", geoPath as any);

svg
  .selectAll("circle")
  .data(latLongCommunities)
  .enter()
  .append("circle")
  .attr("class", "affected-marker")
  .attr("r", 15)
  .attr("r", d => calculateRadiusBasedOnAffectedCases(d.name, infectedFebruary))
  .attr("cx", d => aProjection([d.long, d.lat])[0])
  .attr("cy", d => aProjection([d.long, d.lat])[1]);

document
  .getElementById("init")
  .addEventListener("click", function handleInfectedFebruary() {
    updateCircles(infectedFebruary);
  });

document
  .getElementById("actual")
  .addEventListener("click", function handleInfectedMarch() {
    updateCircles(infectedMarch);
  });
