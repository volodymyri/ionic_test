Ext.define('ess.controller.time.timesheet.mixin.BaseActions', {

    mixinId : 'criterion_timesheet_mixin_base_actions',

    requires : [
        'criterion.view.employee.SubmitConfirm'
    ],

    handleNotes : function() {
        let vm = this.getViewModel(),
            timesheetRecord = vm.get('timesheetRecord'),
            buttons = [
                {
                    text : i18n.gettext('Cancel'),
                    itemId : 'no',
                    cls : 'cancel-btn'
                }
            ];

        if (vm.get('isEditable')) {
            buttons.push({
                text : i18n.gettext('Save'),
                itemId : 'yes'
            });
        }

        Ext.create('Ext.MessageBox', {
            listeners : {
                show : function(msgBox) {
                    let textareafield = msgBox.down('textareafield');

                    textareafield.setValue(timesheetRecord.get('notes'));
                    textareafield.focus();
                }
            }
        }).show({
            ui : 'rounded',
            title : i18n.gettext('Notes'),
            message : '',
            buttons : buttons,
            prompt : {
                xtype : 'textareafield',
                placeholder : i18n.gettext('Add Your Note'),
                height : 200,
                editable : vm.get('isEditable')
            },
            scope : this,
            fn : function(btn, notes) {

                if (btn === 'yes') {
                    criterion.Api.requestWithPromise({
                        url : Ext.util.Format.format(criterion.consts.Api.API.EMPLOYEE_TIMESHEET_SAVE_NOTE, timesheetRecord.getId()),
                        method : 'PUT',
                        jsonData : {
                            notes : Ext.isEmpty(notes) ? "" : notes
                        }
                    }).then(function() {
                        timesheetRecord.set('notes', notes);
                        criterion.Utils.toast(i18n.gettext('Notes successfully saved'));
                    });
                }
            }
        });
    },

    handleSubmitTimesheet : function() {
        let vm = this.getViewModel(),
            timesheetRecord = this.getTimesheetRecord(),
            employeeId = timesheetRecord.get('employeeId'),
            submitConfirm = Ext.create('criterion.view.employee.SubmitConfirm'),
            workflowData = vm.get(this.getWorkflowVmIdent(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.TIMESHEET)),
            confirmText = workflowData ? workflowData['confirmText'] : '',
            isSignature = workflowData ? workflowData['isSignature'] : false;

        submitConfirm.show({
            ui : 'rounded',
            title : i18n.gettext('Submit timesheet'),
            message : confirmText ? confirmText : i18n.gettext('Do you wish to submit your timesheet? No further changes can be made after the timesheet is submitted.'),
            buttons : [
                {text : i18n.gettext('Cancel'), itemId : 'no', cls : 'cancel-btn'},
                {
                    text : i18n.gettext('Submit'),
                    itemId : 'yes'
                }
            ],
            width : '90%',
            prompt : isSignature,
            scope : this,
            fn : function(btn, signature) {
                let jsonData;

                if (signature) {
                    jsonData = {
                        signature : signature
                    };
                }

                if (isSignature && !signature) {
                    criterion.Utils.toast(i18n.gettext('Please fill signature field!'));
                    return;
                }

                if (btn === 'yes') {
                    criterion.Api.requestWithPromise({
                        url : criterion.consts.Api.API.EMPLOYEE_TIMESHEET_SUBMIT + '?timesheetId=' + timesheetRecord.getId() + '&employeeId=' + timesheetRecord.get('employeeId'),
                        method : 'PUT',
                        jsonData : jsonData
                    }).then(function() {
                        Ext.GlobalEvents.fireEvent('toggleMainMenu');
                    });
                }
            }
        });
    }


});
