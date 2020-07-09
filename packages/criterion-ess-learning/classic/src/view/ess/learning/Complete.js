Ext.define('criterion.view.ess.learning.Complete', function() {

    return {
        alias : 'widget.criterion_selfservice_learning_complete',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.learning.Complete',
            'criterion.controller.ess.learning.Complete'
        ],

        controller : {
            type : 'criterion_selfservice_learning_complete'
        },

        store : {
            type : 'criterion_learning_complete',
            pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
        },

        stateId : 'learningCompleteGrid',
        stateful : true,

        listeners : {
            viewAction : 'handleViewAction',
            activate : 'handleActivate'
        },

        viewModel : {
            data : {
                isShowDownloadReportButton : false
            }
        },

        header : {

            title : i18n.gettext('Completed Courses'),

            items : [
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'button',
                    text : i18n.gettext('Get Report'),
                    ui : 'secondary',
                    hidden : true,
                    bind : {
                        hidden : '{!isShowDownloadReportButton}'
                    },
                    handler : 'handleGetReport'
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'button',
                    cls : 'criterion-btn-glyph-only',
                    glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                    scale : 'medium'
                }
            ]
        },

        tbar : null,
        cls : 'criterion-grid-panel-simple-list',

        dockedItems : {
            xtype : 'criterion_toolbar_paging',
            dock : 'bottom',
            displayInfo : true
        },

        columns : [
            {
                xtype : 'widgetcolumn',
                text : '',
                width : 20,
                align : 'center',
                sortable : false,
                resizable : false,
                menuDisabled : true,
                widget : {
                    xtype : 'component',
                    cls : 'criterion-info-component',
                    margin : '10 0 0 2',
                    tooltipEnabled : true,
                    hidden : true,
                    bind : {
                        tooltip : '{record.description}',
                        hidden : '{!record.description}'
                    }
                }
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Course Name'),
                flex : 2,
                dataIndex : 'name'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Class Name'),
                hidden : true,
                flex : 1,
                dataIndex : 'courseClassName'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Employer'),
                flex : 2,
                dataIndex : 'employerName'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Type'),
                dataIndex : 'type',
                flex : 1
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Completed Date'),
                dataIndex : 'completedDate',
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
            },
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('Status'),
                hidden : true,
                dataIndex : 'courseSuccessStatusCd',
                codeDataId : criterion.consts.Dict.COURSE_SUCCESS_STATUS,
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
            },
            {
                xtype : 'criterion_actioncolumn',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                items : [
                    {
                        text : i18n.gettext('View'),
                        asButton : true,
                        action : 'viewAction',
                        getClass : function(v, m, record) {
                            if (record && record.get('courseTypeCode') === criterion.Consts.COURSE_DELIVERY.ONDEMAND) {
                                return 'criterion-learning-action-button';
                            }

                            return 'hidden-el';
                        },
                        ui : 'frame'
                    }
                ]
            }
        ]
    };

});
