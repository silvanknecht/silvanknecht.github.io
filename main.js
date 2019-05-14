let figure;
let dataFolder = './data/'
let questions = 150,
    chartWidth = 5 * questions,
    chartHeight = 35,
    barWidth = chartWidth / questions, // chartWidth / 150;
    barColor = "rgba(0, 0, 0)",
    titleWidth = 30,
    fmeasureWidth = 80;

let highlightBarWidth = 3,
    highlightBarHeight = 28;

let charts = [];

let chartScale = d3
    .scaleLinear()
    .domain([0, questions])
    .range([0, chartWidth]);

d3.queue()
    .defer(d3.json, dataFolder + 'heatmap.json')
    .defer(d3.json, dataFolder + 'qald-9-test-multilingual.json')
    .defer(d3.json, dataFolder + "1_results.json")
    .defer(d3.json, dataFolder + "2_results.json")
    .defer(d3.json, dataFolder + "3_results.json")
    .defer(d3.json, dataFolder + "4_results.json")
    .defer(d3.json, dataFolder + "5_results.json")
    .defer(d3.json, dataFolder + "6_results.json")
    .defer(d3.json, dataFolder + "7_results.json")
    .defer(d3.json, dataFolder + "8_results.json")
    .defer(d3.json, dataFolder + "9_results.json")
    .defer(d3.json, dataFolder + "10_results.json")
    .defer(d3.json, dataFolder + "11_results.json")
    .defer(d3.json, dataFolder + "12_results.json")
    .defer(d3.json, dataFolder + "13_results.json")
    .defer(d3.json, dataFolder + "14_results.json")
    .defer(d3.json, dataFolder + "15_results.json")
    .defer(d3.json, dataFolder + "16_results.json")
    .defer(d3.json, dataFolder + "17_results.json")
    .defer(d3.json, dataFolder + "18_results.json")
    .defer(d3.json, dataFolder + "19_results.json")
    .defer(d3.json, dataFolder + "20_results.json")
    .defer(d3.json, dataFolder + "21_results.json")
    .defer(d3.json, dataFolder + "22_results.json")
    .defer(d3.json, dataFolder + "23_results.json")
    .defer(d3.json, dataFolder + "24_results.json")
    .defer(d3.json, dataFolder + "sinaFehlerSuche.json")
    .await(splitCharts);

function splitCharts(err, heatmap, qald9, ...charts) {
    figure = heatmap;

    /* Analyze Questions*/
    let answerTypes = analyzeQuestions(qald9);
    plotPie(answerTypes);

    /* Eigene FMeasure Berechnung*/
    let calculatedCharts = calculate(charts);

    /* Sort Pipelines after fmeasure*/
    let sortedCharts = sortCharts(calculatedCharts)

    /* Draw Barcharts*/
    for (let sc of sortedCharts) {
        drawChart(sc.data, sc.info.id, sc.info.selfEval);
        console.log(sc);
    }

    /* Draw Scatter Plots*/
    plotScatter(sortedCharts);
}

function analyzeQuestions(qald) {
    let answerTypes = {};
    for (let q of qald.questions) {
        if (answerTypes[q.answertype] === undefined) {
            answerTypes[q.answertype] = 1;
        } else {
            answerTypes[q.answertype]++;
        }
    }
    return answerTypes;
}


function calculate(charts) {
    for (let sc of charts) {
        /** Calculate recall, precision and f-measure for every question.
                Calculate F-measure for the entire pipeline*/
        let recallTot = 0;
        let precisionTot = 0;
        let fMeasureTot = 0;

        for (let q of sc.data) {
            q.calc = [];
            let recall = calcRecall(q);
            let precision = calcPrecision(q);
            let fMeasure = calcFMeasure(recall, precision);
            recallTot += recall;
            precisionTot += precision;
            fMeasureTot += fMeasure;
            q.calc.push({
                recall,
                precision,
                fMeasure
            });
        }

        /** Add global Recall, Precicion and FMeasure to the Pipeline */
        sc.info.selfEval = {};
        sc.info.selfEval.grc = recallTot / 150;
        sc.info.selfEval.gpr = precisionTot / 150;
        sc.info.selfEval.gfm = fMeasureTot / 150;
    }

    return charts;
}

/* Sort charts after best (highest number) FMeasure first*/
function sortCharts(charts) {
    let sortedCharts = [];
    for (let dts of charts) {
        // data to sort
        if (sortedCharts.length === 0) {
            sortedCharts.push(dts);
        } else {
            for (let [i, sd] of sortedCharts.entries()) {
                // sorted data
                if (sd.info.selfEval.gfm <= dts.info.selfEval.gfm) {
                    sortedCharts.splice(i, 0, dts);
                    break;
                } else {
                    if (i === sortedCharts.length - 1) {
                        sortedCharts.push(dts);
                        break;
                    }
                }
            }
        }
    }
    return sortedCharts;
}

function plotScatter(sortedCharts) {
    let dataSelfEval = prepareData(sortedCharts, "selfEval");
    let layoutSelfEval = prepareLayout("Eigener - Evaluator");
    Plotly.newPlot("selfEval-fmeasure-scatter", dataSelfEval, layoutSelfEval);

    let dataQanaryEval = prepareData(sortedCharts, "qanaryEval");
    let layoutQanaryEval = prepareLayout("Qanary - Evaluator");
    Plotly.newPlot("qanaryEval-fmeasure-scatter", dataQanaryEval, layoutQanaryEval);
}


/* Count uris */
function countUris(arr) {
    let nArr = arr.split(" ");
    return nArr.length;
}

/* calculations */
function calcRecall(q) {
    if (q.NrExpected === 0 && q.NrSystem === 0) return 1;
    if (q.NrExpected === 0 && q.NrSystem > 0) return 0;
    if (q.NrExpected > 0 && q.NrSystem === 0) return 0;
    return q.NrCorrect / q.NrExpected;
}

function calcPrecision(q) {
    if (q.NrExpected === 0 && q.NrSystem === 0) return 1;
    if (q.NrExpected === 0 && q.NrSystem > 0) return 0;
    if (q.NrExpected > 0 && q.NrSystem === 0) return 1;
    return q.NrCorrect / q.NrSystem;
}

function calcFMeasure(rec, prec) {
    if (rec === 0 && prec === 0) return 0;
    return (2 * rec * prec) / (rec + prec);
}