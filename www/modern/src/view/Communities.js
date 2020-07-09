Ext.define('ess.view.Communities', {

    extend : 'Ext.Container',

    requires : [
        'ess.controller.Communities',
        'ess.view.communities.PostEditor',
        'ess.view.communities.ReplyEditor',
        'ess.view.communities.Stream',
        'ess.view.communities.Profile',
        'ess.view.communities.BadgePicker',

        'criterion.store.Communities'
    ],

    alias : 'widget.ess_communities',

    viewModel : { 
        data : {
            blockAddPost : false
        },

        stores : {
            communities : {
                type : 'criterion_communities',
                proxy : {
                    url : criterion.consts.Api.API.COMMUNITY_FOR_EMPLOYEE
                },
                filters : [
                    {
                        property : 'canPost',
                        value : true
                    }
                ]
            }
        }
    },

    controller : {
        type : 'ess_communities'
    },

    listeners : {
        scope : 'controller',
        activate : 'onActivate'
    },

    layout : 'card',

    items : [
        {
            xtype : 'ess_communities_stream',
            reference : 'stream',
            listeners : {
                addPosting : 'editPosting',
                editPosting : 'editPosting'
            }
        },
        {
            xtype : 'ess_communities_post_editor',
            reference : 'postingEditor',
            listeners : {
                cancelEdit : 'cancelEdit',
                savePosting : 'savePosting',
                showBadgePicker : 'showBadgePicker'
            }
        },
        {
            xtype : 'ess_communities_badge_picker',
            reference : 'badgePicker',
            listeners : {
                addBadgeCancel : 'onAddBadgeCancel',
                badgeSelect : 'onAddBadgeDone'
            }
        },
        {
            xtype : 'ess_communities_reply_editor',
            reference : 'replyEditor',
            listeners : {
                cancelEdit : 'cancelEditReply',
                saveReply : 'saveReply'
            }
        },
        {
            xtype : 'ess_communities_profile',
            reference : 'profileView',
            listeners : {
                cancelViewProfile : 'cancelViewProfile'
            }
        }
    ]
});
