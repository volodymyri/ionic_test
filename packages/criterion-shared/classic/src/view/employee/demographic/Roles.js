Ext.define('criterion.view.employee.demographic.Roles', {
    alias : 'widget.criterion_employee_demographic_roles',

    extend : 'criterion.ux.grid.PanelExtended',

    title : i18n.gettext('Roles'),

    requires : [
        'Ext.grid.column.Number',
        'Ext.grid.column.Date'
    ],

    useDefaultTbar : false,

    initComponent : function() {
        var me = this;

        me.columns = [
            {
                xtype : 'gridcolumn',
                dataIndex : 'string',
                text : i18n.gettext('Assigned Roles'),
                flex : 1
            },
            {
                xtype : 'numbercolumn',
                dataIndex : 'number',
                text : i18n.gettext('Job Codes')
            },
            {
                xtype : 'datecolumn',
                dataIndex : 'date',
                text : i18n.gettext('Date Assigned')
            }
        ];

        me.callParent(arguments);
    }

});