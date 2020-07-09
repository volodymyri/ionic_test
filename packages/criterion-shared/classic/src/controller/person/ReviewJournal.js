Ext.define('criterion.controller.person.ReviewJournal', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'controller.criterion_person_review_journal',

        extend : 'criterion.controller.FormView',

        externalUpdate : false,

        handleAfterSave : function(view, record) {
            var fileSelector = this.lookupReference('fileSelector');

            if (fileSelector.isDirty()) {
                criterion.Api.submitFormWithPromise({
                    url : criterion.consts.Api.API.EMPLOYEE_REVIEW_JOURNAL_UPLOAD,
                    fields : [fileSelector],
                    extraData : {
                        id : record.getId()
                    }
                });
            }
        },

        onViewFile : function() {
            var record = this.getRecord(),
                url = criterion.Api.getSecureResourceUrl(Ext.util.Format.format('{0}/{1}', API.EMPLOYEE_REVIEW_JOURNAL_DOWNLOAD, record.getId()));

            window.open(url, '_blank');
        }


    };

});
