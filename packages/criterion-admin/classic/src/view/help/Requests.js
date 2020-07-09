Ext.define('criterion.view.help.Requests', function() {

    return {
        alias : 'widget.criterion_help_requests',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.help.Requests',
            'criterion.view.help.Request',
            'criterion.store.zendesk.requests.List',
            'criterion.store.zendesk.requests.Search'
        ],

        layout : 'card',

        viewModel : {
            data : {
                /**
                 * used as consolidation point between two stores (search and list)
                 */
                requests : null,
                isForm : false,
                backButtonHidden : false
            },
            formulas : {
                titleText : function(get) {
                    return get('isForm') ? i18n.gettext('Submit a request') : i18n.gettext('Support')
                },
                backIsHidden : function(get) {
                    return !get('isForm') || get('backButtonHidden')
                }
            },
            stores : {
                requestsSearch : {
                    type : 'criterion_zendesk_requests_search'
                },
                requestsList : {
                    type : 'criterion_zendesk_requests_list'
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
                        hidden : '{backIsHidden}'
                    },
                    listeners : {
                        click : 'onToolbarBack'
                    }
                }
            ]
        },

        titleAlign : 'center',

        controller : {
            type : 'criterion_help_requests'
        },

        listeners : {
            activate : 'onActivate'
        },

        dockedItems : [
            {
                xtype : 'toolbar',
                dock : 'top',
                bind : {
                    hidden : '{isForm || !showCreateTicket}'
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
                        text : i18n.gettext('Submit a request'),
                        listeners : {
                            click : 'onToolbarAdd'
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
                            href: 'mailto:{helpCenterEmail}'
                        }
                    },

                    {
                        xtype : 'button',
                        cls : 'criterion-btn-transparent',
                        glyph : criterion.consts.Glyph['ios7-telephone'],
                        bind : {
                            text : '{helpCenterPhone}',
                            href: 'tel:{helpCenterPhone}'
                        }
                    }
                ]
            }
        ],

        items : [
            {
                xtype : 'dataview',

                reference : 'requestList',

                bodyPadding : '0 20',

                margin : '0 20',

                bind : {
                    store : '{requests}'
                },

                listeners : {
                    itemclick : 'onRequestClick'
                },

                componentCls : 'criterion-help-request-list',
                itemSelector : 'div.criterion-help-request-entry',
                emptyText : Ext.util.Format.format('<div class="empty">{0}</div>', i18n.gettext('No requests found.')),

                tpl : new Ext.XTemplate(
                    '<tpl for=".">' +
                        '<div class="criterion-help-request-entry {status}">' +
                            '<h2>#{id}</h2>' +
                            '<p class="title">{subject}</p>' +
                            '<table>' +
                                '<tr>' +
                                    '<td class="criterion-semibold-text">Created</td>' +
                                    '<td class="split">:</td>' +
                                    '<td>{created_at:date("m/d/Y")}</td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<td class="criterion-semibold-text">Last Activity</td>' +
                                    '<td class="split">:</td>' +
                                    '<td>{updated_at:date("m/d/Y")}</td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<td class="criterion-semibold-text">Status</td>' +
                                    '<td class="split">:</td>' +
                                    '<td class="status {status}">{status}</td>' +
                                '</tr>' +
                            '</table>' +
                        '</div>' +
                    '</tpl>'
                )
            },
            {
                xtype : 'criterion_help_request',
                reference : 'requestForm',
                listeners: {
                    afterSave : 'onAfterSave',
                    cancel : 'onToolbarBack',
                    beforeSaveRequest : 'onBeforeSaveRequest',
                    afterSaveRequest : 'onAfterSaveRequest'
                }
            }
        ]
    };

});
