/**
 * Grid to display worker compenstaion's costs.
 */
Ext.define('criterion.view.worker.compensation.claim.Logs', function() {

    return {
        alias : 'widget.criterion_employee_compensation_claim_logs',

        extend : 'criterion.view.worker.compensation.claim.GridView',

        requires : [
            'criterion.store.employee.compensation.claim.Logs',
            'criterion.view.worker.compensation.claim.LogForm'
        ],

        store : {
            type : 'criterion_employee_compensation_claim_logs'
        },

        controller : {
            connectParentView : false,
            editor : {
                xtype : 'criterion_worker_compensation_claim_log_form',
                allowDelete : true
            },
            $configStrict : false,
            getAffectedView : function() {
                return this.getView().up('criterion_worker_compensation_claim');
            }
        },

        title : i18n.gettext('Activity Log'),

        columns : [
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Activity Date'),
                dataIndex : 'activityDate',
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Notes'),
                dataIndex : 'notes',
                flex : 1
            }
        ]
    };

});
