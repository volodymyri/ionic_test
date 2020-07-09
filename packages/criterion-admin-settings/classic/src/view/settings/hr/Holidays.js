Ext.define('criterion.view.settings.hr.Holidays', function() {

    return {
        alias : 'widget.criterion_settings_holidays',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.view.settings.hr.Holiday',
            'criterion.store.employer.Holidays',
            'criterion.store.employer.IncomeLists',
            'criterion.controller.settings.hr.Holidays'
        ],

        title : i18n.gettext('Holidays'),

        layout : 'fit',

        controller : {
            type : 'criterion_settings_holidays',
            showTitleInConnectedViewMode : true,
            loadRecordOnEdit : true,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            
            connectParentView : {
                parentForSpecified : true
            },
            editor : {
                xtype : 'criterion_settings_holiday',
                allowDelete : true
            }
        },

        selModel : {
            selType : 'checkboxmodel',
            listeners : {
                scope : 'controller',
                selectionchange : 'handleSelectionChange'
            }
        },

        viewModel : {
            data : {
                selectionCount : 0
            },
            stores : {
                employerHolidays : {
                    type : 'criterion_employer_holidays'
                },
                incomes : {
                    type : 'employer_income_lists'
                }
            }
        },

        bind : {
            store : '{employerHolidays}'
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
                text : i18n.gettext('Year'),
                dataIndex : 'year',
                width : 200
            },
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
                flex : 2
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Holiday Count'),
                dataIndex : 'holidayCount',
                width : 200
            }
        ]
    };

});
