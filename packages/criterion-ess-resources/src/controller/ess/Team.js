Ext.define('criterion.controller.ess.Team', function() {
    return {

        extend : 'criterion.controller.OrgChart',

        alias : 'controller.criterion_selfservice_team',

        mainRoute : criterion.consts.Route.SELF_SERVICE.RESOURCES_TEAM,

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        handleActivate : function() {
            if (this.checkViewIsActive()) {
                Ext.route.Router.onStateChange(Ext.History.getToken());
            }
        },

        onBeforeEmployeeChange : function() {
            let vm = this.getViewModel();

            if (!vm) {
                return;
            }

            vm.set({
                employerId : this.getEmployerId()
            });
        },

        onEmployeeChange : function(employee) {
            if (Ext.History.getToken() === this.makeToken('current')) {
                this.loadChart(employee.getId());
            } else {
                this.reloadChart();
            }
        },

        loadChart : function(employeeId) {
            if (Ext.History.getToken() === this.makeToken('current')) {
                employeeId = criterion.Api.getEmployeeId();
            }
            employeeId && this.callParent([employeeId]);
        },

        makeToken : function(employeeId) {
            return this.mainRoute + (employeeId && employeeId !== criterion.Api.getEmployeeId() ? '/' + employeeId : '/current');
        }
    }
});
