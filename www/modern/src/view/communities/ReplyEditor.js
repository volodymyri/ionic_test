Ext.define('ess.view.communities.ReplyEditor', {

    extend : 'Ext.form.Panel',

    requires : [
        'ess.controller.communities.ReplyEditor'
    ],

    alias : 'widget.ess_communities_reply_editor',

    viewModel : {
        data : {
            posting : null,
            reply : null
        }
    },

    controller : {
        type : 'ess_communities_reply_editor'
    },

    listeners : {
        scope : 'controller',
        activate : 'onActivate',
        initialize : 'handleInitialize'
    },

    cls : 'ess-modern-community-reply-editor',

    items : [
        {
            xtype : 'ess_modern_menubar',
            docked : 'top',
            title : 'Reply',
            buttons : [
                {
                    xtype : 'button',
                    itemId : 'backButton',
                    cls : 'criterion-menubar-back-btn',
                    iconCls : 'md-icon-clear',
                    align : 'left',
                    handler : 'onCancel'
                }
            ],
            actions : [
                {
                    xtype : 'button',
                    text : '',
                    iconCls : 'md-icon-done',
                    handler : 'onSave'
                }
            ]
        },

        {
            bind : {
                html : 'Reply to <strong>{posting.authorName}</strong>'
            },
            margin : '10 0 10 0'
        },
        {
            xtype : 'textareafield',
            reference : 'replyEditor',
            placeholder : 'Enter your reply',
            height : 200,
            bind : {
                value : '{reply.message}'
            }
        }
    ]
});

