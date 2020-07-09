Ext.define('criterion.controller.employer.AccrueTimeOffPlan', function() {

    return {
        alias : 'controller.criterion_employer_accrue_time_off_plan',

        extend : 'criterion.app.ViewController',

        handleCancelClick : function() {
            this.getView().close();
        },

        handleSubmitClick : function() {
            var me = this,
                form = me.getView(),
                accrualDate = this.lookupReference('accrualDate'),
                selectionRecords = form.formOpt.selectionRecords,
                promises = [];

            if (form.isValid()) {
                form.setLoading(true);
                Ext.Array.each(selectionRecords, function(record) {
                    promises.push(
                        criterion.Api.requestWithPromise({
                            url : Ext.String.format(criterion.consts.Api.API.EMPLOYER_TIME_OFF_PLAN_ACCRUAL, record.getId()),
                            urlParams : {
                                employeeId : criterion.Api.getEmployeeId()
                            },
                            jsonData : Ext.JSON.encode({
                                accrualDate : Ext.Date.format(accrualDate.getValue(), criterion.consts.Api.DATE_FORMAT)
                            }),
                            method : 'POST'
                        })
                    );
                });

                Ext.Deferred.all(promises)
                    .then(function() {
                        form.setLoading(false);
                        form.close();
                    })
                    .otherwise(function() {
                        form.setLoading(false);
                        form.close();
                    });
            }
        }

    };

});
