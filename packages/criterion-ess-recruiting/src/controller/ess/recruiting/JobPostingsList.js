Ext.define('criterion.controller.ess.recruiting.JobPostingsList', function() {

    return {

        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_selfservice_recruiting_job_postings_list',

        load : function() {
            var me = this;

            Ext.promise.Promise.all([
                me.getStore('employerWorkLocations').loadWithPromise(),
                criterion.CodeDataManager.load([criterion.consts.Dict.DEPARTMENT, criterion.consts.Dict.JOB_POSTING_STATUS])
            ]).then({
                scope : this,
                success : function() {
                    me.getStore('jobPostings').load();
                }
            })
        },

        handleChangeStatus : function() {
            this.load();
        },

        handleEditAction : function(record) {
            this.redirectTo(criterion.consts.Route.SELF_SERVICE.RECRUITING_JOB_POSTINGS + '/' + record.getId() + '/detail', null);
        }

    };
});
