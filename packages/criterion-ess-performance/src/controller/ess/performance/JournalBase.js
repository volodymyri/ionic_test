Ext.define('criterion.controller.ess.performance.JournalBase', function() {
    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_selfservice_journal_base',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        onBeforeEmployeeChange : Ext.returnTrue,

        onEmployeeChange : function() {
            var me = this,
                vm = me.getViewModel(),
                orgChartAllStructures = vm.get('orgChartAllStructures');

            if (orgChartAllStructures) {
                orgChartAllStructures.loadWithPromise({
                    params : {
                        employeeId : me.getEmployeeId()
                    }
                }).then({
                    success : function() {
                        me.load(orgChartAllStructures.getRange());
                    }
                });
            }
        },

        handleRender : function() {
            var me = this,
                vm = this.getViewModel(),
                orgChartAllStructures = vm.get('orgChartAllStructures');

            orgChartAllStructures.on('datachanged', function() {
                me.load(orgChartAllStructures.getRange());
            });

            if (orgChartAllStructures.isLoaded()) {
                me.load(orgChartAllStructures.getRange());
            } else if (me.getEmployeeId() && orgChartAllStructures.isLoading()) {
                me.onEmployeeChange();
            }
        },

        load : function(data) {
            var vm = this.getViewModel(),
                reportTypeCombo = this.lookup('reportTypeCombo'),
                allStructures = vm.getStore('allStructures');

            this.onSubordinateClear();

            allStructures.loadData(data);
            allStructures.count() && Ext.defer(function() {
                reportTypeCombo.setSelection(allStructures.getAt(0));
            }, 1);
        },

        onReportTypeSelect : function(cmp, selection) {
            this.onSubordinateClear();
        },

        onBeforeSubordinateSelect : function() {
            this.onSubordinateClear();
        },

        onSubordinateSelect : function(cmp, selection) {
            var vm = this.getViewModel();

            vm.set('selectedSubordinate', selection);
        },

        onSubordinateClear : function() {
            var vm = this.getViewModel(),
                subordinatesGrid = this.lookup('subordinatesGrid');

            subordinatesGrid.setSelection();
            vm.set('selectedSubordinate', null);
        }
    }
});