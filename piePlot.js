function plotPie(answerTypes) {


    var data = [{
        values: Object.values(answerTypes),
        labels: Object.keys(answerTypes),
        type: 'pie'
    }];

    var layout = {
        title: {
            text: "Antworttypen",
            font: {
                family: "Arial, serif",
                size: 24
            }
        }

    };

    Plotly.newPlot('answerTypes', data, layout);
}

