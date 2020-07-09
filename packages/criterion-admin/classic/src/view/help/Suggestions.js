/**
 * @deprecated kill after 09.08.18
 */
Ext.define('criterion.view.help.Suggestions', function() {

    return {
        alias : 'widget.criterion_help_suggestions',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.help.Suggestions',
            'criterion.view.help.Suggestion',
            'criterion.store.zendesk.posts.List'
        ],

        layout : 'card',

        viewModel : {
            data : {
                isForm : false,
                newRecord : null
            },
            formulas : {
                titleText : function(get) {
                    return (get('isForm') && get('newRecord')) ? i18n.gettext('Create Suggestion') : i18n.gettext('Suggestion')
                }
            },
            stores : {
                posts : {
                    type : 'criterion_zendesk_posts_list'
                }
            }
        },

        header : {
            bind : {
                title : '{titleText}'
            },
            titlePosition : 1,
            titleAlign : 'center',
            defaults : {
                cls : 'criterion-btn-transparent',
                scale : 'medium',
                padding : 0
            },
            items : [
                {
                    xtype : 'button',
                    glyph : criterion.consts.Glyph['ios7-arrow-back'],
                    bind : {
                        hidden : '{!isForm}'
                    },
                    listeners : {
                        click : 'onToolbarBack'
                    }
                }
            ]
        },

        titleAlign : 'center',

        controller : {
            type : 'criterion_help_suggestions'
        },

        listeners : {
            activate : 'onActivate'
        },

        dockedItems : [
            {
                xtype : 'toolbar',
                dock : 'top',
                bind : {
                    hidden : '{isForm}'
                },
                margin : '20 20 0',
                padding : '0 0 20',
                defaults : {
                    margin : 0
                },
                style : {
                    background : 'transparent',
                    'border-bottom' : '1px solid #e8e8e8 !important'
                },
                items : [
                    '->',
                    {
                        xtype : 'button',
                        cls : 'criterion-btn-primary',
                        text : i18n.gettext('Create Suggestion'),
                        listeners : {
                            click : 'onToolbarAdd'
                        }
                    }
                ]
            }
        ],

        items : [
            {
                xtype : 'dataview',

                reference : 'postList',

                bodyPadding : '0 20',

                margin : '0 20',

                bind : {
                    store : '{posts}'
                },

                listeners : {
                    itemclick : 'onPostClick'
                },

                componentCls : 'criterion-help-post-list',
                itemSelector : 'div.criterion-help-post-entry',
                emptyText : Ext.util.Format.format('<div class="empty">{0}</div>', i18n.gettext('No suggestions found.')),

                tpl : new Ext.XTemplate(
                    '<tpl for=".">' +
                        '<div class="criterion-help-post-entry {status}">' +
                            '<p class="title">{title}</p>' +
                            '<div class="details">{[this.getDetails(values.details)]}</div>' +
                            '<table>' +
                                '<tr>' +
                                    '<td>Status</td>' +
                                    '<td class="split">:</td>' +
                                    '<td class="status {status}">{statusText}</td>' +
                                '</tr>' +
                            '</table>' +
                        '</div>' +
                    '</tpl>',
                    {
                        getDetails : function(details) {
                            var text = Ext.util.Format.htmlEncode(details);

                            if (text.length > 160) {
                                text = text.slice(0, 160) + '...';
                            }

                            return text
                        }
                    }
                )
            },
            {
                xtype : 'criterion_help_suggestion',
                reference : 'postForm',
                listeners: {
                    afterSave : 'onAfterSave',
                    cancel : 'onToolbarBack'
                }
            }
        ]
    };

});
