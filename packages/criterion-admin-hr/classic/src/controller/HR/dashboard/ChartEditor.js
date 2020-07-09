Ext.define('criterion.controller.hr.dashboard.ChartEditor', function() {

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_hr_dashboard_chart_editor',

        handleChangeMetrics : function(field, value) {
            var vm = this.getViewModel(),
                record = field.selection,
                container = this.lookupReference('additionalFields'),
                additionalParams = record ? record.get('additionalParams') : null,
                availableCharts = record ? record.get('availableCharts') : [],
                aCArray = Ext.Array.pluck(availableCharts, 'name'),
                typeFieldGroup = this.lookupReference('typeFieldGroup'),
                form = field.up('form'),
                metricRecord = form.getRecord();

            typeFieldGroup.removeAll();
            container.removeAll();
            if (additionalParams) {
                Ext.Object.each(additionalParams, function(key, value) {
                    var paramField = container.add(Ext.create(value)),
                        metricValue = metricRecord.get(key);

                    metricValue && paramField.setValue(metricValue);
                });
            }

            vm.set('countTypes', availableCharts.length);

            if (availableCharts.length) {
                var selectedChartType = metricRecord.get('chartType');
                if (aCArray.indexOf(selectedChartType) === -1) {
                    selectedChartType = aCArray[0];
                }

                Ext.each(availableCharts, function(availableChart, index) {
                    typeFieldGroup.add(Ext.create('Ext.form.field.Radio', {
                        boxLabel : availableChart.title,
                        name : 'chartType',
                        inputValue : availableChart.name,
                        checked : selectedChartType ? (selectedChartType == availableChart) : !index
                    }));
                });

                typeFieldGroup.setValue({
                    chartType : selectedChartType
                });
            }

            record ? form.getRecord().set('metric', record.data, {
                silent : true
            }) : null;
        }

    };

});
