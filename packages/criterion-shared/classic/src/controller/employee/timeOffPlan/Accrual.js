Ext.define('criterion.controller.employee.timeOffPlan.Accrual', function() {

    return {
        alias : 'controller.criterion_employee_timeoffplan_accrual',

        extend : 'criterion.controller.FormView',

        requires : [
            'criterion.view.employee.timeOffPlan.AccruePlan',
            'criterion.view.employee.timeOffPlan.Adjustment',
            'criterion.model.employer.TimeOffPlan'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleAccrue : function() {
            var me = this,
                record = this.getRecord(),
                accrualDate = record.get('accrualDate'),
                startDate = record.get('startDate'),
                minDate = accrualDate > startDate ? accrualDate : startDate,
                accruePlanWindow;

            accruePlanWindow = Ext.create('criterion.view.employee.timeOffPlan.AccruePlan', {
                viewModel : {
                    data : {
                        employeeTimeOffPlanId : record.getId(),
                        timeOffPlan : record,
                        minDate : minDate
                    }
                }
            });

            accruePlanWindow.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });

            accruePlanWindow.show();

            me.setCorrectMaskZIndex(true);
        },

        handleRecordLoad : function(record) {
            if (record.phantom) {
                return;
            }

            var er = Ext.create('criterion.model.employer.TimeOffPlan', {id : record.get('timeOffPlanId')}),
                vm = this.getViewModel();

            er.loadWithPromise().then(function() {
                vm.set('isPlanActive', record.get('isActive') && er.get('isActive'));
            });

            criterion.Api.request({
                url : criterion.consts.Api.API.REPORT_CHECK_ACCESS,
                method : 'GET',
                silent : true,
                params : {
                    name : 'accrual_log'
                },
                scope : this,
                success : function() {
                    vm.set('isShowDownloadAccrualLogButton', true);
                }
            });
        },

        handleAdjustment : function() {
            var me = this,
                vm = this.getViewModel(),
                record = this.getRecord(),
                adjustmentWindow;

            adjustmentWindow = Ext.create('criterion.view.employee.timeOffPlan.Adjustment', {
                viewModel : {
                    data : {
                        employeeTimeOffPlanId : record.getId(),
                        unit : vm.get('unit'),
                        timeOffPlan : record
                    }
                }
            });

            adjustmentWindow.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });

            adjustmentWindow.show();

            me.setCorrectMaskZIndex(true);
        },

        handleDownloadAccrualLog : function() {
            var record = this.getRecord(),
                options = Ext.JSON.encode({
                    filters : [],
                    hiddenColumns : [],
                    orderBy : [
                        {
                            key : 'order_1',
                            fieldName : 'p.first_name',
                            displayName : 'First Name'
                        },
                        {
                            key : 'order_2',
                            fieldName : 'p.last_name',
                            displayName : 'Last Name'
                        }
                    ],
                    groupBy : [],
                    parameters : [
                        {
                            name : 'employeeTimeOffPlanId',
                            mandatory : true,
                            valueType : 'integer',
                            value : record.get('employeeTimeOffPlanId')
                        }
                    ]
                });

            window.open(criterion.Api.getSecureResourceUrl(
                Ext.util.Format.format(criterion.consts.Api.API.REPORT_DOWNLOAD_BY_NAME, 'accrual_log', encodeURI(options))
            ));
        }

    };

});
