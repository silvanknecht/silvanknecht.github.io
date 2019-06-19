
/* Barcodechart*/
function drawChart(data, id, eval) {
    let svgEl = d3
        .select("#pipelines")
        .append("svg")
        .attr("width", chartWidth + titleWidth + fmeasureWidth + 5) // 2 pixels to see the boarder
        .attr("height", chartHeight * 2);

    let tooltip = d3
        .select("#pipelines")
        .append("div")
        .attr("class", "tip")
        .text("a simple tooltip");

    title = svgEl
        .append("g")
        .attr("transform", "translate(0," + (chartHeight + 4) + ")");

    title
        .append("text")
        .attr("class", "title")
        .text(id);

    fMeasure = svgEl
        .append("g")
        .attr(
            "transform",
            "translate(" +
            (chartWidth + fmeasureWidth / 2) +
            "," +
            (chartHeight - 3) +
            ")"
        );

    fMeasure
        .append("text")
        .attr("class", "fMeasure-label")
        .attr("font-style", "bold")
        .text("F-Measure");

    fMeasure
        .append("text")
        .attr("class", "fmeasure-score")
        .attr("dy", "1em")
        .text(eval.QALDgfm);

    barcodeGroup = svgEl
        .append("g")
        .data(data)
        .attr(
            "transform",
            "translate(" + titleWidth + ", " + chartHeight / 2 + ")"
        );

    barcodeGroup
        .append("rect")
        .attr("width", chartWidth)
        .attr("height", chartHeight)
        .style("fill", barColor)
        .style("Stroke", "rgb(0,0,0)");

    barcodeGroup
        .selectAll("rect.result")
        .data(data)
        .enter()
        .append("rect")
        .attr("width", barWidth)
        .attr("height", chartHeight)
        .attr("stroke-width", 0.25)
        .attr("stroke", "black")
        .style("fill", function (d) {
            if (d.NrCorrect === d.NrExpected && d.NrExpected === d.NrSystem) {
                return "#00FF00";
            } else if (d.NrCorrect !== d.NrSystem && d.NrCorrect !== 0) {
                return "#FFA500";
            } else if (d.NrSystem > 0 && d.NrCorrect === 0) {
                return "#cc0000";
            } else {
                return "#FFF";
            }
        })
        .attr("x", function (d, i) {
            return i * barWidth;
        })
        .on("mouseover", function (d) {
            tooltip.html(
                `<strong>Id: </strong><span>${
                d.QuestionID
                }</span><br><strong>Question: </strong><span> ${
                d.QuestionString
                }</span><br><strong>ResourceURLs: </strong><span> ${countUris(
                    d.ResourceURLs
                )}</span><br><strong>PropertyURLs: </strong><span> ${countUris(
                    d.PropertyURLs
                )}</span><br><strong>OntologyURLs: </strong><span> ${countUris(
                    d.OntologyURLs
                )}</span><br><strong>NrExpected: </strong><span> ${
                d.NrExpected
                }</span><br><strong>NrSystem: </strong><span> ${
                d.NrSystem
                }</span><br><strong>NrCorrect: </strong><span> ${
                d.NrCorrect
                }</span>`
            );
            return tooltip.style("visibility", "visible");
        })
        .on("mousemove", function () {
            return tooltip
                .style("top", d3.event.pageY - 10 + "px")
                .style("left", d3.event.pageX + 10 + "px");
        })
        .on("mouseout", function () {
            return tooltip.style("visibility", "hidden");
        });

}