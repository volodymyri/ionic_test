Ext.define('ess.controller.Communities', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_communities',

        requires : [
            'criterion.model.community.posting.Reaction'
        ],

        onActivate : function() {
            var vm = this.getViewModel(),
                communities = vm.get('communities');

            this.slideToStream();

            communities.loadWithPromise({
                params : {
                    employeeId : this.getEmployeeId(),
                    isActive : true
                }
            }).then({
                scope : this,
                success : function() {
                    if (!communities.count()) {
                        vm.set('blockAddPost', true);
                    }
                }
            });

            this.loadStream();
        },

        getEmployeeId : function() {
            return this.getViewModel().get('employeeId');
        },

        loadStream : function() {
            this.lookupReference('stream').getController().load();
        },
        
        editPosting : function(posting) {
            var view = this.getView(),
                editor = this.lookupReference('postingEditor');

            editor.getViewModel().set('posting', posting);
            view.getLayout().setAnimation({
                    type: 'slide',
                    direction: 'left'
                }
            );

            view.setActiveItem(editor);
        },

        showBadgePicker : function(data) {
            var view = this.getView(),
                picker = this.lookupReference('badgePicker'),
                vm = picker.getViewModel();

            vm.set(data);
            vm.getStore('communityUsers').setFilters({
                property : 'employeeId',
                value : data.authorId,
                operator : '!='
            });
            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'left'
                }
            );

            view.setActiveItem(picker);
        },

        onAddBadgeCancel : function() {
            var view = this.getView(),
                postingEditor = this.lookupReference('postingEditor');

            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'right'
                }
            );

            view.setActiveItem(postingEditor);
        },

        onAddBadgeDone : function(data) {
            var view = this.getView(),
                postingEditor = this.lookupReference('postingEditor'),
                vm = postingEditor.getViewModel();

            vm.set('posting.badgeId', data.badgeId);
            vm.set('posting.badgeRecipientId', data.badgeRecipientId);
            vm.set('posting.badgeRecipientName', data.badgeRecipientName);

            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'right'
                }
            );

            view.setActiveItem(postingEditor);
        },

        slideToStream : function() {
            var view = this.getView(),
                stream = this.lookupReference('stream');

            view.getLayout().setAnimation({
                    type: 'slide',
                    direction: 'right'
                }
            );

            view.setActiveItem(stream);
        },

        cancelEdit : function() {
            this.slideToStream();
        },

        savePosting : function(posting, isNew) {
            this.slideToStream();

            if (isNew) {
                this.loadStream();
            }
        },

        addReplyToPosting : function(record, item) {
            this.editReply(record, item, Ext.create('criterion.model.community.posting.Reaction', {
                communityPostingId : record.getId()
            }));
        },

        editReplyPosting : function(record, item, replyId) {
            var replyRecord = record.reactions().getById(replyId);

            this.editReply(record, item, replyRecord);
        },

        editReply : function(postingRecord, item, replyRecord) {
            var view = this.getView(),
                editor = this.lookupReference('replyEditor');

            editor.getViewModel().set({
                posting : postingRecord,
                reply : replyRecord
            });
            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'left'
                }
            );

            view.setActiveItem(editor);
        },

        cancelEditReply : function() {
            this.slideToStream();
        },

        saveReply : function() {
            this.slideToStream();
            this.loadStream();
        },

        showProfile : function(pEmployeeId) {
            var view = this.getView(),
                employeeId = this.getViewModel().get('employeeId'),
                profileView = this.lookupReference('profileView'),
                pEmployeeId = parseInt(pEmployeeId, 10);

            profileView.getViewModel().set({
                title : i18n.gettext('Loading...'),
                employeeId : pEmployeeId,
                ownProfile : employeeId === pEmployeeId
            });
            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'left'
                }
            );

            view.setActiveItem(profileView);
        },

        cancelViewProfile : function() {
            this.slideToStream();
        }
    };
});
