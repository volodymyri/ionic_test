Ext.define('criterion.controller.recruiting.candidate.UploadResumeForm', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_recruiting_candidate_upload_resume_form',

        handleFileChange : function(field, newValue, oldValue, file) {
            let me = this,
                view = this.getView(),
                vm = view.getViewModel();

            this._fileSelected = file;

            vm.set('isFileSelected', !!file);

            if (newValue) {
                me.handleAttach();
            }
        },

        handleAttach : function() {
            let me = this,
                view = this.getView(),
                fileSelector = this.lookupReference('fileSelector'),
                candidateId = view.getCandidateId();

            if (this._fileSelected && me.getView().getForm().isValid()) {
                view.setLoading(true);

                fileSelector.inputEl.setStyle('background-color', '#eee');

                criterion.Api.submitFakeForm([], {
                    url : criterion.consts.Api.API.CANDIDATE_ATTACHMENT_UPLOAD,
                    scope : this,
                    extraData : {
                        attachment : this._fileSelected,
                        candidateId : candidateId,
                        documentTypeCd : criterion.CodeDataManager.getCodeDetailRecord('code', criterion.Consts.DOCUMENT_RECORD_TYPE_CODE.CANDIDATE_RESUME, criterion.consts.Dict.DOCUMENT_RECORD_TYPE).getId(),
                        description : i18n.gettext('Resume')
                    },
                    success : function() {
                        Ext.callback(view.callback, me);

                        view.setLoading(false);
                        me.handleCancel();
                    },
                    failure : function() {
                        view.setLoading(false);
                    },
                    owner : me,
                    initialWidth : fileSelector.inputEl.getWidth()
                }, me.handleUploadProgress);

                fileSelector.inputEl.setStyle('width', '1px');
            }
        },

        handleUploadProgress : function(event, owner, initialWidth) {
            let fileSelector = owner && owner.lookupReference('fileSelector');

            if (event.lengthComputable && fileSelector && fileSelector.inputEl) {
                fileSelector.inputEl.setWidth(event.loaded / event.total * initialWidth, true);
            }
        },

        handleCancel : function() {
            let view = this.getView();

            fileSelected = null;

            view.fireEvent('cancel');
            view.destroy();
        }
    };
});
