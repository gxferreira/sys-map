const TECNICAS_MOSTRAR_TAREFAS = [
    "algoritmo genético",
    "redes neurais",
    "floresta randômica",
    "árvore de decisão",
    "colônia de formigas"
]

function createAnaliseTecnicasIA(articlesBase) {
    const tecnicasCountArray = getTecnicasCounter(articlesBase);
    createAnaliseTecnicasChart(tecnicasCountArray);

    setTecnicasTarefasCounter(tecnicasCountArray);
    createAnaliseTecnicasTarefasChart(tecnicasCountArray);
}

function getTecnicasCounter(articlesBase) {
    const tecnicaReductedMap = articlesBase
        .reduce(articlesBaseReducer, {});

    return Object.keys(tecnicaReductedMap)
            .map((tecnicaKey) => {
                return tecnicaReductedMap[tecnicaKey];
            }).sort((a, b) => (b.count - a.count));

    function articlesBaseReducer(tecnicaCounts, article) {
        article.tecnicas
            .forEach((tecnica) => {
                if(!tecnicaCounts[tecnica]){
                    tecnicaCounts[tecnica] = {
                        name: tecnica,
                        count: 0,
                        articles: []
                    };
                }

                tecnicaCounts[tecnica].count += 1;
                tecnicaCounts[tecnica].articles.push(article);
            });

        return tecnicaCounts;
    }
}

function createAnaliseTecnicasChart(tecnicasCountArray) {
    Highcharts.chart('analiseTecnicaIAContainer', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Quais são as principais técnicas apresentados em SGOF?'
        },
        xAxis: {
            type: "category",
            title: {
                text: null
            },
            categories: tecnicasCountArray.map((tecnicaCount) => tecnicaCount.name)
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Population (millions)',
                align: 'high'
            },
            labels: {
                overflow: false
            },
            allowDecimals: false
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
                .filter((tecnicasCount) => tecnicasCount.count > 1)
                .map((tecnicasCount) => tecnicasCount.count)
        }]
    });
}

function setTecnicasTarefasCounter(tecnicasCountArray) {
    let tarefaIndex = 0;
    const tarefaMap = {};
    
    tecnicasCountArray.forEach((tecnicaCounter) => {
        tecnicaCounter.tarefasCounter = tecnicaCounter.articles.reduce(tecnicaCounterReducer, {});
    });

    function tecnicaCounterReducer(acc, article, index, array){
        acc[article["tarefa executada"]] = acc[article["tarefa executada"]]? (acc[article["tarefa executada"]] + 1) : 1;

        if(index < array.length - 1) {
            return acc;
        } else {
            return Object.keys(acc).map((tarefaKey) => {
                        if(tarefaMap[tarefaKey] === undefined) {
                            tarefaMap[tarefaKey] = tarefaIndex;
                            tarefaIndex += 1;
                        }

                        return {
                            'tarefa': tarefaKey,
                            'count': acc[tarefaKey],
                            'tarefaIndex': tarefaMap[tarefaKey]
                        }
                    });
        }
    }
}

function createAnaliseTecnicasTarefasChart(tecnicasCountArray) {

    const tecnicaIndexToNameMap = {};
    const tarefaIndexToNameMap = {};
    const tecnicaTarefaData = getTecnicaTarefaData(tecnicaIndexToNameMap, tarefaIndexToNameMap);

    console.log(tecnicaTarefaData);

    Highcharts.chart('analiseTecnicasTarefasIAContainer', {

        chart: {
            type: 'bubble',
            plotBorderWidth: 1,
            zoomType: 'xy'
        },
    
        legend: {
            enabled: false
        },
    
        title: {
            text: 'Qual relação de frequência entre as técnicas de IA e as tarefas de SGOF?'
        },
    
        xAxis: {
            gridLineWidth: 1,
            title: {
                text: 'Técnica'
            },
            labels: {
                formatter: function(){
                    if(tecnicaIndexToNameMap[this.value]){
                        return tecnicaIndexToNameMap[this.value] + `(${this.value})`
                    } else {
                        return '';
                    }
                }
            },
            allowDecimals: false,
            plotLines: [{
                color: 'black',
                dashStyle: 'dot',
                width: 2,
                value: 65,
                label: {
                    rotation: 0,
                    y: 15,
                    style: {
                        fontStyle: 'italic'
                    },
                    text: 'Safe fat intake 65g/day'
                },
                zIndex: 3
            }]
        },
    
        yAxis: {
            startOnTick: false,
            endOnTick: false,
            title: {
                text: 'Tarefa'
            },
            labels: {
                formatter: function(){
                    if(tarefaIndexToNameMap[this.value]){
                        return tarefaIndexToNameMap[this.value] + `(${this.value})`
                    } else {
                        return '';
                    }
                } 
            },
            maxPadding: 0.2,
            plotLines: [{
                color: 'black',
                dashStyle: 'dot',
                width: 2,
                value: 50,
                label: {
                    align: 'right',
                    style: {
                        fontStyle: 'italic'
                    },
                    text: 'Safe sugar intake 50g/day',
                    x: -10
                },
                zIndex: 3
            }]
        },
    
        tooltip: {
            useHTML: true,
            headerFormat: '<table>',
            pointFormat: '<tr><th colspan="2"><h3>{point.country}</h3></th></tr>' +
                '<tr><th>x:</th><td>{point.x}g</td></tr>' +
                '<tr><th>y:</th><td>{point.y}g</td></tr>' +
                '<tr><th>z:</th><td>{point.z}%</td></tr>',
            footerFormat: '</table>',
            followPointer: true
        },
    
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }
            }
        },
    
        series: [{
            data: tecnicaTarefaData
        }]
    
    });

    function getTecnicaTarefaData(tecnicaIndexToNameMap, tarefaIndexToNameMap){
        return tecnicasCountArray
            .filter((tecnicaCounterItem) => tecnicaCounterItem.count > 2)
            .reduce((accData, tecnicaCounterItem, tecnicaIndex) => {
                const tecnicaTarefaArray = tecnicaCounterItem.tarefasCounter
                .map((tarefaItem) => {
                    if(!tarefaIndexToNameMap[tarefaItem.tarefaIndex]){
                        tarefaIndexToNameMap[tarefaItem.tarefaIndex] = tarefaItem.tarefa;
                    }
                    
                    return {
                        x: tecnicaIndex,
                        y: tarefaItem.tarefaIndex,
                        z: tarefaItem.count
                    }
                });

            tecnicaIndexToNameMap[tecnicaIndex] = tecnicaCounterItem.name;

            return accData.concat(tecnicaTarefaArray);
        }, []);
    }
}