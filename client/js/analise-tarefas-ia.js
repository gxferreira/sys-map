function createAnaliseTarefasIA(articlesBase) {
    const tecnicasCountArray = getTarefasCounter(articlesBase);
    createAnaliseTarefasChart(tecnicasCountArray);
}

function getTarefasCounter(articlesBase) {
    return d3.nest(articlesBase)
        .key((d) => d['tarefa executada'])
        .entries(articlesBase)
        .sort((a, b) => b.values.length - a.values.length);
}

function createAnaliseTarefasChart(tecnicasCountArray) {
    Highcharts.chart('analiseTarefasIAContainer', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'As técnicas de IA são utilizadas para quais tipos de tarefas dentro do contexto de SGOF?'
        },
        xAxis: {
            type: "category",
            title: {
                text: null
            },
            categories: tecnicasCountArray.map((tecnicaCount) => tecnicaCount.key)
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Número de artigos',
                align: 'high'
            },
            labels: {
                overflow: false
            }
        },
        tooltip: {
            valueSuffix: ''
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'n. artigos',
            data: tecnicasCountArray
                // .filter((tecnicasCount) => tecnicasCount.count > 1)
                .map((tecnicasCount) => tecnicasCount.values.length)
        }]
    });
}
