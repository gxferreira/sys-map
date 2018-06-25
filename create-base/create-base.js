const fs = require('fs');
const allArticlesModule = require('./all-articles');
const dataExtractionModule = require('./data-extraction');


Promise.all([allArticlesModule.getAllArticles(), dataExtractionModule.getDataExtraction()])
    .then((promisesData) => {
        const allArticles = promisesData[0];
        const dataExtraction = promisesData[1];

        return allArticles
                .map((article) => {
                    const dataExtractionData = dataExtraction
                        .filter(dataExtractionItem => dataExtractionItem.article == article.title);

                    return Object.assign(article, dataExtractionData[0]);
                });
    }).then((mergedArticles) => {
        const json = JSON.stringify(mergedArticles, null, '\t');
        
        fs.writeFile('articles-base.json', json, 'utf8', () => {
            console.log('Base criada!');
        });
    });