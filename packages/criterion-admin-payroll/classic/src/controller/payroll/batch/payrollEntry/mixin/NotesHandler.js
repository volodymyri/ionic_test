Ext.define('criterion.controller.mixin.payroll.batch.payrollEntry.NotesHandler', function() {

    return {

        extend : 'criterion.controller.mixin.NotesHandler',

        mixinId : 'criterion_payroll_batch_payroll_entry_notes_handler',

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        _getNotesPopupItems() {
            return [
                {
                    xtype : 'textfield',
                    disabled : true,
                    fieldLabel : i18n.gettext('Employee Notes'),
                    hidden : true,
                    bind : {
                        value : '{notes.employee}',
                        hidden : '{!notes.employee}'
                    }
                },
                {
                    xtype : 'textarea',
                    reference : 'notesField',
                    maxLength : 250,
                    maxLengthText : i18n.gettext('The maximum length for this field is') + ' {0}',
                    bind : {
                        value : '{notes.payroll}',
                        disabled : '{!isEditable}'
                    },
                    flex : 1
                }
            ];
        },

        _onClickSaveNotes() {
            let wnd = this.up('criterion_window'),
                notesField = wnd.down('[reference=notesField]');

            if (!notesField.validate()) {
                return;
            }

            wnd.fireEvent('changeNotes', wnd.getViewModel().get('notes.payroll'));
        }
    }

});
