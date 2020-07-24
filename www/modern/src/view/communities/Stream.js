Ext.define('ess.view.communities.Stream', {

    extend : 'Ext.Container',

    requires : [
        'ess.controller.communities.Stream',
        'criterion.store.community.Postings'
    ],

    alias : 'widget.ess_communities_stream',

    viewModel : {
        data : {

        },
        stores : {
            postings : {
                type : 'criterion_community_postings',
                proxy : {
                    url : criterion.consts.Api.API.COMMUNITY_POSTING_FOR_EMPLOYEE
                },
                listeners : {
                    load : 'onPostingsLoad'
                },
                sorters : [
                    {
                        property : 'creationDate',
                        direction : 'DESC'
                    }
                ]
            }
        }
    },

    controller : {
        type : 'ess_communities_stream'
    },

    listeners : {
        scope : 'controller'
    },

    layout : 'fit',

    cls : 'ess-modern-community-stream',

    items : [
        {
            xtype : 'ess_modern_menubar',
            docked : 'top',
            title : 'Communities',
            actions : [
                {
                    xtype : 'button',
                    text : '',
                    iconCls : 'md-icon-add',
                    iconAlign : 'center',
                    handler : 'onPostingAdd',
                    hidden : true,
                    bind : {
                        hidden : '{blockAddPost}'
                    }
                }
            ]
        },

        {
            xtype : 'dataview',
            cls : 'data-view',
            bind : {
                store : '{postings}'
            },

            listeners : {
                itemtap : function(cmp, index, item, record, e ) {
                    var view = cmp.up('ess_communities'),
                        viewStream = cmp.up('ess_communities_stream'),
                        controller = view.getController(),
                        className = e.target.className;


                    if (className.indexOf('likes') !== -1) {
                        viewStream.getController().onLike(record, item);
                    }
                    if (className.indexOf('replies') !== -1 && parseInt(e.target.getAttribute('replyEditable'), 10)) {
                        controller.addReplyToPosting(record, item);
                    }
                    if (className.indexOf('comments-trigger') !== -1) {
                        Ext.get(item).down('div.replies').toggleCls('hidden');
                    }
                    if (className.indexOf('posting-edit-trigger') !== -1) {
                        controller.editPosting(record, item);
                    }
                    if (className.indexOf('reply-edit-trigger') !== -1) {
                        controller.editReplyPosting(record, item, e.target.getAttribute('replyId'));
                    }

                    // profile stream
                    if (className.indexOf('employee-name') !== -1 || className.indexOf('header-photo') !== -1) {
                        controller.showProfile(record.get('employeeId'));
                    }
                    // profile replies
                    if (className.indexOf('reply-name') !== -1 || className.indexOf('reply-photo') !== -1) {
                        controller.showProfile(e.target.getAttribute('data-employeeId'));
                    }
                }
            },

            itemTpl : new Ext.XTemplate(
                '<div class="posting" data-posting-id="{id}">',
                    '<div class="heading">' +
                        '<div class="header-photo-wrap">' +
                            '<div class="header-photo" style="background-image: url({authorPhotoUrl});"></div>' +
                        '</div>' +
                        '<div class="header-center">' +
                            '<p class="employee-name {[values.authorInactive ? "author-inactive" : ""]}">{authorName}</p>' +
                            '<tpl if="lastEditDate">' +
                                '<p>{lastEditDate:date("dS F Y - h:i a")}</p>' +
                            '<tpl else>' +
                                '<p>{creationDate:date("dS F Y - h:i a")}</p>' +
                            '</tpl>' +
                        '</div>' +
                        '<div class="header-community-wrap">' +
                            '<div class="header-community" style="background-image: url({communityImageUrl});">{community.name}</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="content">' +
                        '<div class="content-message">' +
                         '{message}' +
                        '</div>' +
                        '<tpl if="badgeId">' +
                            '<div class="content-badge">' +
                             '<img src="{badgeImageUrl}"/>' +
                             '<p>{badgeRecipientName}</p>' +
                            '</div>' +
                        '</tpl>' +
                    '</div>' +
                    '<div class="footer">' +
                        '<span class="footer-likes {[values.hasMyLike ? "has-my-like" : ""]}"><i class="fa fa-thumbs-up likes"></i><i class="likes-count">{[values.likesCount ? values.likesCount : "<span>No</span>"]}</i> Likes</span>' +
                        '<span class="footer-replies {[values.hasMyReply ? "has-my-reply" : ""]}" replyEditable="{[values.replyable ? "1" : "0"]}"><i class="fa fa-retweet replies" replyEditable="{[values.editable ? "1" : "0"]}"></i><i class="replies-count">{[values.repliesCount ? values.repliesCount : "<span>No</span>"]}</i> Replies</span>' +
                        '<div class="footer-comments-trigger">' +
                            '<tpl if="repliesCount">' +
                             '<i class="fa fa-caret-down comments-trigger" aria-hidden="true"></i>' +
                            '</tpl>' +
                        '</div>' +
                        '<tpl if="editable">' +
                            '<span class="posting-edit-trigger"><i class="fa fa-pencil replies"></i> Edit</span>' +
                        '</tpl>' +
                    '</div>' +
                    '<div class="replies hidden">' +
                        '<tpl for="reactions">' +
                            '<tpl if="!isLiked">' +
                                '<div class="reply-header">' +
                                    '<div class="reply-photo-wrap">' +
                                        '<div class="reply-photo" data-employeeId="{employeeId}" style="background-image: url({authorPhotoUrl});"></div>' +
                                    '</div>' +
                                    '<div class="reply-center">' +
                                        '<p class="reply-name {[values.authorInactive ? "author-inactive" : ""]}" data-employeeId="{employeeId}">{authorName}</p>' +
                                        '<tpl if="lastEditDate">' +
                                            '<p class="reply-dateblock">{lastEditDate:date("dS F Y - h:i a")}</p>' +
                                        '<tpl else>' +
                                            '<p class="reply-dateblock">{creationDate:date("dS F Y - h:i a")} ' +
                                            '<tpl if="editable"><span class="reply-edit-trigger" replyId="{id}"> Edit</span></tpl>' +
                                            '</p>' +
                                        '</tpl>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="reply-content">' +
                                    '{message}' +
                                '</div>' +
                            '</tpl>' +
                        '</tpl>' +
                    '</div>' +
                '</div>'
            ),
            itemSelector : 'div.posting',
            emptyText : '<br />&nbsp;&nbsp;' + i18n.gettext('No Posts')
        },
        {
            xtype : 'selectfield',
            reference : 'checkInPlacePicker',
            hidden : true,
            autoSelect : false,
            valueField : 'id',
            displayField : 'description',
            bind : {
                store : '{employerLocations}'
            },
            listeners : {
                select : 'onCheckInPlacePick'
            }
        }

    ]
});
