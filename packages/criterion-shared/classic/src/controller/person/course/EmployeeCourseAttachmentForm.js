Ext.define('criterion.controller.person.course.EmployeeCourseAttachmentForm', function() {

    var API = criterion.consts.Api.API;

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_person_course_attachment_form',

        handleDelete : function() {
            var me = this,
                vm = me.getViewModel(),
                view = me.getView();

            function clearRecordAttachment() {
                criterion.Utils.toast(i18n.gettext('Attachment deleted'));
                vm.get('record').set({
                    attachmentTypeCd : null,
                    attachmentName : '',
                    hasAttachment : false
                });
                me.getView().close();
            }

            if (vm.get('record.hasAttachment')) {
                criterion.Msg.confirmDelete({
                        title : i18n.gettext('Delete attachment'),
                        message : i18n.gettext('Do you want to delete the course attachment?')
                    },
                    function(btn) {
                        if (btn === 'yes') {
                            view.setLoading(true);
                            criterion.Api.requestWithPromise({
                                url : Ext.String.format(API.EMPLOYEE_COURSE_ATTACHMENT, vm.get('record.id')),
                                method : 'DELETE'
                            }).then(function() {
                                clearRecordAttachment();
                            }, function() {
                                criterion.Utils.toast(i18n.gettext('Something went wrong'));
                            }).always(function() {
                                view.setLoading(false);
                            });
                        }
                    }
                );
            } else {
                clearRecordAttachment();
            }

        },

        handleCancel : function() {
            this.getView().close();
        },

        handleDownload : function() {
            var me = this,
                vm = me.getViewModel();
            window.open(criterion.Api.getSecureResourceUrl(API.EMPLOYEE_DOCUMENT_DOWNLOAD + vm.get('record.attachmentDocumentId')));
            me.getView().close();
        },

        handleSubmit : function() {
            this.getView().close();
        }
    };
});
