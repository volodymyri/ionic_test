Ext.define('criterion.controller.hr.dashboard.ValueEditor', function() {

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_hr_dashboard_value_editor',

        handleChangeMetrics : function(field, value) {
            var record = field.selection,
                container = this.lookupReference('additionalFields'),
                additionalParams = record ? record.get('additionalParams') : null,
                form = field.up('form'),
                metricRecord = form.getRecord();

            container.removeAll();
            if (additionalParams) {
                Ext.Object.each(additionalParams, function(key, value) {
                    var paramField = container.add(Ext.create(value)),
                        metricValue = metricRecord.get(key);

                    metricValue && paramField.setValue(metricValue);
                });
            }

            record ? form.getRecord().set('metric', record.data, {
                silent : true
            }) : null;
        }

    };

});
