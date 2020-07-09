Ext.define('criterion.view.settings.hr.EmployeeGroups', function() {

    return {
        alias : 'widget.criterion_settings_employee_groups',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.store.EmployeeGroups',
            'criterion.view.settings.hr.EmployeeGroup',
            'criterion.controller.settings.hr.EmployeeGroups'
        ],

        title : i18n.gettext('Employee Groups'),

        layout : 'fit',

        controller : {
            type : 'criterion_settings_employee_groups',
            showTitleInConnectedViewMode : true,
            connectParentView : {
                parentForSpecified : true
            },
            editor : {
                xtype : 'criterion_settings_employee_group',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        store : {
            type : 'criterion_employee_groups'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                flex : 1,
                dataIndex : 'name'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Description'),
                flex : 1,
                dataIndex : 'description'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Employee Count'),
                width : 170,
                dataIndex : 'employeeCount',
                renderer : function(val, cell, rec) {
                    if (rec.get('isInProcess')) {
                        return i18n.gettext('Calculating...');
                    }
                    return val;
                }
            },
            {
                xtype : 'booleancolumn',
                header : i18n.gettext('Dynamic'),
                align : 'center',
                dataIndex : 'isDynamic',
                trueText : '✓',
                falseText : '',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
            }
        ]
    };

})
;
