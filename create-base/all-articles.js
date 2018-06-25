const constants = require('./all-articles-consts')
const csv = require('csvtojson')

module.exports.getAllArticles = getAllArticles;

function getAllArticles(){
    return csv().fromFile('all-articles.csv')
        .then((allArticles) => {
            return processAllArticles(allArticles);
        });
}

function processAllArticles(allArticles) {
    return allArticles
            .filter(article => article.status === constants.ACCEPTED_STATUS)
            .map((article) => {
                return cleanArticleKeys(article);
            });
}

// function postProcessing(processedArticles) {
//     console.log(processedArticles);
// }

function cleanArticleKeys(rawArticle){
    return Object.keys(rawArticle)
            .reduce((cleanArticle, articleKey) => {
                if(constants.allArticlesFields[articleKey] === 1){
                    cleanArticle[articleKey] = rawArticle[articleKey];
                }

                return cleanArticle;
            }, {})
}