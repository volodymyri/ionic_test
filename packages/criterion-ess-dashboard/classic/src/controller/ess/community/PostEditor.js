Ext.define('criterion.controller.ess.community.PostEditor', function() {

    var maxFileSize = 0,
        bytesInMb = criterion.Consts.ATTACHMENTS_CONFIG.BYTES_IN_MB;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_ess_community_post_editor',

        requires : [
            'criterion.view.ess.community.BadgePicker'
        ],

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        handleEditorShow : function() {
            var htmlEditor = this.lookup('htmlEditor'),
                attachmentFileButton = this.lookup('attachmentFileButton'),
                communitiesCombo = this.lookup('communitiesCombo');

            !maxFileSize && criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.COMMUNITY_POSTING_ATTACHMENT_MAX_FILE_SIZE,
                method : 'GET',
                silent : true
            }).then(function(mFileSize) {
                maxFileSize = mFileSize;
            });

            attachmentFileButton.clearValue();
            htmlEditor.clearInvalid();
            communitiesCombo.clearInvalid();
        },

        handleFocus : function() {
            this.lookup('htmlEditor').focus(false, 200);
        },

        onSave : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                posting = vm.get('posting'),
                postingAttachments = posting.attachments(),
                newAttachments = postingAttachments && postingAttachments.getNewRecords(),
                removedAttachments = postingAttachments && postingAttachments.getRemovedRecords(),
                htmlEditor = this.lookup('htmlEditor'),
                communitiesCombo = this.lookup('communitiesCombo');

            htmlEditor.toggleSourceEdit(false);

            if (!posting.get('message')) {
                htmlEditor.markInvalid();
                return;
            } else {
                htmlEditor.clearInvalid();
            }

            if (!communitiesCombo.isValid()) {
                return;
            }

            posting.set('employeeId', this.getEmployeeId());

            postingAttachments.removeAll();

            posting.saveWithPromise().then({
                scope : this,
                success : function() {
                    var promises = [];

                    Ext.Array.each(newAttachments, function(attachment) {
                        promises.push(criterion.Api.submitFormWithPromise({
                            url : criterion.consts.Api.API.COMMUNITY_POSTING_ATTACHMENT_UPLOAD,
                            fields : [{
                                name : 'document',
                                value : attachment.get('file')
                            }],
                            extraData : {
                                communityPostingId : posting.getId()
                            }
                        }))
                    });

                    Ext.Array.each(removedAttachments, function(attachment) {
                        promises.push(attachment.eraseWithPromise())
                    });

                    Ext.promise.Promise.all(promises)
                        .then(function() {
                            vm.set('posting', Ext.create('criterion.model.community.Posting'));
                            Ext.defer(function() {
                                view.fireEvent('save', view, posting);
                            }, 100);
                        });
                }
            });

        },

        onDelete : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                posting = vm.get('posting');

            criterion.Msg.confirmDelete({
                    title : i18n.gettext('Delete the post'),
                    message : i18n.gettext('Are you sure you want to delete this post?')
                },
                function(btn) {
                    if (btn === 'yes') {
                        posting.eraseWithPromise().then(function() {
                            view.fireEvent('save', view);
                        });
                    }
                }
            );
        },

        onCancel : function() {
            var view = this.getView(),
                posting = this.getViewModel().get('posting');

            posting && posting.reject();
            view.fireEvent('cancel', view);
        },

        onBadgeChange : function() {
            if (!this.lookup('communitiesCombo').isValid()) {
                return;
            }

            var vm = this.getViewModel(),
                picker;

            picker = Ext.create('criterion.view.ess.community.BadgePicker', {
                viewModel : {
                    data : {
                        communityId : vm.get('posting.communityId'),
                        badgeId : vm.get('posting.badgeId'),
                        badgeRecipientId : vm.get('posting.badgeRecipientId'),
                        canRemove : !!vm.get('posting.badgeId'),
                        authorId : this.getEmployeeId()
                    }
                }
            });

            picker.show();

            picker.on('select', function(data) {
                vm.set('posting.badgeId', data.badgeId);
                vm.set('posting.badgeRecipientId', data.badgeRecipientId);
                vm.set('posting.badgeRecipientName', data.badgeRecipientName);
            }, this);
        },

        onAddAttachment : function(event) {
            var files = event.target && event.target.files,
                attachmentFileButton = this.lookup('attachmentFileButton'),
                posting = this.getViewModel().get('posting'),
                postingAttachments = posting.attachments(),
                wrongFiles = [];

            Ext.Array.each(files, function(file) {
                if (file.size <= maxFileSize * bytesInMb) {
                    postingAttachments.add({
                        fileName : file.name,
                        file : file
                    })
                } else {
                    wrongFiles.push(file.name)
                }

                attachmentFileButton.clearValue();

                if (wrongFiles.length) {
                    criterion.consts.Error.showMessage({
                        code : criterion.consts.Error.RESULT_CODES.MAX_FILE_SIZE_EXCEEDED,
                        fields : [
                            maxFileSize * bytesInMb
                        ]
                    });
                }
            });
        },

        onEmployeeChange : Ext.emptyFn

    };

});
