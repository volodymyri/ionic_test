Ext.define('criterion.view.ess.community.BadgePicker', {

    extend : 'criterion.ux.Panel',

    alias : 'widget.criterion_ess_community_badge_picker',

    requires : [
        'criterion.store.community.Users',
        'criterion.store.community.Badges',
        'criterion.controller.ess.community.BadgePicker'
    ],

    plugins : [
        {
            ptype : 'criterion_sidebar',
            width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,
            modal : true,
            height : 520
        }
    ],

    viewModel : {
        data : {
            communityId : null,
            badgeRecipientId : null,
            badgeId : null,
            canRemove : false,
            /**
             * employeeId of posting author
             */
            authorId : null
        },
        formulas : {
            isValid : function(vmget) {
                return vmget('badgeRecipientId') && vmget('badgeRecipientId')
            }
        },
        stores : {
            communityUsers : {
                type : 'criterion_community_users',
                proxy : {
                    extraParams : {
                        communityId : '{communityId}'
                    }
                },
                listeners : {
                    load : 'onCommunityUsersLoad'
                },
                autoLoad : true
            },
            badges : {
                type : 'criterion_community_badges',
                listeners : {
                    load : 'onBadgesLoad'
                },
                autoLoad : true
            }
        }
    },

    title : i18n.gettext('Add a Badge'),

    buttons : [
        {
            xtype : 'button',
            ui : 'remove',
            text : i18n.gettext('Remove'),
            bind : {
                hidden : '{!canRemove}'
            },
            listeners : {
                click : 'onRemove'
            }
        },
        '->',
        {
            xtype : 'button',
            ui : 'light',
            text : i18n.gettext('Cancel'),
            listeners : {
                click : function() {
                    this.up('criterion_ess_community_badge_picker').close();
                }
            }
        },
        {
            xtype : 'button',
            text : i18n.gettext('Select'),
            listeners : {
                click : 'onSelect'
            },
            bind : {
                disabled : '{!isValid}'
            }
        }
    ],
    
    controller : {
        type : 'criterion_ess_community_badge_picker'
    },

    layout : {
        type : 'vbox',
        align : 'stretch'
    },

    items : [
        {
            xtype : 'container',
            items : [
                {
                    xtype : 'combobox',
                    margin : '0 20 20',
                    fieldLabel : i18n.gettext('Recipient'),
                    bind : {
                        store : '{communityUsers}',
                        value : '{badgeRecipientId}'
                    },
                    displayField : 'personName',
                    valueField : 'employeeId',
                    queryMode : 'local',
                    allowBlank : false
                }
            ]
        },
        {
            xtype : 'dataview',
            cls : 'badge-list',
            flex : 1,
            scrollable : 'vertical',
            reference : 'badgeDataView',
            bind : {
                store : '{badges}'
            },
            tpl: new Ext.XTemplate(
                '<tpl for=".">',
                    '<div class="badge">' +
                        '<img src="{imageUrl}"/><p>{description}</p>' +
                    '</div>',
                '</tpl>'
            ),
            itemSelector: 'div.badge',
            emptyText: i18n.gettext('No Badges'),
            listeners : {
                select : 'onBadgeSelect'
            }
        }
    ]

});