Ext.define('criterion.controller.ess.community.Stream', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_ess_community_stream',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        listen : {
            global : {
                reloadFeedPostings : 'reloadPostings'
            }
        },

        init : function() {
            var me = this;

            this.getViewModel().bind(
                {
                    bindTo : '{showNewPostEditor}',
                    deep : true
                },
                function(value) {
                    var editor = me.lookup('newPostEditor');

                    if (value) {
                        editor.fireEvent('focus');
                    }
                }
            );
        },

        load : function() {
            var me = this,
                vm = this.getViewModel(),
                communities = vm.getStore('communities'),
                postings = vm.getStore('postings'),
                employeeId = this.getEmployeeId();

            if (!employeeId) {
                return;
            }

            communities.loadWithPromise({
                params : {
                    employeeId : employeeId,
                    isActive : true
                }
            }).then({
                scope : this,
                success : function() {
                    vm.set('hasPostings', false);

                    if (communities.count()) {
                        vm.set('hasCommunity', communities.find('canPost', true) > -1);
                        postings.loadPage(1, {
                            params : {
                                employeeId : employeeId
                            },
                            callback : function() {
                                me.checkPostingsCount();
                            }
                        });
                    } else {
                        vm.set('hasCommunity', false);
                    }

                    communities.isFiltered() && communities.clearFilter();
                    communities.addFilter({
                        property : 'canPost',
                        value : true
                    });

                    me.getView().fireEvent('communityPostCreateStatus', communities.count() === 0);
                }
            });
        },

        handleRoute : Ext.emptyFn,

        onActivate : function() {
            this.load();
        },

        onEmployeeChange : function() {
            var view = this.getView(),
                postings = this.getViewModel().getStore('postings');

            postings.removeAll();

            if (!Ext.isModern) {
                view.removeAll();
                view.addItems();
            }

            this.load();
        },

        onBeforeEmployeeChange : Ext.returnTrue,

        onPostingsLoad : function(postings) {
            this.refreshPostingsReactions(postings)
        },

        handleItemClick : function(cmp, record, item, index, e) {
            var view = cmp.up('criterion_ess_community_stream'),
                viewController = view.getController(),
                target = Ext.Element.get(e.target),
                parent = target.up(),
                replyId,
                replyRecord,
                employeeId = view.getViewModel().get('employeeId'),
                profilePopup,
                communityPopup,
                pEmployeeId,
                repliesCount = record.get('repliesCount');

            if (target.hasCls('footer-likes') || parent.hasCls('footer-likes')) {
                viewController.onLike(record, item);
            }

            if (target.hasCls('footer-replies') || parent.hasCls('footer-replies') || target.hasCls('ion-arrow-up-b') || target.hasCls('ion-arrow-down-b')) {
                if (!repliesCount) {
                    viewController.replyToPosting(record, item);
                } else {
                    var repliesEl = Ext.get(item).down('div.replies'),
                        close = parent.down('i.ion-arrow-up-b'),
                        open = parent.down('i.ion-arrow-down-b');
                    if (!repliesEl.hasCls('hidden') || repliesCount) {
                        close.toggleCls('hidden');
                        open.toggleCls('hidden');
                        repliesEl.toggleCls('hidden');
                        view.updateLayout();
                    }

                }
            }
            if (target.hasCls('attachments')) {
                viewController.toggleAttachments(record, item);
            }
            if (target.hasCls('attachment')) {
                var url = e.getTarget('.attachment').getAttribute('url');

                window.open(criterion.Api.getSecureResourceUrl(url));
            }

            if (target.hasCls('posting-edit-trigger')) {
                viewController.editPosting(record, item);
            }

            if (target.hasCls('reply-edit-trigger') || parent.hasCls('reply-edit-trigger')) {
                replyId = e.target.getAttribute('replyId') || parent.getAttribute('replyId');

                viewController.replyToPosting(record, item.querySelector('.reply-' + replyId), replyId);
            }
            if (parent.hasCls('reply-name')) {
                replyId = parent.getAttribute('replyId');
                replyRecord = record.reactions().getById(replyId);

                if (replyRecord) {
                    pEmployeeId = replyRecord.get('employeeId');

                    profilePopup = Ext.create('criterion.view.ess.ProfilePopup', {
                        employeeId : pEmployeeId,
                        ownProfile : employeeId === pEmployeeId
                    });

                    profilePopup.showPopup();
                }
            }
            if (parent.hasCls('employee-name')) {
                pEmployeeId = record.get('employeeId');

                profilePopup = Ext.create('criterion.view.ess.ProfilePopup', {
                    employeeId : pEmployeeId,
                    ownProfile : employeeId === pEmployeeId
                });

                profilePopup.showPopup();
            }
            if (target.hasCls('header-community')) {
                communityPopup = Ext.create('criterion.view.ess.CommunityPopup', {
                    viewModel : {
                        data : {
                            community : record.getCommunity()
                        }
                    }
                });

                communityPopup.show();
            }

            if (target.hasCls('x-htmleditor-iframe')) {
                var htmleditor = view.up('criterion-ess-community-htmleditor');
                htmleditor && htmleditor.focus();

                return false;
            }

            if (target.hasCls('x-htmleditor-textarea')) {
                target.focus();
                return false;
            }

            if (target.hasCls('write-a-reply-btn')) {
                parent.setStyle('display', 'none');
                view.updateLayout();
                viewController.replyToPosting(record, item, null, parent);
                return false;
            }
        },

        reloadPostings : function() {
            var store = this.getStore('postings');
            //currentPage = store.currentPage; ui_todo: reload all pages + scroll to edited

            store.loadPage(1, {
                params : {
                    employeeId : this.getEmployeeId()
                }
            });
        },

        onPostingSave : function(editor, posting) {
            if (editor) {
                editor.getViewModel().set('posting', Ext.create('criterion.model.community.Posting', {
                    communityId : posting.get('communityId')
                }));
            }

            this.reloadPostings();

            this.getView().fireEvent('postSaved');
        },

        refreshPostingsReactions : function(postings) {
            postings = postings || this.getStore('postings');

            postings.each(this.refreshPostingReactions, this);
            postings.each(function(posting) {
                var community = posting.getCommunity && posting.getCommunity();

                if (community && community.get('canPost')) {
                    posting.set('replyable', true);

                    if (posting.get('employeeId') === this.getEmployeeId()) {
                        posting.set('editable', true);
                    }
                }

                posting.modified = {};
            }, this);
        },

        refreshPostingReactions : function(posting) {
            var likes = 0,
                replies = 0,
                employeeId = this.getEmployeeId(), hasMyLike = false, hasMyReply = false,
                community = posting.getCommunity && posting.getCommunity();

            posting.reactions().each(function(reaction) {
                if (reaction.get('isLiked')) {
                    if (reaction.get('employeeId') === employeeId) {
                        hasMyLike = true;
                    }
                    likes++;
                } else {
                    if (reaction.get('employeeId') === employeeId) {
                        hasMyReply = true;
                        community && community.get('canPost') && reaction.set('editable', true);
                    }
                    replies++;
                }
            }, this);

            posting.set({
                likesCount : likes,
                repliesCount : replies,
                hasMyLike : hasMyLike,
                hasMyReply : hasMyReply
            });
        },

        replyToPosting : function(posting, cmp, replyId, replyBtn) {
            var editor,
                editorParent,
                resizeListener,
                view = this.getView(),
                community = posting.getCommunity && posting.getCommunity();

            if (!community || !community.get('canPost')) {
                return
            }

            var htmlContentEl = replyId && Ext.get(cmp.querySelector('.reply-message')),
                reaction = Ext.create('criterion.model.community.posting.Reaction', {
                    communityPostingId : posting.getId(),
                    employeeId : this.getEmployeeId(),
                    isLiked : false,
                    id : replyId && parseInt(replyId)
                });

            if (!cmp.hasReplyBox) {
                editor = Ext.create('criterion.view.ess.community.ReplyBox', {
                    renderTo : cmp.querySelector(replyId ? '.reply-edit-box-internal' : '.reply-edit-box'),
                    bind : {
                        imageUrl : criterion.Utils.makePersonPhotoUrl(criterion.Api.getCurrentPersonId(), criterion.Consts.USER_PHOTO_SIZE.COMMUNITY_ICON_WIDTH, criterion.Consts.USER_PHOTO_SIZE.COMMUNITY_ICON_HEIGHT)
                    }
                });

                editorParent = editor.el && editor.el.parent();
                resizeListener = editorParent && editorParent.on('resize', function(el, size) {
                    editor.setWidth(size.width);
                }, editorParent, {destroyable : true});

                view.updateLayout();
                htmlContentEl && htmlContentEl.setStyle('display', 'none');
                cmp.hasReplyBox = true;

                Ext.defer(function() {
                    var htmlEditor = !editor.destroyed && editor.down('criterion_ess_community_html_editor');

                    htmlEditor && htmlEditor.setCommunityId(posting.get('communityId'));
                    htmlEditor && htmlEditor.focus();
                }, 500);

                editor.on('destroy', function() {
                    cmp.hasReplyBox = false;
                    htmlContentEl && htmlContentEl.setStyle('display', 'block');
                    replyBtn && replyBtn.setStyle('display', 'inline-flex');
                    resizeListener && Ext.destroy(resizeListener);
                    Ext.defer(function() {
                        view.updateLayout();
                    }, 1);
                });

                editor.on('postReply', function(message) {
                    reaction.set('message', message);
                    htmlContentEl && htmlContentEl.update(message);

                    reaction.saveWithPromise().then({
                        scope : this,
                        success : function() {
                            if (!replyId) {
                                var currentPerson = criterion.Api.getCurrentPerson();

                                reaction.set({
                                    authorName : currentPerson.firstName + ' ' + currentPerson.lastName,
                                    creationDate : new Date(),
                                    personId : currentPerson.id
                                });

                                posting.reactions().add(reaction);
                            } else {
                                var postindReplyRecord = posting.reactions().getById(reaction.getId());
                                postindReplyRecord.set('message', reaction.get('message'));
                            }

                            htmlContentEl && htmlContentEl.setStyle('display', 'block');
                            this.refreshPostingReactions(posting);
                        }
                    })
                }, this);
            } else if (!replyId) {
                var replyEl = cmp.querySelector('.criterion-ess-community-reply-box');

                replyEl && Ext.getCmp(replyEl.id).close();
            }

            if (replyId) {
                reaction.loadWithPromise().then({
                    scope : this,
                    success : function() {
                        editor && editor.down('criterion_ess_community_html_editor').setValue(reaction.get('message'));
                    }
                });
            }
        },

        editPosting : function(posting, cmp) {
            var view = this.getView(),
                vm = this.getViewModel(),
                postings = this.getStore('postings'),
                htmlContentEl = Ext.get(cmp.querySelector('.content')),
                editor;

            if (!cmp.hasPostingEditor) {
                var editBox = cmp.querySelector('.posting-edit-box');

                postings.suspendEvents(true);
                cmp.hasPostingEditor = true;
                htmlContentEl.setStyle('display', 'none');

                editor = Ext.create('criterion.view.ess.community.PostEditor', {
                    margin : '10 0 0 0',
                    renderTo : editBox,
                    viewModel : {
                        data : {
                            communities : vm.get('communities'),
                            posting : posting
                        }
                    }
                });

                editor.mon(Ext.fly(editBox), 'resize', function() {
                    editor.updateLayout();
                });

                view.updateLayout();

                Ext.defer(function() {
                    editor.down('criterion_htmleditor').focus();
                }, 500);

                editor.on('destroy', function() {
                    Ext.defer(function() {
                        view.updateLayout();
                    }, 1);
                });

                editor.on('cancel', function(editor) {
                    editor.destroy();
                    cmp.hasPostingEditor = false;
                    postings.resumeEvents();
                    htmlContentEl.setStyle('display', 'block');
                });

                editor.on('save', function(editor) {
                    editor.destroy();
                    cmp.hasPostingEditor = false;
                    postings.resumeEvents();
                    htmlContentEl.setStyle('display', 'block');
                    this.onPostingSave();
                }, this);
            }
        },

        onLike : function(posting) {
            var me = this,
                employeeId = this.getEmployeeId(),
                myLike = posting.reactions().findBy(function(reaction) {
                    return reaction.get('isLiked') && reaction.get('employeeId') === employeeId
                });

            if (myLike !== -1) {
                myLike = posting.reactions().getAt(myLike);
                criterion.Api.requestWithPromise({
                        url : criterion.consts.Api.API.COMMUNITY_POSTING_REACTION + '/' + myLike.getId(),
                        method : 'DELETE'
                    }
                ).then(function() {
                    posting.reactions().remove(myLike);
                    me.refreshPostingReactions(posting);
                })
            } else {
                myLike = Ext.create('criterion.model.community.posting.Reaction', {
                    communityPostingId : posting.getId(),
                    employeeId : this.getEmployeeId(),
                    isLiked : true
                });
                myLike.saveWithPromise().then(function() {
                    posting.reactions().add(myLike);
                    me.refreshPostingReactions(posting);
                })
            }
        },

        onLoadMore : function() {
            var me = this,
                vm = this.getViewModel();

            vm.set('hasPostings', false);
            this.getStore('postings').nextPage({
                params : {
                    employeeId : this.getEmployeeId()
                },
                callback : function() {
                    me.checkPostingsCount();
                }
            })
        },

        checkPostingsCount : function() {
            var vm = this.getViewModel(),
                postings = this.getStore('postings'),
                totalCount = !postings.isFiltered() ? postings.getTotalCount() : postings.getData().getCount(),
                pageCount = Math.ceil(totalCount / postings.pageSize);

            vm.set('hasPostings', postings.currentPage < pageCount);
        },

        onPostingCancel : function() {
            this.getView().fireEvent('postingCancel');
        },

        handlePostMessage : function() {
            var newPostEditor = this.lookup('newPostEditor'),
                newPostEditorVm = newPostEditor.getViewModel();

            this.getViewModel().set({
                showNewPostEditor : true
            });

            newPostEditor.fireEvent('show');

            if (!newPostEditorVm.get('posting')) {
                newPostEditorVm.set('posting', Ext.create('criterion.model.community.Posting'));
            }
        },

        handlePostingCancel : function() {
            this.getViewModel().set('showNewPostEditor', false);
        },

        handlePostingSave : function() {
            this.getViewModel().set('showNewPostEditor', false);
            Ext.GlobalEvents.fireEvent('reloadFeedPostings');
        },

        handleCommunityPostCreateStatusChange : function() {
            this.getViewModel().set('showNewPostEditor', false);
        }

    };

});
