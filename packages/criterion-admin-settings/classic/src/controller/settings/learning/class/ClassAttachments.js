Ext.define('criterion.controller.settings.learning.class.ClassAttachments', function() {

    var API = criterion.consts.Api.API;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_settings_learning_class_attachments',

        requires : [
            'criterion.model.employer.course.class.ClassAttachment'
        ],

        handleShow : function() {
            var vm = this.getViewModel(),
                attachments = vm.getStore('attachments');

            attachments.getProxy().setUrl(Ext.String.format(API.EMPLOYER_COURSE_CLASS_ATTACHMENTS, vm.get('classId')));
            attachments.load();
        },

        handleAddClick : function() {
            var me = this,
                vm = me.getViewModel(),
                view = me.getView(),
                attachments = vm.getStore('attachments');
            view.setLoading(true);

            criterion.Api.submitFormWithPromise({
                url : attachments.getProxy().getUrl(),
                form : me.lookup('form').getForm()
            }).then(function(response) {
                var data = Ext.decode(response.responseText, false);
                attachments.add({
                    id : data.result.id,
                    documentTypeCd : vm.get('typeId'),
                    name : vm.get('name')
                });
                vm.set({
                    typeId : null,
                    name : '',
                    attachmentFile : null
                });
            }).otherwise(function() {
                criterion.Utils.toast(i18n.gettext('Add class attachment failed'));
            }).always(function() {
                view.setLoading(false);
            });
        },

        handleAttachmentView : function(record) {
            window.open(criterion.Api.getSecureResourceUrl(Ext.String.format(API.EMPLOYER_COURSE_CLASS_ATTACHMENT_DOWNLOAD, record.getId())));
        },

        handleClose : function() {
            this.getView().close();
        },

        handleRemoveAttachment : function(record) {
            var me = this;

            criterion.Msg.confirmDelete({
                    title : i18n.gettext('Delete attachment'),
                    message : i18n.gettext('Do you want to delete the class attachment?')
                },
                function(btn) {
                    if (btn === 'yes') {
                        var store = me.lookup('attachmentsGrid').getStore();
                        store.remove(record);
                        store.syncWithPromise().otherwise(function() {
                            store.rejectChanges();
                            criterion.Msg.error(i18n.gettext('Delete attachment error'));
                        });
                    }
                }
            );
        }
    };
});
