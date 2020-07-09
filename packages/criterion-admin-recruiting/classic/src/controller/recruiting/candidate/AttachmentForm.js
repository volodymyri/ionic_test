Ext.define('criterion.controller.recruiting.candidate.AttachmentForm', function() {

    let fileSelected;

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_recruiting_candidate_attachment_form',

        handleFileChange : function(field, newValue, oldValue, file) {
            fileSelected = file;
        },

        handleAttach : function() {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                candidate = vm.get('candidate'),
                attachment = this.lookupReference('attachment'),
                documentTypeCd = this.lookupReference('documentTypeCd'),
                description = this.lookupReference('description'),
                candidateId = candidate.getId();

            if (fileSelected && me.getView().isValid()) {
                view.setLoading(true);

                attachment.inputEl.setStyle('background-color', '#eee');

                criterion.Api.submitFakeForm([documentTypeCd, description], {
                    url : criterion.consts.Api.API.CANDIDATE_ATTACHMENT_UPLOAD,
                    scope : this,
                    extraData : {
                        attachment : fileSelected,
                        candidateId : candidateId
                    },
                    success : Ext.Function.bind(function() {
                        let documentTypeCdValue = documentTypeCd.getSubmitValue(),
                            documentTypeCode = criterion.CodeDataManager.getCodeDetailRecord('id', documentTypeCdValue, criterion.consts.Dict.DOCUMENT_RECORD_TYPE).get('code');

                        if (documentTypeCode === criterion.Consts.DOCUMENT_RECORD_TYPE_CODE.CANDIDATE_RESUME) {
                            candidate.load();
                        }

                        me.onAfterSave.call(me, view, candidate);

                        view.setLoading(false);
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
            let attachment = owner && owner.lookupReference('attachment');

            if (event.lengthComputable && attachment && attachment.inputEl) {
                attachment.inputEl.setWidth(parseInt(event.loaded / event.total * initialWidth, 10), true);
            }
        },

        handleCancelClick() {
            fileSelected = null;

            this.callParent(arguments);
        }
    }
});
