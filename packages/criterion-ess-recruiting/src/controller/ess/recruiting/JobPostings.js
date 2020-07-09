Ext.define('criterion.controller.ess.recruiting.JobPostings', function() {

    return {

        extend : 'criterion.controller.ess.Base',

        alias : 'controller.criterion_selfservice_recruiting_job_postings',

        mixins : [
            'criterion.controller.mixin.ReRouting'
        ],

        listen : {
            global : {
                employeeChanged : 'handleEmployeeChanged'
            }
        },

        init : function() {
            this.setReRouting();

            this.callParent(arguments);
        },

        baseURL : criterion.consts.Route.SELF_SERVICE.RECRUITING_JOB_POSTINGS,

        handleEmployeeChanged : function() {
            let me = this;

            if (!this.checkViewIsActive()) {
                return;
            }

            Ext.defer(function() {
                let hiringManager = ess.Application.isEmployeeHiringManager();

                if (!hiringManager) {
                    me.blockSection();
                }
            });
        },

        blockSection : function() {
            this.redirectTo(criterion.consts.Route.SELF_SERVICE.DASHBOARD);
            criterion.Utils.toast(i18n.gettext('You are not allowed to see this section!'));
        },

        handleRoute : function(id, pageId) {
            let me = this;

            if (ess.Application.isEmployeeHiringManager() === false) {
                me.blockSection();
            }

            me.getViewModel().set('jobPostingId', id);
            me.getView().getLayout().setActiveItem(pageId || 0);
        },

        handleRouteSub : function(id, pageId, sid, subPageId) {
            let me = this;

            if (ess.Application.isEmployeeHiringManager() === false) {
                me.blockSection();
            }

            me.getViewModel().set({
                jobPostingId : id,
                jobPostingCandidateId : sid
            });
            me.getView().getLayout().setActiveItem(subPageId || 0);
        },

        handleActivate : function() {
            let active = this.getView().getLayout().getActiveItem();

            if (active && Ext.String.endsWith(Ext.History.getToken(), active.getItemId())) {
                active.fireEvent('activate', active);
            }
        },

        getRoutes : function() {
            let routes = this.callParent(arguments);

            routes[this.baseURL + '/:id/:page'] = 'handleRoute';
            routes[this.baseURL + '/:id/:page/:sid/:subpage'] = 'handleRouteSub';

            return routes;
        }

    };
});
