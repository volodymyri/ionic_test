Ext.define('ess.view.dashboard.EmployeeBenefitForm', function() {

    return {

        alias : 'widget.ess_modern_dashboard_employee_benefit_form',

        extend : 'criterion.view.ess.dashboard.workflow.EmployeeBenefitBase',

        cls : 'ess-modern-dashboard-employee_benefit-form',

        margin : '0 0 20 0',

        items : [
            {
                xtype : 'container',
                margin : '10 0 0 20',
                hidden : true,
                bind : {
                    hidden : '{!hasChangedOptions}'
                },
                items : [
                    {
                        xtype : 'component',
                        cls : 'bold',
                        html : i18n.gettext('Changed Options'),
                        margin : '0 0 5 0'
                    },
                    {
                        xtype : 'dataview',
                        bind : {
                            store : '{options}'
                        },
                        componentCls : 'criterion-item-container',
                        itemSelector : 'div.item_',
                        emptyText : '',

                        itemTpl : '{text}'
                    }
                ]
            },

            // dependents
            {
                xtype : 'container',
                margin : '10 0 0 20',
                flex : 1,
                hidden : true,
                bind : {
                    hidden : '{!hasChangedDependents}'
                },
                items : [
                    {
                        xtype : 'component',
                        cls : 'bold',
                        html : i18n.gettext('Dependents'),
                        margin : '0 0 5 0'
                    },
                    {
                        xtype : 'dataview',
                        bind : {
                            store : '{dependents}'
                        },
                        componentCls : 'criterion-item-container',
                        itemSelector : 'div.item_',
                        emptyText : '',

                        itemTpl : '{text}'
                    }
                ]
            },

            // beneficiaries
            {
                xtype : 'container',
                margin : '10 0 0 20',
                flex : 1,
                hidden : true,
                bind : {
                    hidden : '{!hasChangedBeneficiaries}'
                },
                items : [
                    {
                        xtype : 'component',
                        cls : 'bold',
                        html : i18n.gettext('Beneficiaries'),
                        margin : '0 0 5 0'
                    },
                    {
                        xtype : 'dataview',
                        bind : {
                            store : '{beneficiaries}'
                        },
                        componentCls : 'criterion-item-container',
                        itemSelector : 'div.item_',
                        emptyText : '',

                        itemTpl : '{text}'
                    }
                ]
            },

            // contingent beneficiaries
            {
                xtype : 'container',
                margin : '10 0 0 20',
                flex : 1,
                hidden : true,
                bind : {
                    hidden : '{!hasChangedContingentBeneficiaries}'
                },
                items : [
                    {
                        xtype : 'component',
                        cls : 'bold',
                        html : i18n.gettext('Contingent Beneficiaries'),
                        margin : '0 0 5 0'
                    },
                    {
                        xtype : 'dataview',
                        bind : {
                            store : '{contingentBeneficiaries}'
                        },
                        componentCls : 'criterion-item-container',
                        itemSelector : 'div.item_',
                        emptyText : '',

                        itemTpl : '{text}'
                    }
                ]
            }
        ],

        setWorkflowLog : function(workflowLog) {
            if (!workflowLog || workflowLog.workflowTypeCode !== criterion.Consts.WORKFLOW_TYPE_CODE.EE_BENEFIT) {
                return;
            }

            this.load(workflowLog['requestData'], workflowLog['actualData']);
        }
    }
});
