Ext.define('criterion.controller.recruiting.candidate.Attachments', function() {
    return {
        alias : 'controller.criterion_recruiting_candidate_attachments',

        extend : 'criterion.controller.GridView',

        requires : [
            'criterion.view.recruiting.candidate.AttachmentForm'
        ],

        mixins : [
            'criterion.controller.recruiting.candidate.mixin.ToolbarHandlers'
        ],

        init : function() {
            var vm = this.getViewModel();

            vm.bind({
                bindTo : '{candidate}',
                deep : true
            }, this.refreshGrid, this);

            this.callParent(arguments);
        },

        refreshGrid : function(candidate) {
            if (candidate && this.checkViewIsActive()) {
                this.load();
            }
        },

        handleEditAction : Ext.emptyFn,

        handleDownloadAction : function(record) {
            window.open(criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.CANDIDATE_ATTACHMENT_DOWNLOAD + '/' + record.getId()));
        },

        onEmailSend : function() {
            window.open('mailto:' + this.getViewModel().get('candidate').get('email'));
        },

        remove : function(record) {
            var vm = this.getViewModel(),
                candidate = vm.get('candidate'),
                documentTypeCdValue = record.get('documentTypeCd'),
                documentTypeCode = criterion.CodeDataManager.getCodeDetailRecord('id', documentTypeCdValue, criterion.consts.Dict.DOCUMENT_RECORD_TYPE).get('code');

            this.callParent(arguments);

            this.getView().getStore().sync({
                success : function() {
                    if (documentTypeCode === criterion.Consts.DOCUMENT_RECORD_TYPE_CODE.CANDIDATE_RESUME) {
                        candidate.load();
                    }
                }
            });
        }
    };

});
