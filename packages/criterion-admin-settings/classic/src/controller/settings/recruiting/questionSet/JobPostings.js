Ext.define('criterion.controller.settings.recruiting.questionSet.JobPostings', function() {

    return {

        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_settings_recruiting_question_set_job_postings',

        handleJobPostingsLoaded : function() {
            var vm = this.getViewModel(),
                jobPostings = vm.getStore('jobPostings'),
                selectedRecords = [];

            vm.get('questionSet.jobPostings').each(function(jobPosting) {
                selectedRecords.push(jobPostings.getById(jobPosting.getId()));
            });
            selectedRecords = Ext.Array.clean(selectedRecords);
            this.getView().getSelectionModel().select(selectedRecords);
        },

        handleCancel : function() {
            this.getView().close();
        },

        handleUpdate : function() {
            var view = this.getView();

            view.fireEvent('selectRecords', this.getView().getSelection());
            view.close();
        }

    };
});
