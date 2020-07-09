Ext.define('criterion.view.settings.benefits.Benefits', function() {

    return {
        alias : 'widget.criterion_settings_benefits',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.controller.settings.Benefits',
            'criterion.store.employer.BenefitPlans',
            'criterion.store.Forms',
            'criterion.view.settings.benefits.benefit.PlanForm'
        ],

        title : i18n.gettext('Benefits'),

        viewModel : {
            data : {
                selectionCount : 0
            },

            stores : {
                benefitPlans : {
                    type : 'employer_benefit_plans',
                    sorters : [
                        {
                            property : 'code',
                            direction : 'ASC'
                        }
                    ]
                },
                webForms : {
                    type : 'criterion_forms',
                    filters : [
                        {
                            property : 'isWebForm',
                            value : true
                        }
                    ]
                }
            }
        },

        controller : {
            type : 'criterion_settings_benefits',
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_benefit_plan_form',
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        bind : {
            store : '{benefitPlans}'
        },

        selModel : {
            selType : 'checkboxmodel',
            listeners : {
                scope : 'controller',
                selectionchange : 'handleSelectionChange'
            }
        },

        tbar : [
            {
                xtype : 'criterion_settings_employer_bar',
                reference : 'employerSelector',
                context : 'criterion_settings'
            },
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Clone'),
                cls : 'criterion-btn-feature',
                hidden : true,
                bind : {
                    hidden : '{!selectionCount}'
                },
                handler : 'handleClone'
            },
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                handler : 'handleAddClick'
            },
            {
                xtype : 'button',
                reference : 'refreshButton',
                cls : 'criterion-btn-transparent',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium',
                handler : 'handleRefreshClick'
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Code'),
                dataIndex : 'code',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                dataIndex : 'name',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Carrier Name'),
                dataIndex : 'carrierName',
                flex : 1
            }
        ]
    };

});
