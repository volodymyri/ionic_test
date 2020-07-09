Ext.define('ess.view.communities.PostEditor', {

    extend : 'Ext.form.Panel',

    requires : [
        'ess.controller.communities.PostEditor',
        'Ext.Img',
        'criterion.ux.component.Html5Editor'
    ],

    alias : 'widget.ess_communities_post_editor',

    viewModel : {
        data : {
            posting : null
        },

        formulas : {
            badgeBtnLabel : function(vmget) {
                return vmget('posting.badgeId') ? 'Change Badge' : 'Add a badge';
            }
        }
    },

    controller : {
        type : 'ess_communities_post_editor'
    },

    listeners : {
        scope : 'controller',
        activate : 'onActivate',
        initialize : 'handleInitialize'
    },

    cls : 'ess-modern-community-post-editor',

    items : [
        {
            xtype : 'ess_modern_menubar',
            docked : 'top',
            title : 'Posting',
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
                    iconCls : 'md-icon-done',
                    handler : 'onSave'
                }
            ]
        },
        {
            xtype : 'criterion_combobox',
            label : i18n.gettext('Community'),
            labelWidth : 140,
            bind : {
                store : '{communities}',
                value : '{posting.communityId}',
                disabled : '{!posting.phantom}'
            },
            required : true,
            displayField : 'name',
            valueField : 'id',
            queryMode : 'local',
            listeners : {
                change_ : function(combo, newVal, val) {
                    var vm = combo.up('ess_communities_post_editor').getViewModel();

                    if (val && newVal && (val !== newVal)) {
                        // reset badge
                        vm.set('posting.badgeId', null);
                        vm.set('posting.badgeRecipientId', null);
                        vm.set('posting.badgeRecipientName', null);
                    }
                }
            }
        },
        {
            xtype : 'criterion_html5editor',
            reference : 'message',
            placeholder : 'Enter your message',
            height : 200,
            bind : {
                value : '{posting.message}'
            }
        },
        {
            xtype : 'panel',
            cls : 'button-panel',
            docked : 'bottom',
            layout : {
                type : 'hbox'
            },
            items : [
                {
                    xtype : 'container',
                    layout : 'vbox',
                    hidden : true,
                    margin : '0 20 10 10',
                    bind : {
                        hidden : '{!posting.badgeId}'
                    },
                    items : [
                        {
                            xtype : 'image',
                            alt : 'badge',
                            width : 50,
                            height : 50,
                            mode : 'img',
                            cls : 'badge-img',
                            bind : {
                                src : '{posting.badgeImageUrl}'
                            }
                        },
                        {
                            xtype : 'container',
                            bind : {
                                html : '{posting.badgeRecipientName}'
                            }
                        }
                    ]
                },
                {
                    xtype : 'button',
                    align : 'right',
                    bind : {
                        text : '{badgeBtnLabel}',
                        disabled : '{!posting.communityId}'
                    },
                    handler : 'onAddBadge'
                }
            ]
        }
    ]
});
