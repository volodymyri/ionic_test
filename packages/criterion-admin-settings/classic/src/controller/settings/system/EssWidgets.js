Ext.define('criterion.controller.settings.system.EssWidgets', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_ess_widgets',

        employerId : null,

        init : function() {
            var columnOne = this.lookup('columnOne'),
                columnTwo = this.lookup('columnTwo');

            Ext.Array.each(criterion.Consts.ESS_WIDGETS, function(essWidget, idx) {
                var widgetField = {
                    xtype : 'toggleslidefield',
                    fieldLabel : essWidget.title,
                    bind : {
                        value : '{widgets.' + essWidget.enabledValue + '}'
                    }
                };

                if (idx % 2 === 0) {
                    columnOne.add(widgetField);
                } else {
                    columnTwo.add(widgetField);
                }
            });

            this.callParent(arguments);
        },

        onEmployerChange : function(employer) {
            var view = this.getView(),
                vm = this.getViewModel(),
                employerId = employer.getId();

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.EMPLOYER_ESS_WIDGETS,
                method : 'GET',
                params : {
                    employerId : employer.getId()
                }
            }).then(function(data) {
                var record = criterion.model.employer.EssWidgets.loadData(
                    data && data.length ? data[0] : {
                        employerId : employerId
                    }),
                    widgets = record.get('widgets').toString(2).split("").reverse().join("");

                for (var i = 0; i < criterion.Consts.ESS_WIDGETS.length; i++) {
                    vm.set('widgets.' + Math.pow(2, i), widgets.charAt(i) === '1');
                }

                vm.set('record', record);
            }).always(function() {
                view.setLoading(false);
            });
        },

        handleSubmitClick : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                record = vm.get('record'),
                widgets = vm.get('widgets'),
                newValue = 0;

            Ext.Object.each(widgets, function(key, value) {
                if (value) {
                    newValue += parseInt(key, 10);
                }
            });

            record.set('widgets', newValue);

            view.setLoading(true);

            record.saveWithPromise().always(function() {
                view.setLoading(false);
            });
        },

        onBoxReady : function() {
            var employer = criterion.Application.getEmployer();
            if (!this.employerId && employer) {
                this.onEmployerChange(employer);
            }
        }
    };
});
