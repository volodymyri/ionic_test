Ext.define('ess.view.ExternalLinks', function() {

    return {
        alias : 'widget.ess_modern_external_links',

        extend : 'Ext.Container',

        title : 'External Links',

        requires : [
            'criterion.store.employer.EssLinks',
            'ess.controller.ExternalLinks'
        ],

        viewModel : {
            stores : {
                links : {
                    type : 'criterion_employer_ess_links'
                }
            }
        },

        controller : {
            type : 'ess_modern_external_links'
        },

        cls : 'ess-external-links',

        listeners : {
            activate : 'load'
        },

        layout : 'fit',

        items : [
            {
                xtype : 'ess_modern_menubar',
                docked : 'top'
            },
            {
                xtype : 'list',
                height : '100%',
                reference : 'externalLinkList',
                itemCls : 'ess-external-links-list-item',
                itemTpl : '<span class="text-link">{description}</span>',
                bind : {
                    store : '{links}'
                },
                listeners : {
                    itemTap : 'onLinkTap'
                }
            }
        ]

    };

});
