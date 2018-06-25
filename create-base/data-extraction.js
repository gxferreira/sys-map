const csv = require('csvtojson');

module.exports.getDataExtraction = getDataExtraction;

function getDataExtraction() {
    return csv().fromFile('data-extraction.csv')
            .then((articlesExtractedData) => {
                return processExtractedData(articlesExtractedData);
            })
}

function processExtractedData(rawExtractedData) {
    return rawExtractedData.map((rawExtraction) => {
        return Object.keys(rawExtraction)
            .reduce((parsedExtraction, rawExtractionKey) => {
                if(rawExtractionKey.includes('Técnica')){
                    processRawTecnicaKey(rawExtraction, rawExtractionKey, parsedExtraction);
                } else {
                    parsedExtraction[rawExtractionKey] = rawExtraction[rawExtractionKey]
                }

                return parsedExtraction;
            }, {});
    });
}

function processRawTecnicaKey(rawExtraction, rawExtractionKey, parsedExtraction) {
    if(!parsedExtraction.tecnicas){
        parsedExtraction.tecnicas = [];
    }

    if(rawExtraction[rawExtractionKey] != ''){
        const tecnicaIndex = (+rawExtractionKey.split(' ')[1]) - 1;
        parsedExtraction.tecnicas[+tecnicaIndex] = rawExtraction[rawExtractionKey];
    }
}