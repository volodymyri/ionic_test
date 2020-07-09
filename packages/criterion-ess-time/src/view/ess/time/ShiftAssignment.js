Ext.define('criterion.view.ess.time.ShiftAssignment', function() {

    return {

        alias : 'widget.criterion_selfservice_time_shift_assignment',

        extend : 'criterion.view.WeekFormView',

        requires : [
            'criterion.store.employer.shift.occurrence.EmployeesByDetail'
        ],

        viewModel : {
            formulas : {
                readOnly : function() {
                    return true;
                },
                title : function(get) {
                    return get('record.name');
                },
                hideSave : function() {
                    return true;
                },
                hideDelete : function() {
                    return true;
                },
                positionTitle : function(get) {
                    var positionName = get('record.positionTitle');

                    return positionName ? positionName : i18n.gettext('All positions');
                },
                locationAreaName : function(get) {
                    var locationName = get('record.locationName'),
                        areaName = get('record.areaName');

                    return Ext.util.Format.format('{0}{1}{2}', locationName, locationName && areaName ? ' - ' : '', areaName);
                }
            },
            stores : {
                assignedEmployees : {
                    type : 'criterion_employer_shift_occurrence_employees_by_detail',
                    proxy : {
                        extraParams : {
                            shiftOccurrenceEmployeeDetailId : '{record.id}'
                        }
                    },
                    autoLoad : true
                }
            }
        },

        getFullDayField : function() {
            return {};
        },

        getNameField : function() {
            return {};
        },

        getBaseFields : function() {
            var base = this.callParent(arguments);

            return Ext.Array.merge(
                [
                    {
                        xtype : 'displayfield',
                        fieldLabel : i18n.gettext('Position'),
                        name : 'positionTitle',
                        bind : '{positionTitle}'
                    }
                ],
                base,
                [
                    {
                        xtype : 'displayfield',
                        fieldLabel : i18n.gettext('Location'),
                        name : 'locationAreaName',
                        bind : '{locationAreaName}'
                    },
                    {
                        xtype : 'displayfield',
                        fieldLabel : i18n.gettext('Timezone'),
                        name : 'timezone',
                        bind : '{timezone}'
                    },
                    this.getAssignedEmployeesGrid()
                ]
            );
        },

        getAssignedEmployeesGrid : function() {
            return {
                xtype : 'criterion_gridpanel',
                reference : 'assignedEmployeesGrid',
                border : 1,

                width : '100%',
                height : 200,

                scrollable : true,

                bind : {
                    store : '{assignedEmployees}'
                },

                columns : [
                    {
                        xtype : 'gridcolumn',
                        flex : 1,
                        text : i18n.gettext('Name'),
                        sortable: false,
                        menuDisabled: true,
                        dataIndex : 'employeeName'
                    }
                ]
            }
        }

    }
});
