Ext.define('criterion.controller.employee.EventType', function() {

    var reTogglerField = /(.+)enabled/,
        originalRecord,
        defaultLabels = {
            date1: 'Action Date',
            date2: 'Date 2',
            date3: 'Date 3',
            number1: 'Number 1',
            number2: 'Number 2',
            number3: 'Number 3',
            number4: 'Number 4',
            text1: 'Text 1',
            text2: 'Text 2',
            text3: 'Text 3',
            text4: 'Text 4'
        };

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_employee_event_type',

        listen : {
        },

        onShow : function() {
            var viewModel = this.getViewModel(),
                record = Ext.create('criterion.model.person.EventType');

            record = viewModel.get('record');
            record.set(record.getData());

            Ext.Object.each(record.getData(), function(fieldName, value) {
                if (defaultLabels[fieldName] && value === null || value ==='') {
                    record.set(fieldName, defaultLabels[fieldName])
                }
            });

            viewModel.set('record', record);
            this.getView().down('combo[name=eventCategoryCd]').setDisabled(record.get('eventCategoryCd'));
        },

        onSave : function() {
            var form = this.lookupReference('form'),
                record = this.getViewModel().get('record');

            if (form.isValid()) {
                Ext.Object.each(record.getData(), function(fieldName, value) {
                    var res;

                    if (res = reTogglerField.exec(fieldName)) {
                        if (!value) {
                            record.set(res[1], null)
                        }
                    }
                });

                record.set(record.getData());
                record.save({
                    scope : this,
                    callback : function(savedRecord, operation, success) {
                        if (success) {
                            this.getView().fireEvent('saved', savedRecord);
                        }
                    }
                });
            }
        }
    };
});
