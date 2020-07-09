Ext.define('ess.view.scheduling.Unavailable', function() {

    return {

        alias : 'widget.ess_modern_scheduling_unavailable',

        extend : 'Ext.Panel',

        requires : [
            'criterion.view.scheduling.UnavailableForm',
            'ess.controller.scheduling.Unavailable',
            'criterion.store.employee.UnavailableBlocks'
        ],

        viewModel : {
            stores : {
                unavailable : {
                    type : 'criterion_employee_unavailable_blocks'
                }
            }
        },

        layout : 'card',

        cls : 'ess-modern-scheduling-unavailable',

        _getController() {
            return this.down('criterion_gridview').getController();
        },

        getViewXtype() {
            return this.xtype;
        },

        getFormXtype() {
            return 'criterion_scheduling_unavailable_form';
        },

        addUnavailable() {
            this._getController().handleAddClick();
        },

        constructor(config) {
            let me = this;

            config.items = [
                {
                    xtype : 'container',
                    isWrapper : 1,
                    height : '100%',
                    layout : {
                        type : 'vbox',
                        align : 'stretch'
                    },

                    items : [
                        {
                            xtype : 'criterion_gridview',
                            hidden : true,
                            bind : {
                                store : '{unavailable}',
                                hidden : criterion.SecurityManager.getSecurityESSFormula(criterion.SecurityManager.ESS_KEYS.MY_AVAILABILITY, true)
                            },

                            controller : {
                                type : 'ess_modern_scheduling_unavailable'
                            },

                            mainXtype : me.getViewXtype(),
                            formXtype : me.getFormXtype(),

                            listeners : {
                                doAdd : function(record) {
                                    me._getController().onEdit(record)
                                },
                                doEdit : function(record) {
                                    me._getController().onEdit(record)
                                }
                            },

                            height : '100%',
                            flex : 1,

                            itemConfig : {
                                viewModel : {
                                    formulas : {
                                        recurringCls : data => data('record.recurring') ? 'md-icon md-icon-repeat' : ''
                                    }
                                }
                            },

                            columns : [
                                {
                                    text : '',
                                    width : 16,
                                    minWidth : 16,
                                    resizable : false,
                                    sortable : false,
                                    menuDisabled : true,
                                    cls : 'recurring-cell-header',
                                    cell : {
                                        cls : 'recurring-cell',
                                        width : 16,
                                        bind : {
                                            bodyCls : '{recurringCls}'
                                        }
                                    }
                                },
                                {
                                    xtype : 'datecolumn',
                                    text : 'Start Date',
                                    dataIndex : 'startTimestamp',
                                    format : criterion.consts.Api.DATE_AND_TIME_FORMAT,
                                    width : 180
                                },
                                {
                                    xtype : 'datecolumn',
                                    text : 'End Date',
                                    dataIndex : 'endTimestamp',
                                    format : criterion.consts.Api.DATE_AND_TIME_FORMAT,
                                    width : 180
                                },

                                {
                                    text : 'Name',
                                    dataIndex : 'name',
                                    minWidth : 100,
                                    flex : 1
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype : 'criterion_scheduling_unavailable_form',
                    reference : 'form',
                    height : '100%',

                    listeners : {
                        close : function() {
                            me._getController().onEditFinish()
                        }
                    }
                }
            ];

            me.callParent(arguments);
        }
    };

});
