Ext.define('criterion.controller.help.Articles', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_help_articles',

        onGotoHelpCenter : function() {
            window.open(criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.ZENDESK_GO_TO_EXTERNAL_URL + '?' + Ext.Object.toQueryString({url : criterion.consts.Help.HELP_CENTER_URL})), '_blank');
        },

        onSpecialKey : function(field, e) {
            if (e.getKey() === e.ENTER) {
                this.onSearch();
            }
        },

        onSearch : function() {
            this.searchByToken(this.lookupReference('searchField').getValue())
        },

        /**
         * @protected
         * @param [token]
         */
        searchByToken : function(token) {
            var store,
                vm = this.getViewModel(),
                mainArticle = this.lookupReference('mainArticle'),
                relatedArticles = this.lookupReference('relatedArticles');

            store = this.getStore('articlesSearch');

            if (store.isLoading()) {
                return;
            }

            store.loadWithPromise({
                params : {
                    query : token
                }
            }).then({
                success : function() {
                    mainArticle.setHidden(true);
                    relatedArticles.setHidden(false);

                    vm.set('articles', store);
                }
            })
        },

        /**
         * @protected
         * @param labels
         */
        searchByLabels : function(labels) {
            var me = this,
                store,
                vm = this.getViewModel(),
                view = this.getView(),
                mainArticle = this.lookupReference('mainArticle'),
                relatedArticles = this.lookupReference('relatedArticles'),
                relatedArticlesHeader = this.lookupReference('relatedArticlesHeader');

            store = this.getStore('articlesSearch');

            if (!labels || !labels.length) {
                return;
            }

            view.setLoading(true);

            mainArticle.setHidden(true);
            relatedArticles.setHidden(true);
            relatedArticlesHeader.setHidden(true);
            this.lookupReference('searchField').setValue('');

            // first label is always considered as primary
            store.sort([this.createSorter(labels[0])]);

            store.loadWithPromise({
                params : {
                    labelNames : labels.join(',')
                }
            }).then({
                success : function() {
                    if (store.count()) {
                        let firstArticle = store.getAt(0);

                        mainArticle.setSrcDoc(Ext.String.format(
                            '<html><head><link rel="stylesheet" href="{0}"></head><body><strong class="title">{1}</strong>{2}</body></html>',
                            criterion.Api.getSecureResourceUrl('libs/zendesk-article.css'),
                            firstArticle.get('name'),
                            firstArticle.get('body')
                        ));

                        me.getViewModel().set('articleTitle', firstArticle.get('name'));

                        Ext.Function.defer(me.updateSize, 1000, me);

                        store.remove(firstArticle);
                    } else {
                        me.setNoHelpText(mainArticle);
                        view.setLoading(false);
                    }

                    relatedArticles.setHidden(!store.count());
                    relatedArticlesHeader.setHidden(!store.count());

                    vm.set('articles', store);
                },
                failure : function() {
                    view.setLoading(false);
                }
            });
        },

        updateSize : function() {
            let view = this.getView(),
                mainArticle = this.lookupReference('mainArticle'),
                body = mainArticle.getDocument().body;

            mainArticle.setHidden(false);

            if (body) {
                mainArticle.setHeight(body.scrollHeight);

                Ext.Array.each(body.querySelectorAll('a'), function(element) {
                    element.href = criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.ZENDESK_GO_TO_EXTERNAL_URL + '?' + Ext.Object.toQueryString({url : element.pathname}));
                    element.target = '_blank';
                });

                Ext.Array.each(body.querySelectorAll('img'), function(element) {
                    let parser = document.createElement('a');

                    parser.href = element.src;

                    element.addEventListener('load', function() {
                        mainArticle.setHeight(body.scrollHeight);
                    });

                    element.src = criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.ZENDESK_GO_TO_EXTERNAL_URL + '?' + Ext.Object.toQueryString({url : parser.pathname}));
                });

                let articlesEl = mainArticle.up().getEl(),
                    articleBody = articlesEl && articlesEl.dom.querySelector('div[data-ref="body"]'),
                    frameBodyPadding = articleBody && parseInt(articleBody.style.padding.replace('px', '')) || 0;

                frameBodyPadding += 20;

                Ext.Array.each(body.querySelectorAll('table'), function(element) {
                    element.style.maxWidth = mainArticle.getWidth() - frameBodyPadding + 'px';
                });

                Ext.Array.each(body.querySelectorAll('img'), function(element) {
                    element.style.maxWidth = '90%';
                    element.style.height = 'auto';
                });

                if (mainArticle.getHeight() < body.clientHeight + 50) {
                    mainArticle.setHeight(body.clientHeight + 50);
                }
            }

            view.setLoading(false);
        },

        setNoHelpText : function(mainArticle) {
            this.getViewModel().set('articleTitle', '');
            mainArticle.setHidden(false);
            mainArticle.setSrcDoc(Ext.String.format(
                '<html><head><link rel="stylesheet" href="{0}"></head><body>{1}</body></html>',
                criterion.Api.getSecureResourceUrl('libs/zendesk-article.css'),
                i18n.gettext('No help available for this topic')
            ));
        },

        createSorter : function(primaryLabel) {
            return {
                sorterFn : function(record1, record2) {
                    var isPrimaryLabel1 = record1.getData()['label_names'].indexOf(primaryLabel) !== -1,
                        isPrimaryLabel2 = record2.getData()['label_names'].indexOf(primaryLabel) !== -1,
                        result;

                    if (isPrimaryLabel1 && !isPrimaryLabel2) {
                        result = 1;
                    } else if (!isPrimaryLabel1 && isPrimaryLabel2) {
                        result = -1;
                    } else {
                        result = 0;
                    }

                    return result;
                },
                direction : 'DESC'
            }
        },

        onArticleClick : function(cmp, record) {
            window.open(criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.ZENDESK_GO_TO_EXTERNAL_URL + '?' + Ext.Object.toQueryString({url : 'hc/articles/' + record.getId()})));
        }
    };

});
