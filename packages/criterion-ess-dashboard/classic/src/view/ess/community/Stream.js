Ext.define('criterion.view.ess.community.Stream', {

    extend : 'Ext.panel.Panel',

    requires : [
        'criterion.controller.ess.community.Stream',
        'criterion.store.Communities',
        'criterion.store.community.Postings',
        'criterion.view.ess.community.PostEditor',
        'criterion.view.ess.community.ReplyBox',
        'criterion.view.ess.ProfilePopup',
        'criterion.view.ess.CommunityPopup'
    ],

    alias : 'widget.criterion_ess_community_stream',

    title : i18n.gettext('Feed'),

    cls : 'criterion-ess-community-stream dashboard-panel',

    iconCls : 'icon-tasks',

    listeners : {
        communityPostCreateStatus : 'handleCommunityPostCreateStatusChange'
    },

    viewModel : {
        data : {
            hasPostings : false,
            showNewPostEditor : false,
            hidePostMessage : false,
            hasCommunity : false
        },

        stores : {
            postings : {
                type : 'criterion_community_postings',
                proxy : {
                    url : criterion.consts.Api.API.COMMUNITY_POSTING_FOR_EMPLOYEE
                },

                pageSize : 10,
                clearOnPageLoad : false,

                listeners : {
                    load : 'onPostingsLoad'
                },
                sorters : [
                    {
                        property : 'creationDate',
                        direction : 'DESC'
                    }
                ]
            },
            communities : {
                type : 'criterion_communities',
                proxy : {
                    url : criterion.consts.Api.API.COMMUNITY_FOR_EMPLOYEE
                }
            }
        }
    },

    controller : {
        type : 'criterion_ess_community_stream'
    },

    dockedItems : [
        {
            xtype : 'toolbar',

            dock : 'top',

            layout : {
                type : 'hbox',
                align : 'stretch'
            },

            flex : 1,

            hidden : true,

            padding : 0,

            bind : {
                hidden : '{hidePostMessage || !hasCommunity}'
            },

            items : [
                {
                    xtype : 'container',

                    layout : {
                        type : 'center'
                    },

                    flex : 1,

                    margin : '0 0 15 0',

                    reference : 'newPostContainer',

                    items : [
                        {
                            layout : 'hbox',
                            width : '100%',
                            hidden : true,
                            bind : {
                                hidden : '{!showNewPostEditor}'
                            },
                            items : [
                                {
                                    xtype : 'criterion_ess_community_post_editor',
                                    flex : 1,
                                    reference : 'newPostEditor',
                                    margin : '0 20',
                                    listeners : {
                                        save : 'handlePostingSave',
                                        cancel : 'handlePostingCancel'
                                    }
                                }
                            ]
                        },
                        {
                            layout : 'hbox',
                            width : '100%',
                            flex : 1,
                            hidden : true,
                            bind : {
                                hidden : '{showNewPostEditor}'
                            },
                            items : [
                                {
                                    xtype : 'button',
                                    cls : 'post-message-button criterion-btn-transparent',
                                    text : i18n.gettext('Post a Message'),
                                    textAlign : 'left',
                                    flex : 1,
                                    margin : '0 20',
                                    handler : 'handlePostMessage'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],

    padding : 0,

    margin : 0,

    addItems : function() {
        this.add(
            {
                xtype : 'dataview',
                generateClassesBlackList : true,
                loadMask : false,
                bind : {
                    store : '{postings}'
                },
                selectedItemCls : '',
                focusable : false,
                listeners : {
                    itemclick : 'handleItemClick'
                },
                tpl : new Ext.XTemplate(
                    // @formatter:off
                    '<tpl for=".">',
                        '<div class="feed-entry" posting-id="{id}">',
                            '<div class="posting">',
                                '<div class="postBody">',
                                    '<div class="heading">',
                                        '<div class="header-photo-wrap">',
                                            '<div class="header-photo" style="background-image: url({authorPhotoUrl});"></div>',
                                        '</div>',
                                        '<div class="header-center">',
                                            '<p class="datestamp">{creationDateOrDiff}',
                                                '<tpl if="lastEditDate"><span class="edited"> ' + i18n.gettext('Edited') + '</span></tpl>',
                                                '<tpl if="editable"><i data-qtip="' + i18n.gettext('Edit') + '" class="ion ion-android-create posting-edit-trigger"></i></tpl>',
                                            '</p>',
                                            '<p class="employee-name {[values.authorInactive ? "author-inactive" : ""]}"><span>{authorName}</span>',
                                                '<tpl if="authorInactive">',
                                                    '<sup class="inactive">' + i18n.gettext('Inactive') + '</sup>',
                                                '</tpl>',
                                            '</p>',
                                        '</div>',
                                        '<div class="header-community" <tpl if="communityImageUrl">style="background-image: url({communityImageUrl});"</tpl>>',
                                            '{community.name}',
                                        '</div>',
                                    '</div>',
                                    '<div class="content <tpl if="badgeId">with-badge</tpl>">',
                                        '<div class="content-message">{[criterion.Utils.removeClassNames(values.message, this.owner.classesBlackList)]}</div>',
                                        '<tpl if="badgeId">',
                                            '<div class="content-badge">',
                                                '<img src="{badgeImageUrl}" alt=""/>',
                                                '<span title="{badgeRecipientName}">{badgeRecipientName}</span>',
                                            '</div>',
                                        '</tpl>',
                                    '</div>',
                                    '<div class="posting-edit-box"></div>',
                                    '<div class="attachments-list">',
                                    '<tpl for="attachments">',
                                        '<div class="attachment" url={downloadUrl}><i class="ion ion-paperclip"></i>{fileName}</div>',
                                    '</tpl>',
                                    '</div>',
                                    '<div class="footer">',
                                        '<span class="footer-likes x-unselectable {[values.hasMyLike ? "has-my-like" : ""]}"><i class="ion ion-thumbsup likes"></i>{[this.getLikes(values.likesCount)]}</span>',
                                        '<span class="footer-replies x-unselectable {[values.hasMyReply ? "has-my-reply" : ""]} {[values.repliesCount ? "has-replies" : ""]}"><i class="ion ion-forward repliess"></i>{[this.getReplies(values.repliesCount)]}</span>',
                                            '<span class="footer-comments {[values.repliesCount ? "" : "hidden"]}">',
                                                '<i class="ion ion-arrow-up-b"></i>',
                                                '<i class="ion ion-arrow-down-b hidden"></i>',
                                            '</span>',
                                    '</div>',
                                '</div>',
                                '<div class="replies">',
                                    '<tpl for="reactions">',
                                        '<tpl if="!isLiked">',
                                            '<div class="reply reply-{id}">',
                                                '<div class="reply-photo-wrap">',
                                                    '<div class="reply-photo" style="background-image: url({authorPhotoUrl});"></div>',
                                                '</div>',
                                                '<div class="reply-content">',
                                                    '<div class="reply-date">{creationDate:date("m/d/Y - h:i a")}',
                                                        '<tpl if="editable">',
                                                            '<span class="reply-edit-trigger" replyId="{id}"><i data-qtip="' + i18n.gettext('Edit Reply') + '" class="ion ion-android-create"></i>&nbsp;</span>',
                                                        '</tpl>',
                                                    '</div>',
                                                    '<p class="reply-name {[values.authorInactive ? "author-inactive" : ""]}" replyId="{id}"><span>{authorName}</span>',
                                                        '<tpl if="authorInactive">',
                                                            '<sup class="inactive">' + i18n.gettext('Inactive') + '</sup>',
                                                        '</tpl>',
                                                    '</p>',
                                                    '<div class="reply-edit-box-internal"></div>',
                                                '</div>',
                                                '<div class="reply-message">{message}</div>',
                                            '</div>',
                                        '</tpl>',
                                    '</tpl>',
                                '</div>',
                                '<div class="reply-edit-box"></div>',
                                '<tpl if="replyable">',
                                    '<div class="write-a-reply {[values.repliesCount ? "" : "hidden"]}">',
                                        '<div class="write-a-reply-photo-wrap">',
                                            '<div class="write-a-reply-photo" style="background-image: url(' + criterion.Utils.makePersonPhotoUrl(criterion.Api.getCurrentPersonId(), criterion.Consts.USER_PHOTO_SIZE.COMMUNITY_ICON_WIDTH, criterion.Consts.USER_PHOTO_SIZE.COMMUNITY_ICON_HEIGHT) + ');">',
                                            '</div>',
                                        '</div>',
                                        '<div class="write-a-reply-btn">' +
                                            i18n.gettext('Write a reply'),
                                        '</div>',
                                    '</div>',
                                '</tpl>',
                            '</div>',
                        '</div>',
                    '</tpl>',
                    // @formatter:on
                    {
                        getLikes : function(count) {
                            return count ? Ext.util.Format.format(i18n.ngettext('{0} Like', '{0} Likes', count), count) : i18n.gettext('No Likes');
                        },
                        getReplies : function(count) {
                            return count ? Ext.util.Format.format(i18n.ngettext('{0} Reply', '{0} Replies', count), count) : i18n.gettext('No Replies');
                        }
                    }
                ),
                itemSelector : criterion.Consts.ESS_COMMUNITY_POST_ITEM_SELECTOR,
                emptyText : '<div class="emptyFeed"><img src="resources/images/empty-feed.svg" alt="Your feed is empty"><p class="emptyText">' + i18n.gettext('Your feed is empty') + '</p></div>'
            },
            {
                xtype : 'container',
                hidden : true,
                bind : {
                    hidden : '{!hasPostings}'
                },
                items : [
                    {
                        xtype : 'button',
                        cls : 'load-more-button',
                        text : i18n.gettext('Load more posts...'),
                        handler : 'onLoadMore'
                    }
                ]
            }
        );

    },

    items : []
});
