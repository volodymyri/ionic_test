Ext.define('criterion.controller.settings.recruiting.QuestionSet', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_recruiting_question_set',

        requires : [
            'criterion.view.settings.recruiting.questionSet.JobPostings'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleSelectJobs : function() {
            let vm = this.getViewModel(),
                jobsW = Ext.create('criterion.view.settings.recruiting.questionSet.JobPostings', {
                    viewModel : {
                        data : {
                            questionSet : vm.get('record')
                        }
                    }
                });

            jobsW.on('selectRecords', this.selectJobPostings, this);
            jobsW.on('destroy', function() {
                this.setCorrectMaskZIndex(false);
            }, this);

            jobsW.show();

            this.setCorrectMaskZIndex(true);
        },

        selectJobPostings : function(records) {
            let vm = this.getViewModel(),
                record = vm.get('record'),
                questionSetId = record.getId(),
                questionSetPostings = record.jobPostings(),
                toRemove = [],
                jobPostingIds = Ext.Array.map(records, rec => rec.getId());

            questionSetPostings.each(questionSetPosting => {
                if (!Ext.Array.contains(jobPostingIds, questionSetPosting.getId())) {
                    toRemove.push(questionSetPosting);
                }
            });

            Ext.Array.each(records, rec => {
                let questionSetPosting = questionSetPostings.getById(rec.getId());

                if (!questionSetPosting) {
                    questionSetPostings.add(rec);
                    rec.set('questionSetId', questionSetId);
                }
            });

            if (toRemove.length) {
                questionSetPostings.remove(toRemove)
            }
        }

    }
});
