Ext.define('ess.controller.recruiting.JobPostingsList', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_modern_recruiting_job_postings_list',

        handleBack : function() {
            this.getView().fireEvent('close');
        },

        showDetail : function(record) {
            var parent = this.getView().up(),
                form = parent.down('ess_modern_recruiting_job_posting_detail');

            form.getViewModel().set('record', record);
            parent.getViewModel().set('jobPosting', record);
            parent.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'left'
                }
            );

            parent.setActiveItem(form);
        },

        handleActivate : function() {
            this.loadData();
        },

        handleChangeStatus : function(cmp, value) {
            var vm = this.getViewModel();

            vm.set('statusCd', value);

            if (this.checkViewIsActive()) {
                this.loadData();
            }
        },

        loadData : function() {
            var vm = this.getViewModel();

            vm.getStore('jobPostings').loadWithPromise({
                params : {
                    statusCd : vm.get('statusCd'),
                    hiringManagerId : vm.get('employeeId')
                }
            });
        }

    };
});
