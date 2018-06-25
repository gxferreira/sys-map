d3.json('../data/articles-base.json')
    .then((articlesBase) => {
        createAnaliseTecnicasIA(articlesBase);
        createAnaliseTarefasIA(articlesBase);
    })