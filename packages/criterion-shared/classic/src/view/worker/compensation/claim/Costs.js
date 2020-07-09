/**
 * Grid to display worker compenstaion's details.
 */
Ext.define('criterion.view.worker.compensation.claim.Costs', function () {

    return {
        alias : 'widget.criterion_worker_compensation_claim_costs',

        extend : 'criterion.view.worker.compensation.claim.GridView',

        requires : [
            'criterion.store.employee.compensation.claim.Costs',
            'criterion.view.worker.compensation.claim.CostForm'
        ],

        store : {
            type : 'criterion_employee_compensation_claim_costs'
        },

        features : {
            ftype : 'summary',
            dock : 'bottom'
        },

        disableGrouping : true,

        controller : {
            connectParentView : false,
            editor : {
                xtype : 'criterion_worker_compensation_claim_cost_form',
                allowDelete : true
            },
            $configStrict : false,
            getAffectedView : function() {
                return this.getView().up('criterion_worker_compensation_claim');
            }
        },

        title : i18n.gettext('Costs'),

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Description'),
                dataIndex : 'description',
                flex : 1,

                summaryType : 'count',
                summaryRenderer : function() {
                    return i18n.gettext('Total');
                }
            },
            {
                xtype : 'numbercolumn',
                text : i18n.gettext('Cost'),
                dataIndex : 'cost',
                align : 'right',
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH,
                renderer : criterion.LocalizationManager.currencyFormatter,

                summaryType : 'sum',
                summaryRenderer : criterion.LocalizationManager.currencyFormatter
            }
        ]
    };

});
