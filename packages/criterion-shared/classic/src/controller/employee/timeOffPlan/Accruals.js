Ext.define('criterion.controller.employee.timeOffPlan.Accruals', function() {

    return {

        extend : 'criterion.controller.employee.GridView',

        alias : 'controller.criterion_employee_timeoffplan_accruals',

        requires : [
            'criterion.store.employee.TimeOffPlans',
            'criterion.store.employer.TimeOffPlans',
            'criterion.model.employee.TimeOffPlan',
            'criterion.view.employee.AddTimeOffPlan'
        ],

        mixins : [
            'criterion.controller.mixin.identity.EmployeeContext',
            'criterion.controller.mixin.identity.EmployeeGlobal',
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        listen : {
            controller : {
                '*' : {
                    planaccrued : 'onPlanAccrued'
                }
            }
        },

        onPlanAccrued : function() {
            this.load();
        },

        load : function(opts = {}) {
            let showInactiveField = this.lookup('showInactive');

            if (showInactiveField && !showInactiveField.getValue()) {
                Ext.merge(opts, {
                    params : {
                        isActiveOnly : true
                    }
                });
            }

            return this.callParent([opts]);
        },

        add : function() {
            var me = this,
                wnd;

            wnd = Ext.create('criterion.view.employee.AddTimeOffPlan', {
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        height : 400
                    }
                ],
                viewModel : {
                    data : {
                        employeeId : this.getEmployeeId()
                    }
                }
            });

            wnd.on('plansadded', function() {
                this.load();
            }, this);
            wnd.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });

            wnd.show();

            me.setCorrectMaskZIndex(true);

            this.updateGridToken();
        },

        handleActivate : function() {
            var me = this,
                employerTOStore = this.getViewModel().getStore('timeOffPlans');

            if (this.checkViewIsActive()) {
                if (this.getHandleRoute()) {
                    this.reRoute();
                }
            }

            if (!this.getEmployeeId()) {
                return;
            }

            if (this.checkViewIsActive()) {
                Ext.Promise
                    .all([
                        employerTOStore.loadWithPromise({
                            params : {
                                employerId : this.getEmployerId()
                            }
                        })
                    ])
                    .then(function() {
                        me.load();
                    });
            }
        },

        handleChangeShowInactive : function() {
            this.load();
        }

    };
});
