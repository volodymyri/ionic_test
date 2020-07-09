Ext.define('criterion.view.help.Articles', {

    extend : 'criterion.ux.Panel',

    requires : [
        'criterion.controller.help.Articles',
        'criterion.store.zendesk.articles.List',
        'criterion.store.zendesk.articles.Search',
        'criterion.ux.SimpleIframe'
    ],

    alias : 'widget.criterion_help_articles',

    viewModel : {
        data : {
            /**
             * used as consolidation point between two stores (search and list)
             */
            articles : null,
            searchText : '',

            articleTitle : ''
        },
        stores : {
            articlesSearch : {
                type : 'criterion_zendesk_articles_search'
            }
        }
    },

    controller : {
        type : 'criterion_help_articles'
    },

    titleAlign : 'right',

    header : {
        title : i18n.gettext('Help Center'),

        items : [
            {
                xtype : 'button',
                cls : 'criterion-btn-transparent',
                glyph : criterion.consts.Glyph['android-open'],
                margin : '0 0 0 5',
                scale : 'small',
                handler : 'onGotoHelpCenter'
            }
        ]
    },

    bodyPadding : '10 20 20',

    dockedItems : [
        {
            xtype : 'toolbar',
            dock : 'top',
            margin : '25 20 10 20',
            padding : 0,

            hidden : true,
            defaults : {
                margin : 0
            },
            items : [
                {
                    xtype : 'textfield',
                    reference : 'searchField',
                    emptyText : i18n.gettext('What do you need help with?'),
                    listeners : {
                        specialkey : 'onSpecialKey'
                    },
                    bind : {
                        value : '{searchText}'
                    },
                    flex : 1
                },
                {
                    xtype : 'button',
                    cls : 'criterion-btn-primary',
                    glyph : criterion.consts.Glyph['ios7-search'],
                    listeners : {
                        click : 'onSearch'
                    },
                    height : 36,
                    width : 46,
                    bind : {
                        disabled : '{!searchText}'
                    }
                }
            ]
        },

        {
            xtype : 'container',
            cls : 'criterion-help-contact-container',
            dock : 'bottom',
            height : 40,
            layout : {
                type : 'hbox',
                align : 'stretch'
            },
            items : [
                {
                    xtype : 'button',
                    cls : 'criterion-btn-transparent',
                    glyph : criterion.consts.Glyph['email'],
                    bind : {
                        text : '{helpCenterEmail}',
                        href : 'mailto:{helpCenterEmail}'
                    }
                },

                {
                    xtype : 'button',
                    cls : 'criterion-btn-transparent',
                    glyph : criterion.consts.Glyph['ios7-telephone'],
                    bind : {
                        text : '{helpCenterPhone}',
                        href : 'tel:{helpCenterPhone}'
                    }
                }
            ]
        }
    ],

    layout : 'vbox',

    scrollable : true,

    listeners : {
        resize : 'updateSize'
    },

    items : [
        {
            xtype : 'criterion_simple_iframe',
            reference : 'mainArticle',
            hidden : true,
            width : '100%',
            scrollable : false
        },
        {
            xtype : 'component',
            html : i18n.gettext('Related Articles'),
            cls : 'related-articles',
            reference : 'relatedArticlesHeader',
            margin : '10 0',
            padding : '20 0',
            width : '100%',
            hidden : true
        },
        {
            xtype : 'dataview',
            reference : 'relatedArticles',

            width : '100%',

            title : i18n.gettext('Related Articles'),

            bind : {
                store : '{articles}'
            },

            listeners : {
                itemclick : 'onArticleClick'
            },

            componentCls : 'criterion-help-articles',
            itemSelector : 'div.criterion-help-article',
            emptyText : i18n.gettext('No articles found.'),

            tpl : new Ext.XTemplate(
                '<tpl for=".">' +
                '<div class="criterion-help-article" title="Click to open article.">' +
                '<div class="title">' +
                '<h2>{title}</h2>' +
                '</div>' +
                '<div class="body">{bodyPreview}</div>' +
                '</div>' +
                '</tpl>'
            )
        }
    ],

    /**
     * @param {Array} labels
     */
    queryRelated : function(labels) {
        this.getController().searchByLabels(labels);
    }
});
