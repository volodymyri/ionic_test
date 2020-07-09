Ext.define('criterion.controller.employee.TeamView', function() {

    return {

        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_employee_team_view',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        onEmployeeChange : function() {
            this.lookup('orgStructureCombo').reset();
            this.handleShow();
        },

        handleShow : function() {
            var me = this;

            if (!this.getEmployeeId()) {
                return
            }

            me._fillOrgUnits();
        },

        _fillOrgUnits : function() {
            var orgUnitsStore = this.getViewModel().getStore('orgUnits'),
                storeData = [];

            for (var i = 1; i <= 4; i++) {
                var orgStructure = this.identity.employer.get('orgStructure' + i);

                if (orgStructure) {
                    storeData.push({
                        id : i,
                        text : orgStructure
                    });
                }
            }

            orgUnitsStore.loadData(storeData);
            this.lookup('orgStructureCombo').select(1);
        },

        handleSelectUnit : function(combo, newVal) {
            var vm = this.getViewModel(),
                employee = this.identity.employee,
                subordinatesTime = vm.getStore('subordinatesTime');

            if (!employee || !newVal) {
                return
            }

            subordinatesTime.getProxy().setExtraParams({
                employeeId : employee.getId(),
                orgStructure : newVal
            });

            subordinatesTime.load();
        },

        load : function(opts) {
            //
        },

        handleBeforeCellClick : function(grid, td, cellIndex, record, tr, rowIndex, e) {
            var timesheetId = record.get('timesheetId');

            if (!timesheetId) {
                criterion.Msg.error(i18n.gettext('Employee has no current timesheets'));
            } else {
                criterion.consts.Route.setPrevRoute(Ext.History.getToken());
                this.redirectTo(criterion.consts.Route.SELF_SERVICE.TIME_TIMESHEETS + '/' + timesheetId + '-' + record.getId());
            }
            return false;
        },

        handleInClick : function() {
            this._updateTeamStore(true);

        },

        handleOutClick : function() {
            this._updateTeamStore(false);
        },

        _updateTeamStore : function(isIn){
            var view = this.getView(),
                subordinatesTime = this.getViewModel().getStore('subordinatesTime'),
                date = new Date();

            view.setLoading(true);
            subordinatesTime.each(function(rec) {
                var state = rec.get('state');
                if(isIn){
                    if(state == 3){
                        rec.set('in', date);
                        rec.set('state', 2)
                    }else if(state == 2){
                        rec.set('out', date);
                        rec.set('state', 1)
                    }else{// state == 1
                        rec.set('out', date)
                    }
                }else{
                    if(state == 2){
                        rec.set('out', date);
                        rec.set('state', 1);
                    }else if(state == 1){
                        rec.set('out', date);
                        rec.set('state', 1)
                    }
                }
            });

            Ext.defer(function() {
                view.reconfigure(subordinatesTime);
                criterion.Utils.toast(i18n.gettext('Successfully.'));
                view.setLoading(false);
            }, 200)

        }
    };
});
