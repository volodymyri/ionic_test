Ext.define('criterion.view.settings.learning.Paths', function() {

    const LEARNING_PATH_STATE_ID = 'learningPathGrid';

    return {
        alias : 'widget.criterion_settings_learning_paths',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.store.learning.Paths',
            'criterion.view.settings.learning.Path',
            'criterion.controller.employer.GridView',
            'criterion.ux.toolbar.ToolbarPaging',
            'criterion.view.FilterWithSelectorBar',
            'criterion.controller.mixin.FilterByProperty',
            'criterion.controller.settings.learning.Paths'
        ],

        title : i18n.gettext('Learning Paths'),

        layout : 'fit',

        controller : {
            type : 'criterion_settings_learning_paths',
            showTitleInConnectedViewMode : true,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            connectParentView : {
                parentForSpecified : true
            },
            editor : {
                xtype : 'criterion_settings_learning_path',
                allowDelete : true
            }
        },

        store : {
            type : 'criterion_learning_paths',

            pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
        },

        stateId : LEARNING_PATH_STATE_ID,

        stateful : true,

        tbar : {
            overflowHandler : 'scroller',
            
            items : [
                {
                    xtype : 'criterion_settings_employer_bar',
                    context : 'criterion_settings'
                },
                {
                    xtype : 'criterion_filter_with_selector_bar',
                    properties : {
                        data : [
                            { id : 'name', name : 'Name'},
                            { id : 'code', name : 'Code'}
                        ]
                    },
                    listeners : {
                        filterByProperty : 'handleFilterByProperty'
                    }
                },
                '->',
                {
                    xtype : 'button',
                    reference : 'addButton',
                    text : i18n.gettext('Add'),
                    cls : 'criterion-btn-feature',
                    listeners : {
                        click : 'handleAddClick'
                    }
                },
                {
                    xtype : 'button',
                    reference : 'refreshButton',
                    cls : 'criterion-btn-transparent',
                    glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                    scale : 'medium',
                    listeners : {
                        click : 'handleRefreshClick'
                    }
                }
            ]
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                flex : 2,
                dataIndex : 'name'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Number Of Courses'),
                flex : 1,
                dataIndex : 'courseCount'
            }
        ],

        dockedItems : {
            xtype : 'criterion_toolbar_paging',
            dock : 'bottom',
            displayInfo : true,

            stateId : LEARNING_PATH_STATE_ID,
            stateful : true
        }
    };

});
