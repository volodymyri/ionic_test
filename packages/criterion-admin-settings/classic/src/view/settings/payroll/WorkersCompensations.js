Ext.define('criterion.view.settings.payroll.WorkersCompensations', function() {

    return {

        alias : 'widget.criterion_payroll_settings_workers_compensations',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.view.settings.payroll.WorkersCompensation',
            'criterion.store.employer.WorkersCompensations'
        ],

        controller : {
            type : 'criterion_employer_gridview',
            showTitleInConnectedViewMode : true,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_payroll_settings_workers_compensation',
                allowDelete : true
            }
        },

        title : i18n.gettext('Workers Compensation'),

        store : {
            type : 'criterion_employer_worker_compensations'
        },

        controlEmployerBar : true,

        columns : [
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('Code'),
                dataIndex : 'workersCompensationCd',
                codeDataDisplayField : 'code',
                flex : 1,
                codeDataId : criterion.consts.Dict.WORKERS_COMPENSATION
            },
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('Description'),
                dataIndex : 'workersCompensationCd',
                flex : 1,
                codeDataId : criterion.consts.Dict.WORKERS_COMPENSATION
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Rate (per 100)'),
                flex : 1,
                dataIndex : 'rate'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Employee Contribution'),
                flex : 1,
                dataIndex : 'employeeContribution'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Limit (Year)'),
                flex : 1,
                dataIndex : 'limitYear'
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Effective Date'),
                dataIndex : 'effectiveDate',
                flex : 1
            }
        ]
    };

});
