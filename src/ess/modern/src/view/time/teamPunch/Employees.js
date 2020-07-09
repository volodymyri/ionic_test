Ext.define('ess.view.time.teamPunch.Employees', function() {

    function skippedRenderer(value, record, name, cell) {
        cell.addCls('employee-' + (record.get('skipped') ? 'skipped' : 'normal'));

        return value;
    }

    return {

        alias : 'widget.ess_modern_time_team_punch_employees',

        extend : 'Ext.container.Container',

        requires : [
            'Ext.grid.filters.Plugin'
        ],

        viewModel : {},

        cls : 'time-team-punch-employees',

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        items : [
            {
                xtype : 'ess_modern_menubar',
                docked : 'top',
                title : 'Employees',
                buttons : [
                    {
                        xtype : 'button',
                        itemId : 'backButton',
                        cls : 'criterion-menubar-back-btn',
                        iconCls : 'md-icon-arrow-back',
                        align : 'left',
                        handler : 'handleBackToForm'
                    }
                ],
                actions : [
                    {
                        xtype : 'button',
                        iconCls : 'md-icon-send',
                        handler : 'handleExecutePunch'
                    }
                ]
            },

            {
                xtype : 'criterion_gridview',
                reference : 'grid',
                bind : {
                    store : '{teamPunch}'
                },

                plugins : {
                    gridfilters : true
                },

                preventStoreLoad : true,
                height : '100%',
                flex : 1,

                selectable : {
                    columns : true,
                    cells : false,
                    checkbox : true,

                    checkboxDefaults : {
                        xtype : 'criterion_selection_column',
                        text : null,
                        width : 30,
                        skipFn(record) {
                            return record.get('skipped')
                        }
                    }
                },

                listeners : {
                    selectionchange : 'onEmployeeSelectionChange'
                },

                itemConfig : {
                    viewModel : {
                        data : {}
                    }
                },

                columns : [
                    {
                        xtype : 'gridcolumn',
                        flex : 1,
                        minWidth : 120,
                        text : i18n.gettext('Last Name'),
                        dataIndex : 'lastName',
                        renderer : skippedRenderer
                    },
                    {
                        xtype : 'gridcolumn',
                        flex : 1,
                        minWidth : 120,
                        text : i18n.gettext('First Name'),
                        dataIndex : 'firstName',
                        renderer : skippedRenderer
                    },
                    {
                        xtype : 'gridcolumn',
                        width : 200,
                        text : i18n.gettext('Employee Number'),
                        dataIndex : 'employeeNumber',
                        renderer : skippedRenderer
                    }
                ]
            }
        ],

        selectAllEmployees() {
            let grid = this.down('[reference=grid]'),
                store = grid.getStore(),
                selections = [];

            store.each((rec) => {
                if (!rec.get('skipped')) {
                    selections.push(rec);
                }
            });

            grid.getSelectable().select(selections);
        }
    };
});
