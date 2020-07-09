Ext.define('criterion.controller.employee.timesheet.mixin.NotesHandler', {

    mixinId : 'criterion_employee_timesheet_mixin_notes_handler',

    mixins : [
        'criterion.controller.mixin.ControlMaskZIndex'
    ],

    onShowNotes : function() {
        var me = this,
            vm = this.getViewModel(),
            timesheetRecord = vm.get('timesheetRecord'),
            picker;

        picker = Ext.create('criterion.ux.window.Window', {
            title : i18n.gettext('Notes'),
            resizable : false,
            bodyPadding : 10,
            frame : true,
            modal : true,
            draggable : false,
            plugins : {
                ptype : 'criterion_sidebar',
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,
                height : '50%',
                modal : true
            },
            cls : 'criterion-modal',
            viewModel : {
                data : {
                    notes : vm.get('timesheetRecord.notes'),
                    isEditable : vm.get('isEditable')
                }
            },
            layout : 'fit',
            items : [
                {
                    xtype : 'textarea',
                    reference : 'timesheetRecordNotes',
                    maxLength : 1000,
                    maxLengthText : i18n.gettext('The maximum length for this field is') + ' {0}',
                    bind : {
                        value : '{notes}',
                        disabled : '{!isEditable}'
                    },
                    flex : 1
                }
            ],

            buttons : [
                {
                    xtype : 'button',
                    text : i18n.gettext('Cancel'),
                    ui : 'light',
                    listeners : {
                        click : function() {
                            picker.fireEvent('close');
                        }
                    }
                },
                {
                    xtype : 'button',
                    text : i18n.gettext('Save'),
                    hidden : true,
                    bind : {
                        hidden : '{!isEditable}'
                    },
                    listeners : {
                        click : function() {
                            var timesheetRecordNotes = picker.down('[reference=timesheetRecordNotes]');

                            if (!timesheetRecordNotes.validate()) {
                                return;
                            }

                            picker.fireEvent('changeNotes', picker.getViewModel().get('notes'));
                        }
                    }
                }
            ]
        });

        picker.on('show', function() {
            this.down('[reference=timesheetRecordNotes]').focus();
        });

        picker.show();

        picker.on('changeNotes', function(notes) {
            criterion.Api.requestWithPromise({
                url : Ext.util.Format.format(criterion.consts.Api.API.EMPLOYEE_TIMESHEET_SAVE_NOTE, timesheetRecord.getId()),
                method : 'PUT',
                jsonData : {
                    notes : Ext.isEmpty(notes) ? "" : notes
                }
            }).then(function() {
                timesheetRecord.set('notes', notes);
                me.setCorrectMaskZIndex(false);
                picker.destroy();
            });
        });

        picker.on('close', function() {
            me.setCorrectMaskZIndex(false);
            picker.destroy();
        });

        this.setCorrectMaskZIndex(true);
    }
});
