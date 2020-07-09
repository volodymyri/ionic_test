Ext.define('criterion.view.employee.benefit.TimeOffList', {

    alias : 'widget.criterion_employee_benefit_time_off_list',

    extend : 'criterion.view.GridView',

    requires : [
        'criterion.controller.employee.benefit.TimeOffList',
        'criterion.view.employee.benefit.TimeOffForm',
        'criterion.store.employee.TimeOffs'
    ],

    viewModel : {
        data : {
            showApproved : false
        },
        stores : {
            timeOffs : {
                type : 'criterion_employee_time_offs',
                autoSync : false,
                listeners : {
                    load : 'onTimeOffsLoad'
                },
                sorters : [{
                    property : 'startDate',
                    direction : 'DESC'
                }]
            }
        }
    },

    listeners : {
        scope : 'controller',
        submitaction : 'handleSubmitAction',
        loadAction : 'load',
        addNewAction : 'handleAddClick'
    },

    controller : {
        type : 'criterion_employee_benefit_time_off_list',
        connectParentView : true,
        reloadAfterEditorSave : true,
        reloadAfterEditorDelete : true,
        editor : {
            xtype : 'criterion_employee_benefit_time_off_form',
            plugins : [
                {
                    ptype : 'criterion_sidebar'
                }
            ]
        }
    },

    bind : {
        store : '{timeOffs}'
    },

    tbar : null,

    useWorkflow : false,

    createColumnsConfig : function() {
        var columns = [
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Start Date'),
                dataIndex : 'startDate',
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('End Date'),
                dataIndex : 'endDate',
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
            },
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('Time Off Type'),
                dataIndex : 'timeOffTypeCd',
                codeDataId : criterion.consts.Dict.TIME_OFF_TYPE,
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Total'),
                dataIndex : 'totalMinutes',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                encodeHtml : false,
                renderer : (value, cell, record) => {
                    let totalDays = record.get('totalDays');

                    return totalDays ? totalDays + i18n._('d') : criterion.Utils.hourStrToFormattedStr((value / 60).toString())
                }
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Notes'),
                dataIndex : 'notes',
                flex : 1
            }
        ];

        if (this.useWorkflow) {
            columns.push({
                xtype : 'gridcolumn',
                text : i18n.gettext('Status'),
                dataIndex : 'status',
                flex : 1
            });
        }

        return columns;
    },

    initComponent : function() {
        this.columns = this.createColumnsConfig();

        this.plugins = {
            ptype : 'criterion_subtable',
            association : 'details',
            headerWidth : 24,
            columns : [
                {
                    xtype : 'datecolumn',
                    text : i18n.gettext('Date'),
                    dataIndex : 'timeOffDate',
                    width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                },
                {
                    text : i18n.gettext('Start Time'),
                    dataIndex : 'timeOffDate',
                    renderer : function(val, o, rec) {
                        return rec.get('isFullDay') ? '' : Ext.util.Format.dateRenderer(criterion.consts.Api.TIME_FORMAT_US)(val);
                    },
                    width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                    align : 'center'
                },
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Duration'),
                    flex : 1,
                    renderer : function(value, metaData, record) {
                        var res;

                        if (record.get('isFullDay')) {
                            res = 'All day';
                        } else {
                            res = criterion.Utils.minutesToTimeStr(record.get('duration'));
                        }

                        return res;
                    }
                }
            ]
        };

        this.callParent(this);
    }

});
