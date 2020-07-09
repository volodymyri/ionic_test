Ext.define('criterion.controller.ess.performance.TeamJournals', function() {
    return {

        extend : 'criterion.controller.ess.performance.JournalBase',

        alias : 'controller.criterion_selfservice_team_journals',

        mainRoute : criterion.consts.Route.SELF_SERVICE.PERFORMANCE_TEAM_JOURNALS,

        onSubordinateSelect : function(cmp, selection) {
            var vm = this.getViewModel(),
                employeeEntries = vm.getStore('employeeEntries');

            this.callParent(arguments);

            employeeEntries.load({
                params : {
                    employeeId : selection.get('employeeId')
                }
            });
        },

        onSubordinateClear : function() {
            var vm = this.getViewModel(),
                employeeEntries = vm.getStore('employeeEntries');

            employeeEntries.loadData([]);
            this.onClose();

            this.callParent(arguments);
        },

        onEntrySelect : function(grid, selection) {
            var vm = this.getViewModel(),
                entryEditor = this.lookup('entryEditor');

            vm.set('selectedEntry', selection);
            entryEditor.loadRecord(selection);
        },

        onClose : function() {
            var vm = this.getViewModel(),
                entryEditor = this.lookupReference('entryEditor'),
                employeeEntriesGrid = this.lookupReference('employeeEntriesGrid');

            vm.set('selectedEntry', null);
            employeeEntriesGrid.setSelection();

            entryEditor.reset(true);
            entryEditor.getViewModel().set('record', null);
        }
    }
});