Ext.define('criterion.view.settings.hr.Screenings', function() {

    return {
        alias : 'widget.criterion_settings_screenings',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.store.EmployeeBackground',
            'criterion.controller.settings.hr.Screenings',
            'criterion.ux.toolbar.ToolbarPaging',
            'criterion.store.Forms'
        ],

        title : i18n.gettext('Screening'),

        layout : 'fit',

        controller : {
            type : 'criterion_settings_screenings',
        },

        viewModel : {
            stores : {
                webForms : {
                    type : 'criterion_forms',
                    autoLoad : true,
                    filters : [{
                        property : 'isWebForm',
                        value : true
                    }]
                }
            }
        },

        store : {
            type : 'criterion_employee_background',
            remoteSort : true,
            pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Last Name'),
                dataIndex : 'lastName',
                flex : 2
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('First Name'),
                dataIndex : 'firstName',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Status'),
                dataIndex : 'statusName',
                flex : 1
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Order Date'),
                dataIndex : 'orderDate',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Vendor'),
                dataIndex : 'vendorName',
                flex : 1
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Report Date'),
                dataIndex : 'reportDate',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
            }
        ],

        dockedItems : {
            xtype : 'criterion_toolbar_paging',
            dock : 'bottom',
            displayInfo : true,

            stateId : 'employeeBackgroundGrid',
            stateful : true
        },

        tbar : [
            {
                xtype : 'criterion_settings_employer_bar',
                context : 'criterion_settings'
            },
            '->',
            {
                reference : 'syncButton',
                text : i18n.gettext('Sync'),
                cls : 'criterion-btn-feature',
                handler : 'handleSync'
            },
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
                reference : 'refreshButton',
                cls : 'criterion-btn-transparent',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium',
                listeners : {
                    click : 'handleRefreshClick'
                }
            }
        ]
    };

})
;
