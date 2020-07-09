Ext.define('criterion.view.employee.AssignmentHistory', function() {

    var assignmentGroupId = 0;

    return {

        alias : 'widget.criterion_person_assignment_history',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.assignment.History',
            'criterion.controller.employee.AssignmentHistory'
        ],

        viewModel : {
            data : {
                hideTypeColumn : true,
                allowEdit : true
            },

            stores : {
                assignments : {
                    type : 'criterion_assignment_history',
                    grouper : {
                        property : 'isPrimary',
                        direction : 'DESC'
                    },
                    sorters : [
                        {
                            sorterFn : function(record1, record2) {
                                var id1 = record1.get('id'),
                                    id2 = record2.get('id'),
                                    effectiveDate1 = record1.get('effectiveDate'),
                                    effectiveDate2 = record2.get('effectiveDate');

                                // using .getTime() to compare two date objects. See https://stackoverflow.com/questions/492994/compare-two-dates-with-javascript
                                return effectiveDate1 > effectiveDate2 ? 1 : (effectiveDate1.getTime() === effectiveDate2.getTime()) ? (id1 > id2 ? 1 : -1) : -1;
                            },
                            direction : 'DESC'
                        },
                        {
                            property : 'assignmentId',
                            direction : 'DESC'
                        }
                    ],
                    listeners : {
                        scope : 'controller',
                        load : 'onLoad'
                    }
                }
            }
        },

        listeners : {
            scope : 'controller',
            editAssignmentAction : 'handleEditAssignmentAction'
        },

        cls : 'criterion-employee-assignment-history',

        bind : {
            store : '{assignments}'
        },

        controller : {
            type : 'criterion_employee_assignment_history'
        },

        sortableColumns : false,

        disableGrouping : true,

        tbar : null,

        viewConfig : {
            getRowClass : function(record, rowIndex, rowParams, store) {
                var previousRecord = store.getAt(rowIndex - 1),
                    isPrimary = record && record.get('isPrimary'),
                    currentAssignmentId = record && record.get('assignmentId'),
                    previousAssignmentId = previousRecord ? previousRecord.get('assignmentId') : currentAssignmentId;

                if (!previousRecord) {
                    assignmentGroupId = 0;
                }

                if (!isPrimary && currentAssignmentId !== previousAssignmentId) {
                    assignmentGroupId += 1;
                }

                return 'criterion-assignment-group-' + assignmentGroupId;
            }
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Title'),
                dataIndex : 'assignmentDetailTitle',
                flex : 2
            },
            {
                xtype : 'gridcolumn',
                dataIndex : 'assignmentAction',
                text : i18n.gettext('Action'),
                flex : 1
            },
            {
                xtype : 'criterion_currencycolumn',
                dataIndex : 'payRate',
                text : i18n.gettext('Pay Rate'),
                flex : 1
            },
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('Unit'),
                dataIndex : 'rateUnitCd',
                codeDataId : criterion.consts.Dict.RATE_UNIT,
                flex : 1
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
                text : i18n.gettext('Type'),
                dataIndex : 'isPrimary',
                tdCls : 'criterion-assignment-type-column',
                flex : 1,
                bind : {
                    hidden : '{hideTypeColumn}'
                },
                encodeHtml : false,
                renderer : function(value, metaData, record) {
                    var isPrimary = record && record.get('isPrimary'),
                        badgeClass = isPrimary ? 'primary' : 'secondary',
                        groupTitle = isPrimary ? i18n.gettext('Primary') : Ext.util.Format.format('{0} {1}', i18n.gettext('Secondary'), assignmentGroupId);

                    return Ext.util.Format.format('<span class="criterion-assignment-group-badge {0}">{1}</span>', badgeClass, groupTitle);
                }
            },
            {
                xtype : 'criterion_actioncolumn',
                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                items : [
                    {
                        glyph : criterion.consts.Glyph['edit'],
                        tooltip : i18n.gettext('Edit'),
                        scale : 'small',
                        action : 'editAssignmentAction',
                        permissionAction : function(v, cellValues, record, i, k, e, view) {
                            var vm = view.up().getViewModel();

                            return vm.get('allowEdit') && vm.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_POSITION_HISTORY, criterion.SecurityManager.UPDATE, false, true));
                        }
                    }
                ]
            }
        ]
    }
});
