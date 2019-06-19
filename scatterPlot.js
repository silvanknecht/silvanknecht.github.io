function prepareData(sC, kind) {
    let trace = {
        x: [],
        y: [],
        mode: "lines+markers",
        marker: {
            size: 20,
            color: [],
            colorscale: [
                ["0.0", "rgb(165,0,38)"],
                ["0.111111111111", "rgb(215,48,39)"],
                ["0.222222222222", "rgb(244,109,67)"],
                ["0.333333333333", "rgb(253,174,97)"],
                ["0.444444444444", "rgb(254,224,144)"],
                ["0.555555555556", "rgb(224,243,248)"],
                ["0.666666666667", "rgb(171,217,233)"],
                ["0.777777777778", "rgb(116,173,209)"],
                ["0.888888888889", "rgb(69,117,180)"],
                ["1.0", "rgb(49,54,149)"]
            ]
        }
    };

    for (let c of sC) {
        trace.x.push(c.info[kind].gpr);
        trace.y.push(c.info[kind].grc);
        trace.marker.color.push(Math.floor(c.info[kind].gfm * 100));
    }

    let heatmap = {
        z: figure.z,
        colorscale: [
            ['0.0', 'rgb(165,0,38)'],
            ['0.111111111111', 'rgb(215,48,39)'],
            ['0.222222222222', 'rgb(244,109,67)'],
            ['0.333333333333', 'rgb(253,174,97)'],
            ['0.444444444444', 'rgb(254,224,144)'],
            ['0.555555555556', 'rgb(224,243,248)'],
            ['0.666666666667', 'rgb(171,217,233)'],
            ['0.777777777778', 'rgb(116,173,209)'],
            ['0.888888888889', 'rgb(69,117,180)'],
            ['1.0', 'rgb(49,54,149)']
        ],
        type: 'heatmap'
    };

    return (data = [trace, heatmap]);
}

function prepareLayout(evaluatorTitel) {
    return layout = {
        title: {
            text: evaluatorTitel,
            font: {
                family: "Arial, serif",
                size: 24
            },
        },
        annotations: [{
            text: "Precision-Recall-FMeasure",
            font: {
                size: 16,
                color: 'rgb(116, 101, 130)',
            },
            showarrow: false,
            align: 'center',
            x: 0.52,
            y: 1.1,
            xref: 'paper',
            yref: 'paper',
        }],
        xaxis: {
            range: [0.6, 1],
            title: {
                text: "Precision",
                font: {
                    family: "Arial, serif",
                    size: 18,
                    color: "#7f7f7f"
                }
            }
        },
        yaxis: {

            range: [0, 0.16],
            title: {
                text: "Recall",
                font: {
                    family: "Arial, seif",
                    size: 18,
                    color: "#7f7f7f"
                }
            }
        }
    };
}
