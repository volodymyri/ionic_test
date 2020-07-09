Ext.define('criterion.view.common.positions.PositionList', function() {

    return {
        alias : 'widget.criterion_positions_position_list',

        extend : 'criterion.ux.grid.Panel',

        requires : [
            'criterion.controller.common.positions.PositionList',
            'criterion.view.common.positions.AssignmentsList',
            'criterion.store.position.Search',

            'Ext.grid.filters.Filters',
            'criterion.ux.grid.filters.filter.Employer'
        ],

        plugins : [
            'gridfilters'
        ],

        stateId : 'positionsGrid',
        stateful : true,

        reference : 'positionList',

        viewModel : {},

        listeners : {
            scope : 'controller',
            goToProfile : 'onGoToProfile',
            select : 'onSelect',
            show : 'handleShow'
        },

        controller : {
            type : 'criterion_positions_position_list'
        },

        store : {
            type : 'position_search',
            remoteSort : true,
            remoteFilter : true,
            pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
        },

        tbar : null,

        dockedItems : {
            xtype : 'criterion_toolbar_paging',
            dock : 'bottom',
            displayInfo : true,

            stateId : 'positionsGrid',
            stateful : true
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Code'),
                dataIndex : 'code',
                filter : false
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Title'),
                flex : 1,
                dataIndex : 'title',
                filter : false
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Job'),
                flex : 1,
                dataIndex : 'jobCode',
                unselectedText : '',
                hidden : true
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Employer'),
                flex : 1,
                dataIndex : 'employerLegalName',
                filter : false
            },
            {
                xtype : 'criterion_codedatacolumn',
                codeDataId : criterion.consts.Dict.DEPARTMENT,
                text : i18n.gettext('Department'),
                dataIndex : 'departmentCd',
                flex : 1,
                filter : {
                    type : 'codedata'
                },
                hidden : true
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Location'),
                dataIndex : 'locationDescription',
                flex : 1,
                filter : true
            },
            {
                xtype : 'booleancolumn',
                text : i18n.gettext('Status'),
                dataIndex : 'isActive',
                trueText : i18n.gettext('Active'),
                falseText : i18n.gettext('Inactive'),
                flex : 1,
                filter : false
            },
            {
                xtype : 'widgetcolumn',
                text : i18n.gettext('Employee'),
                dataIndex : 'employeeName',
                preventEdit : true,
                flex : 1,
                widget : {
                    xtype : 'button',
                    scale : 'medium',
                    textAlign : 'left',
                    cls : 'criterion-btn-like-link',
                    handler : function() {
                        this.$widgetColumn.up('gridpanel').fireEvent('goToProfile', this.$widgetRecord, this);
                    }
                }
            }
        ]
    };

});
