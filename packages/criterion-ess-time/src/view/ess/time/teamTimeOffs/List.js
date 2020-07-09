Ext.define('criterion.view.ess.time.teamTimeOffs.List', function() {

    const date = new Date();

    return {
        alias : 'widget.criterion_selfservice_time_team_time_offs_list',

        extend : 'criterion.ux.grid.Panel',

        requires : [
            'criterion.store.EmployeeGroups',
            'criterion.store.employee.TeamTimeOffs',
            'criterion.store.employee.teamTimeOff.Details',
            'criterion.controller.ess.time.teamTimeOffs.List',
            'criterion.ux.form.field.Search'
        ],

        controller : {
            type : 'criterion_selfservice_time_team_time_offs_list'
        },

        cls : 'criterion-selfservice-time-team-time-offs-list',

        viewModel : {
            data : {
                employeeGroupIds : [],
                employee : null,
                teamTimeOffsCount : 0,
                showApproved : true,
                startDate : Ext.Date.add(date, Ext.Date.DAY, -date.getDay()),
                gridColumns : [
                    {
                        xtype : 'gridcolumn',
                        width : 300,
                        text : '',
                        locked : true
                    }
                ]
            },

            stores : {
                teamTimeOffs : {
                    type : 'criterion_employee_team_time_offs',
                    remoteFilter : true,
                    remoteSort : true,
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                    filters : [
                        {
                            property : 'fullName',
                            value : '{searchValue}',
                            operator : 'like'
                        }
                    ],
                    listeners : {
                        datachanged : 'onTeamTimeOffsDataChanged',
                        filterchange : 'onTeamTimeOffsFilterChange',
                        beforeload : 'onTeamTimeOffsBeforeLoad'
                    }
                },
                teamTimeOffDetail : {
                    type : 'criterion_employee_team_time_off_details',
                    remoteFilter : true,
                    remoteSort : true
                },
                employeeGroups : {
                    type : 'criterion_employee_groups',
                    sorters : [
                        {
                            property : 'name',
                            direction : 'ASC'
                        }
                    ]
                }
            },

            formulas : {
                searchValue : data => {
                    let employee = data('employee');

                    return !!employee ? employee : null;
                },

                employeeGroupsList : data => {
                    let employeeGroupIds = data('employeeGroupIds'),
                        store = data('employeeGroups'),
                        employeeGroups = [];

                    if (!store.isLoaded() || !employeeGroupIds.length) {
                        return '';
                    }

                    Ext.each(employeeGroupIds, id => {
                        let employeeGroup = store.getById(id);

                        if (employeeGroup) {
                            employeeGroups.push(employeeGroup.get('name'));
                        }
                    });

                    return employeeGroups.length ? criterion.Utils.generateTipRow(i18n.gettext('Employee Groups'), employeeGroups.join(', ')) : '';
                }
            }
        },

        listeners : {
            scope : 'controller',
            activate : 'handleActivate',
            show : 'handleShow',
            afterrender : 'handleAfterRender',
            reconfigure : 'onReconfigure',
            beforecellclick : 'handleAct'
        },

        bind : {
            store : '{teamTimeOffs}',
            columns : '{gridColumns}'
        },

        header : {

            title : {
                text : i18n.gettext('Team Time Offs'),
                minimizeWidth : true
            },

            items : [
                {
                    xtype : 'button',
                    text : i18n.gettext('Options'),
                    ui : 'feature',
                    handler : 'handleOptions',
                    bind : {
                        tooltip : '{employeeGroupsList}'
                    }
                },
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'button',
                    glyph : criterion.consts.Glyph['ios7-arrow-left'],
                    ui : 'secondary',
                    handler : 'handlePrevWeek',
                    disabled : true,
                    bind : {
                        disabled : '{!teamTimeOffsCount}',
                        hidden : '{!teamTimeOffsCount}'
                    }
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'component',
                    bind : {
                        html : '{startDate:date}  &mdash; {endDate:date}',
                        hidden : '{!teamTimeOffsCount}'
                    }
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'button',
                    glyph : criterion.consts.Glyph['ios7-arrow-right'],
                    iconAlign : 'right',
                    ui : 'secondary',
                    handler : 'handleNextWeek',
                    disabled : true,
                    bind : {
                        disabled : '{!teamTimeOffsCount}',
                        hidden : '{!teamTimeOffsCount}'
                    }
                },
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'criterion_search_field',
                    ui : 'search-alt',
                    emptyText : i18n.gettext('Employee'),
                    checkChangeBuffer : 300,
                    bind : {
                        value : '{employee}'
                    }
                }
            ]
        },

        dockedItems : [
            {
                xtype : 'container',

                dock : 'top',

                items : [
                    {
                        xtype : 'toggleslidefield',
                        fieldLabel : i18n.gettext('Approved Only'),
                        labelWidth : 120,
                        bind : {
                            value : '{showApproved}'
                        },
                        listeners : {
                            change : 'handleChangeShowApproved'
                        }
                    }
                ]
            },
            {
                xtype : 'criterion_toolbar_paging',
                dock : 'bottom',
                displayInfo : true,
                allowLoadAll : false
            }
        ],

        tbar : null,

        ui : 'no-footer',

        frame : true,

        enableColumnMove : false,

        columnLines : false,

        syncRowHeight : false
    };

});
