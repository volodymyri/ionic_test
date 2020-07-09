Ext.define('criterion.controller.ess.time.TeamTimeOffDashboard', function() {

    return {

        extend : 'criterion.controller.ess.time.TimeOffDashboard',

        alias : 'controller.criterion_selfservice_team_time_time_off_dashboard',

        load : Ext.emptyFn,

        setOpacityEditorShow() {
            this.getView().setStyle('opacity', 0);
        },

        setOpacityEditorDestroy() {
            this.getView().setStyle('opacity', 1);
        }
    }
});
