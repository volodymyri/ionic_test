Ext.define('criterion.view.ess.community.ReplyBox', {

    extend : 'criterion.ux.Panel',

    alias : 'widget.criterion_ess_community_reply_box',

    layout : 'hbox',

    width : '100%',

    referenceHolder : true,

    config : {
        imageUrl : null
    },

    bodyPadding : '12 12 12 0',

    items : [
        {
            xtype : 'container',
            layout : 'vbox',
            items : [
                {
                    height : 165
                },
                {
                    xtype : 'component',
                    reference : 'replyPostPhoto',
                    margin : '0 10 0 15',
                    tpl : new Ext.Template(
                        '<div class="employee-photo-wrap">',
                        '<div class="employee-photo" style="background-image: url({imageUrl});"></div>',
                        '</div>'
                    ),
                    data : {
                        imageUrl : criterion.consts.Api.API.EMPLOYEE_NO_PHOTO_90
                    }
                }
            ]
        },
        {
            xtype : 'criterion_panel',

            cls : 'reply-editor',

            layout : 'fit',

            flex : 1,

            dockedItems : [
                {
                    xtype : 'toolbar',
                    dock : 'bottom',
                    margin : 0,
                    padding : 10,
                    cls : 'reply-editor-bottom-bar',
                    default : {
                        margin : 0
                    },
                    items : [
                        '->',
                        {
                            cls : 'criterion-btn-ess-new-light',
                            text : i18n.gettext('Cancel'),
                            margin : '0 5 0 0',
                            listeners : {
                                click : function() {
                                    this.up('criterion_ess_community_reply_box').close();
                                }
                            }
                        },
                        {
                            cls : ['criterion-btn-ess-new-primary', 'criterion-btn-ess-post'],
                            text : i18n.gettext('Post Reply'),
                            margin : 0,
                            listeners : {
                                click : function() {
                                    var view = this.up('criterion_ess_community_reply_box'),
                                        editor = view.down('criterion_ess_community_html_editor');

                                    if (editor.getValue()) {
                                        view.fireEvent('postReply', editor.getValue());
                                        editor.destroy();
                                        view.close();
                                    }
                                }
                            }
                        }
                    ]
                }
            ],

            items : [
                {
                    xtype : 'criterion_ess_community_html_editor',
                    enableFont : false,
                    bodyPadding : 10,
                    margin : 0,
                    frame : false,
                    height : 150
                }
            ]
        }
    ],

    updateImageUrl : function(imageUrl) {
        this.lookup('replyPostPhoto').setData({
            imageUrl : imageUrl
        });
    }
});
