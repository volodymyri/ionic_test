Ext.define('criterion.view.settings.payroll.GLAccountMaps', function() {

    return {

        alias : 'widget.criterion_payroll_settings_gl_account_maps',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.store.employer.GLAccountMaps',
            'criterion.store.employer.IncomeLists',
            'criterion.store.employer.Deductions',
            'criterion.store.employer.TimeOffPlans',
            'criterion.store.employer.GLAccounts',
            'criterion.store.employer.WorkLocations',
            'criterion.store.employer.Tasks',
            'criterion.store.employer.Projects',
            'criterion.controller.settings.payroll.GLAccountMaps',
            'criterion.view.settings.payroll.GLAccountMap'
        ],

        controller : {
            type : 'criterion_payroll_settings_gl_account_maps',
            showTitleInConnectedViewMode : true,
            connectParentView : {
                parentForSpecified : true
            },
            loadRecordOnEdit : false,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_payroll_settings_gl_account_map'
            }
        },

        viewModel : {
            stores : {
                employerGLAccountMaps : {
                    type : 'employer_gl_account_maps'
                },
                employerIncomeLists : {
                    type : 'employer_income_lists'
                },
                employerDeductions : {
                    type : 'employer_deductions'
                },
                employerTimeOffPlans : {
                    type : 'criterion_employer_time_off_plans'
                },
                employerGLAccounts : {
                    type : 'employer_gl_accounts',
                    autoSync : false
                },
                employerWorkLocations : {
                    type : 'employer_work_locations'
                },
                employerProjects : {
                    type : 'criterion_employer_projects'
                },
                employerTasks : {
                    type : 'criterion_employer_tasks'
                }
            }
        },

        title : i18n.gettext('GL Account Map'),

        bind : {
            store : '{employerGLAccountMaps}'
        },

        tbar : [
            {
                xtype : 'criterion_settings_employer_bar',
                context : 'criterion_settings'
            },
            '->',
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                }
            },
            {
                xtype : 'button',
                text : i18n.gettext('Validate'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleValidate'
                }
            },
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

        columns : [
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('Type'),
                dataIndex : 'glAccountTypeCd',
                codeDataId : criterion.consts.Dict.GL_ACCOUNT_TYPE,
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                dataIndex : 'glAccountMapName', // calculated value, see controller
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Credit Account'),
                dataIndex : 'creditGlAccountId',
                renderer : 'accountRenderer',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Debit Account'),
                dataIndex : 'debitGlAccountId',
                renderer : 'accountRenderer',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Location'),
                dataIndex : 'employerWorkLocationId',
                renderer : 'locationRenderer',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Task'),
                dataIndex : 'taskId',
                renderer : 'taskRenderer',
                flex : 1
            },
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('Department'),
                dataIndex : 'departmentCd',
                codeDataId : criterion.consts.Dict.DEPARTMENT,
                flex : 1,
                hidden : true,
                unselectedText : ''
            },
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('Cost Center'),
                dataIndex : 'costCenterCd',
                codeDataId : criterion.consts.Dict.COST_CENTER,
                flex : 1,
                hidden : true,
                unselectedText : ''
            }
        ]
    };

});
