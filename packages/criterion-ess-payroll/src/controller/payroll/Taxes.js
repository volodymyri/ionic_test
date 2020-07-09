Ext.define('criterion.controller.ess.payroll.Taxes', function() {

    return {
        alias : 'controller.criterion_selfservice_payroll_taxes',

        extend : 'criterion.controller.employee.Taxes',

        suppressIdentity : ['employeeContext'],

        isWorkflow : true,

        handleActivate : function() {
            if (this.checkViewIsActive()) {
                this.load();
            }
        },

        /**
         * @protected
         */
        createPicker : function() {
            return Ext.create('criterion.view.TaxPicker', {
                allowTaxNameFilter : false,
                viewModel : {
                    data : {
                        excludedIds : Ext.Array.map(this.getView().getStore().getRange(), function(item) {
                            return item.get('teFilingStatusId');
                        }),
                        employeeId : this.getEmployeeId()
                    }
                },
                bbar : [
                    '->',
                    {
                        xtype : 'button',
                        reference : 'cancelButton',
                        text : i18n.gettext('Cancel'),
                        ui : 'light',
                        handler : 'onCancelHandler'
                    },
                    {
                        xtype : 'button',
                        reference : 'selectButton',
                        bind : {
                            text : '{submitBtnText}'
                        },
                        disabled : true,
                        handler : 'onSelectButtonHandler'
                    }
                ]
            })
        },

        load : function() {
            let employeeId = this.getEmployeeId();

            if (employeeId) {
                this.getView().store.load({
                    params : {
                        employeeId : employeeId,
                        joinWorkflowLog : true
                    }
                });
            }
        }
    };
});
