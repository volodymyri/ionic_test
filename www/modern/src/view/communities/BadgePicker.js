Ext.define('ess.view.communities.BadgePicker', {

    extend : 'Ext.Panel',

    requires : [
        'criterion.store.community.Users',
        'criterion.store.community.Badges',
        'ess.controller.communities.BadgePicker'
    ],

    alias : 'widget.ess_communities_badge_picker',

    cls : 'ess-modern-community-badge-picker',

    controller : {
        type : 'ess_communities_badge_picker'
    },

    viewModel : {
        data : {
            communityId : null,
            badgeRecipientId : null,
            badgeId : null,
            canRemove : false,
            authorId : null
        },
        stores : {
            communityUsers : {
                type : 'criterion_community_users',
                proxy : {
                    extraParams : {
                        communityId : '{communityId}'
                    }
                }
            },
            badges : {
                type : 'criterion_community_badges',
                listeners : {
                    load : 'onBadgesLoad'
                }
            }
        }
    },

    listeners : {
        scope : 'controller',
        show : 'onActivate'
    },

    items : [
        {
            xtype : 'ess_modern_menubar',
            docked : 'top',
            title : 'Badge',
            buttons : [
                {
                    xtype : 'button',
                    itemId : 'backButton',
                    cls : 'criterion-menubar-back-btn',
                    iconCls : 'md-icon-clear',
                    align : 'left',
                    handler : 'onAddBadgeCancel'
                }
            ],
            actions : [
                {
                    xtype : 'button',
                    iconCls : 'md-icon-done',
                    handler : 'onAddBadgeDone'
                }
            ]
        },
        {
            xtype : 'criterion_combobox',
            label : i18n.gettext('Recipient'),
            labelWidth : 140,
            margin : '10 20',
            bind : {
                store : '{communityUsers}',
                value : '{badgeRecipientId}'
            },
            displayField : 'personName',
            valueField : 'employeeId',
            queryMode : 'local',
            allowBlank : false,
            required : true
        },
        {
            xtype : 'dataview',
            reference : 'badgeDataview',
            scrollable : true,
            inline : true,
            cls : 'dataview-inline badge-list',
            margin : 20,
            bind : {
                store : '{badges}'
            },
            itemTpl : new Ext.XTemplate(
                '<tpl for=".">',
                '<div class="badge">' +
                '<img src="{imageUrl}" width="50" height="50" />' +
                '<p>{description}</p>' +
                '</div>',
                '</tpl>'
            )
        },

        {
            docked : 'bottom',
            xtype : 'toolbar',
            items : [
                '->',
                {
                    cls : 'btn-delete',
                    text : 'Remove Badge',
                    bind : {
                        hidden : '{!canRemove}'
                    },
                    handler : 'onBadgeRemove'
                }
            ]
        }
    ]
});
