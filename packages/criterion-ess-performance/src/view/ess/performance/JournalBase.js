Ext.define('criterion.view.ess.performance.JournalBase', function() {

    return {

        alias : 'widget.criterion_selfservice_journal_base',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.ess.performance.JournalBase'
        ],

        controller : {
            type : 'criterion_selfservice_journal_base'
        },

        listeners : {
            subordinateClear : 'onSubordinateClear',
            render : 'handleRender'
        },

        viewModel : {
            data : {
                selectedSubordinate : null
            },
            stores : {
                allStructures : {
                    type : 'criterion_employee_orgchart_all_structures'
                }
            },
            formulas : {
                title : Ext.emptyFn
            }
        },

        bodyPadding : 0,

        layout : {
            type : 'hbox',
            align : 'stretch'
        },

        createItems : function() {
            return [
                {
                    xtype : 'panel',
                    region : 'west',

                    frame : true,
                    width : 300,

                    padding : 0,
                    bodyPadding : 25,

                    layout : {
                        type : 'vbox',
                        align : 'stretch'
                    },
                    items : [
                        {
                            xtype : 'combo',
                            reference : 'reportTypeCombo',
                            bind : {
                                store : '{allStructures}'
                            },
                            displayField : 'structureName',
                            valueField : 'structureId',
                            queryMode : 'local',
                            forceSelection : true,
                            editable : false,
                            listeners : {
                                select : 'onReportTypeSelect'
                            }
                        },
                        {
                            xtype : 'container',
                            scrollable : 'vertical',
                            flex : 1,

                            items : [
                                {
                                    xtype : 'criterion_gridpanel',

                                    reference : 'subordinatesGrid',

                                    cls : 'criterion-performance-employees-grid',

                                    ui : 'clean',

                                    selModel : {
                                        selType : 'rowmodel',
                                        mode : 'SINGLE'
                                    },

                                    hideHeaders : true,

                                    bind : {
                                        store : '{reportTypeCombo.selection.employeeData.subordinates}'
                                    },
                                    listeners : {
                                        beforeselect : 'onBeforeSubordinateSelect',
                                        select : 'onSubordinateSelect'
                                    },
                                    columns : [
                                        {
                                            xtype : 'gridcolumn',
                                            dataIndex : 'title',
                                            flex : 1
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },

        initComponent : function() {
            this.items = this.createItems();

            this.callParent(arguments);
        }
    };
});