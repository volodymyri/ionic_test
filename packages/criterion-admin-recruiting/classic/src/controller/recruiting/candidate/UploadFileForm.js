Ext.define('criterion.controller.recruiting.candidate.UploadFileForm', function() {

    var fileSelected;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_recruiting_candidate_upload_file_form',

        handleFileChange : function(field, newValue, oldValue, file) {
            fileSelected = file;
        },

        handleAttach : function() {
            var me = this,
                view = this.getView(),
                attachment = this.lookupReference('attachment'),
                documentTypeCd = view.getDocumentTypeCd(),
                fileDescription = view.getFileDescription();

            if (fileSelected && documentTypeCd && fileDescription && me.getView().getForm().isValid()) {
                view.setLoading(true);

                attachment.inputEl.setStyle('background-color', '#eee');

                criterion.Api.submitFakeForm([], {
                    url : criterion.consts.Api.API.CANDIDATE_ATTACHMENT_UPLOAD,
                    scope : this,
                    extraData : {
                        attachment : fileSelected,
                        candidateId : view.getCandidateId(),
                        documentTypeCd : documentTypeCd,
                        description : fileDescription
                    },
                    success : Ext.Function.bind(function() {
                        if (Ext.isFunction(view.callback)) {
                            view.callback();
                        }

                        view.setLoading(false);
                        me.handleCancel();
                    }),
                    failure : function() {
                        view.setLoading(false);
                    },
                    owner : me,
                    initialWidth : attachment.inputEl.getWidth()
                }, me.handleUploadProgress);

                attachment.inputEl.setStyle('width', '1px');
            }
        },

        handleUploadProgress : function(event, owner, initialWidth) {
            var attachment = owner && owner.lookupReference('attachment');

            if (event.lengthComputable && attachment && attachment.inputEl) {
                attachment.inputEl.setWidth(event.loaded / event.total * initialWidth, true);
            }
        },

        handleCancel : function() {
            fileSelected = null;
            this.getView().destroy();
        }
    };
});
