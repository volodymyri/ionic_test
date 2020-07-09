Ext.define('criterion.view.common.positions.Assignments', function() {

    return {
        alias : 'widget.criterion_positions_assignments',

        extend : 'criterion.view.GridView',

        tbar : null,

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                dataIndex : 'personName',
                flex : 4
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Start Date'),
                dataIndex : 'effectiveDate',
                flex : 1
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('End Date'),
                dataIndex : 'expirationDate',
                flex : 1
            },
            {
                xtype : 'booleancolumn',
                text : i18n.gettext('Primary'),
                dataIndex : 'isPrimary',
                width : 150,
                trueText : '✓',
                falseText : ''
            }
        ]
    };

});
