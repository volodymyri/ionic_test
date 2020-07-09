Ext.define('criterion.view.worker.Compensations', function() {

    return {
        alias : 'widget.criterion_worker_compensations',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.worker.Compensations',
            'criterion.store.employee.compensation.Claims'
        ],

        uses : [
            'criterion.view.worker.compensation.Claim'
        ],

        controller : {
            type : 'criterion_worker_compensations',
            editor : {
                xtype : 'criterion_worker_compensation_claim',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ],
                listeners : {
                    afterSave : function() {
                        criterion.Utils.toast(i18n.gettext('Claim saved.'));
                    }
                }
            }
        },

        store : {
            type : 'criterion_employee_compensation_claims',
            autoSync : false
        },

        title : i18n.gettext('Workers Compensation'),

        tbar : [
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                },
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_WORKERS_COMPENSATION, criterion.SecurityManager.CREATE, true)
                }
            },
            '->',
            {
                xtype : 'button',
                reference : 'refreshButton',
                cls : 'criterion-btn-transparent',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium',
                listeners : {
                    click : 'handleRefreshClick'
                }
            }
        ],

        columns : {
            defaults : {
                width : 150
            },

            items : [
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Claim Number'),
                    dataIndex : 'claimNumber'
                },
                {
                    xtype : 'criterion_codedatacolumn',
                    text : i18n.gettext('Status'),
                    dataIndex : 'wcClaimStatusCd',
                    codeDataId : criterion.consts.Dict.WC_CLAIM_STATUS,
                    unselectedText : i18n.gettext('Not selected'),
                    flex : 1
                },
                {
                    xtype : 'datecolumn',
                    text : i18n.gettext('Date Reported'),
                    dataIndex : 'reportedDate'
                },
                {
                    xtype : 'datecolumn',
                    text : i18n.gettext('Claim Date'),
                    dataIndex : 'claimDate'
                },
                {
                    xtype : 'datecolumn',
                    text : i18n.gettext('Date of Injury'),
                    dataIndex : 'injuryDate'
                },
                {
                    xtype : 'timecolumn',
                    text : i18n.gettext('Time of Injury'),
                    dataIndex : 'injuryTime'
                },
                {
                    xtype : 'datecolumn',
                    text : i18n.gettext('Date Closed'),
                    dataIndex : 'closedDate'
                }
            ]
        }
    };

});
