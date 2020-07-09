Ext.define('criterion.controller.settings.performanceReviews.reviewPeriod.employee.List', function() {

    return {
        alias : 'controller.criterion_settings_performance_reviews_review_period_employee_list',

        extend : 'criterion.controller.GridView',

        requires : [
            'criterion.view.employee.EmployeePicker',
            'criterion.store.reviewTemplate.period.AvailableEmployees'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        load(opts) {
            let view = this.getView(),
                dfd = Ext.create('Ext.Deferred');

            view.fireEvent('beforeLoadData');

            this.callParent(arguments).then(
                () => {
                    view.fireEvent('afterLoadData');
                    dfd.resolve();
                },
                () => {
                    view.fireEvent('errorLoadData');
                    dfd.reject();
                }
            );

            return dfd.promise;
        },

        handleAddClick() {
            let me = this,
                reviewPeriodId = me.getViewModel().get('reviewPeriodId'),
                picker = Ext.create('criterion.view.employee.EmployeePicker', {
                    storeClass : 'criterion.store.reviewTemplate.period.AvailableEmployees',
                    extraParams : {
                        reviewPeriodId : reviewPeriodId
                    }
                });

            picker.show();
            picker.on('select', function(searchRecord) {
                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.REVIEW_TEMPLATE_PERIOD_EMPLOYEE,
                    method : 'POST',
                    jsonData : {
                        reviewPeriodId : reviewPeriodId,
                        employeeId : searchRecord.get('employeeId')
                    }
                }).then({
                    scope : me,
                    success : function(response) {
                        me.load();
                    },
                    failure : me.load
                });
            }, this);
            picker.on('destroy', function() {
                me.setCorrectMaskZIndex(false);
            });
            me.setCorrectMaskZIndex(true);
        },

        handleAddAll() {
            let me = this;

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.REVIEW_TEMPLATE_PERIOD_EMPLOYEE_ADD_ALL,
                method : 'POST',
                jsonData : {
                    reviewPeriodId : me.getViewModel().get('reviewPeriodId')
                }
            }).then({
                scope : me,
                success : function(response) {
                    me.load();
                },
                failure : me.load
            });
        },

        getEmployeesData() {
            let vm = this.getViewModel(),
                store = vm.getStore('reviewTemplatePeriodEmployees'),
                employeeData = {};

            store.each(rec => {
                let employeeId = rec.get('employeeId');

                if (!employeeData[employeeId]) {
                    employeeData[employeeId] = {
                        id : employeeId,
                        fullName : rec.get('employeeName'),
                        employerId : rec.get('employerId')
                    }
                }
            });

            return Ext.Object.getValues(employeeData);
        }
    }
});
