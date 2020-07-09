Ext.define('criterion.controller.ess.performance.JournalEntry', function() {
    return {

        extend : 'criterion.controller.ess.performance.JournalBase',

        alias : 'controller.criterion_selfservice_journal_entry',

        mainRoute : criterion.consts.Route.SELF_SERVICE.PERFORMANCE_JOURNAL_ENTRY,

        requires : [
            'criterion.model.employee.ReviewJournal'
        ],

        onSubordinateSelect : function(cmp, selection) {
            var entryEditor = this.lookup('entryEditor'),
                entryRecord = Ext.create('criterion.model.employee.ReviewJournal', {
                    employeeId : selection.get('employeeId')
                });

            this.callParent(arguments);

            entryEditor.loadRecord(entryRecord);

            entryEditor.setDisabled(false);
        },

        onSubordinateClear : function() {
            var entryEditor = this.lookup('entryEditor');

            this.callParent(arguments);

            entryEditor.reset(true);
            entryEditor.getViewModel().set('record', null);

            entryEditor.setDisabled(true);
        },

        onSave : function() {
            var entryEditor = this.lookup('entryEditor');

            if (!entryEditor.isValid()) {
                entryEditor.focusOnInvalidField();
                return;
            }

            entryEditor.getController().handleSubmitClick();
        },

        handleAfterSave : function() {
            var view = this.getView();

            criterion.Utils.toast(i18n.gettext('Entry saved.'));

            view.fireEvent('subordinateClear');
        }
    }
});