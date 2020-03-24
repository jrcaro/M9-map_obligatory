# Pin Map Exercise

Following the [Pinning Location](https://github.com/Lemoncode/d3js-typescript-examples/tree/master/02-maps/02-pin-location-scale) exercise we end up with a map of Spain where the circles shows the number of cases of COVID-19. 
![map affected coronavirus](./content/chart.png "affected coronavirus")

The next step to complete the exercise is to create two buttons in the top of the canvas to select which data you want to use: the previous data (outdated) or the actual data (22/03/2020).

Modifying the _./src/index.html_
```diff
+<div>
+   <button id="init">Init infection</button>
+   <button id="actual">Actual infection</button>
+</div>
```

Then in the _./src/stats.ts_ file was added the new data from Ministerio de Sanidad web page (https://covid19.isciii.es/) and created the ResultEntry data type.
```diff
+export interface ResultEntry {
+   name: string;
+   value: number;
+}
-export const stats = [
+export const infectedFebruary: ResultEntry[] = [
...
+export const infectedMarch: ResultEntry[] = [
...
+];
```

Now, it has been modify the _./src/index.ts_ file, loading the new data.
```diff
import {
    infectedFebruary,
+   infectedMarch,
+   ResultEntry
} from "./stats";
```

Also changing the functions to work with an input parameter.
```diff
-const calculateRadiusBasedOnAffectedCases = (comunidad: string) => {
+const calculateRadiusBasedOnAffectedCases = (comunidad: string, data: ResultEntry[]) => {
    const entry = data.find(item => item.name === comunidad);
+   const maxAffected = data.reduce(
+     (max, item) => (item.value > max ? item.value : max),
+     0
+   );
+   const affectedRadiusScale = d3
+     .scaleLinear()
+     .domain([0, maxAffected])
+     .clamp(true)
+     .range([0, 50]);
    return entry ? affectedRadiusScale(entry.value) : 0;
};
```

For the circles updates it has been created a new function with the data as input. This function select the already creted cricles and modify them with the new radius of the circle. Also added a transition to change between data more smoothly.
```diff
+const updateCircles = (data: ResultEntry[]) => {
+   console.log("cosa")
+   const circles = svg.selectAll("circle");
+   circles
+   .data(latLongCommunities)
+   .merge(circles as any)
+   .transition()
+   .duration(500)
+   .attr("r", d => calculateRadiusBasedOnAffectedCases(d.name, data));
+};
```

It's neccessary change the function call in the default circle creation.
```diff
svg
  .selectAll("circle")
  .data(latLongCommunities)
  .enter()
  .append("circle")
  .attr("class", "affected-marker")
  .attr("r", 15)
-  .attr("r", d => calculateRadiusBasedOnAffectedCases(d.name))
+  .attr("r", d => calculateRadiusBasedOnAffectedCases(d.name, infectedFebruary))
  .attr("cx", d => aProjection([d.long, d.lat])[0])
  .attr("cy", d => aProjection([d.long, d.lat])[1]);
```

Finally, you have to created a hadler for the buttons and manage the functions calls.
```diff
+document
+  .getElementById("init")
+  .addEventListener("click", function handleInfectedFebruary() {
+    updateCircles(infectedFebruary);
+  });

+document
+  .getElementById("actual")
+  .addEventListener("click", function handleInfectedMarch() {
+    updateCircles(infectedMarch);
+  });
```
