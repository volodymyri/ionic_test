Ext.define('criterion.view.settings.system.workflow.WorkflowSteps', function() {

    var WORKFLOW_STATUSES = criterion.Consts.WORKFLOW_STATUSES;

    return {

        alias : 'widget.criterion_settings_workflow_steps',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.settings.system.workflow.WorkflowSteps',
            'criterion.store.workflow.Details'
        ],

        viewModel : {
            data : {
                workflow : null
            },
            stores : {
                workflowSteps : {
                    type : 'criterion_workflow_details'
                }
            }
        },

        controller : {
            type : 'criterion_settings_workflow_steps'
        },

        bind : {
            store : '{workflowSteps}'
        },

        orderField : 'sequence',

        tbar : [
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                }
            },
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Track'),
                cls : 'criterion-btn-feature',
                hidden : true,
                bind : {
                    hidden : '{isPhantom}'
                },
                listeners : {
                    click : function() {
                        this.up('criterion_settings_workflow_steps').fireEvent('trackClick');
                    }
                }
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Step'),
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                dataIndex : 'sequence',
                sortable : false
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Performed By'),
                dataIndex : 'performer',
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
            },
            {
                xtype : 'criterion_codedatacolumn',
                dataIndex : 'stateCd',
                codeDataId : criterion.consts.Dict.WORKFLOW_STATE,
                text : i18n.gettext('Action'),
                flex : 1
            },
            {
                xtype : 'criterion_actioncolumn',
                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH * 2,
                dataIndex : 'sequence',
                items : [
                    {
                        glyph : criterion.consts.Glyph['ios7-arrow-thin-up'],
                        tooltip : i18n.gettext('Move Up'),
                        text : '',
                        action : 'moveupaction',
                        dataIndex : 'sequence',
                        getClass : function(value, metaData, record, rowIndex, colIndex, gridView) {
                            var approvedCdId = criterion.CodeDataManager.getStore(criterion.consts.Dict.WORKFLOW_STATE).findRecord('code', WORKFLOW_STATUSES.APPROVED).getId(),
                                escalationCdId = criterion.CodeDataManager.getStore(criterion.consts.Dict.WORKFLOW_STATE).findRecord('code', WORKFLOW_STATUSES.ESCALATION).getId(),
                                store = gridView.store;

                            if (!record || (record.get('sequence') === 1 || store.find('id', record.getId()) < 2) || (record.get('stateCd') === approvedCdId) || (record.get('stateCd') === escalationCdId)) {
                                return 'pseudo-disabled'
                            }
                        },
                        isActionDisabled : function(view, rowIndex, colIndex, item, record) {
                            var store = view.getStore(),
                                approvedCdId = criterion.CodeDataManager.getStore(criterion.consts.Dict.WORKFLOW_STATE).findRecord('code', WORKFLOW_STATUSES.APPROVED).getId(),
                                escalationCdId = criterion.CodeDataManager.getStore(criterion.consts.Dict.WORKFLOW_STATE).findRecord('code', WORKFLOW_STATUSES.ESCALATION).getId();

                            return !record || (record.get('sequence') === 1 || store.find('id', record.getId()) < 2 || (record.get('stateCd') === approvedCdId) || (record.get('stateCd') === escalationCdId))
                        }
                    },
                    {
                        glyph : criterion.consts.Glyph['ios7-arrow-thin-down'],
                        tooltip : i18n.gettext('Move Down'),
                        text : '',
                        action : 'movedownaction',
                        getClass : function(value, metaData, record, rowIndex, colIndex, gridView) {
                            var approvedCdId = criterion.CodeDataManager.getStore(criterion.consts.Dict.WORKFLOW_STATE).findRecord('code', WORKFLOW_STATUSES.APPROVED).getId(),
                                store = gridView.store,
                                approvedRecordIdx = record.store.find('stateCd', approvedCdId),
                                prevRecord = approvedRecordIdx > 1 && store.getAt(approvedRecordIdx - 1);

                            if (!record || (record.get('sequence') === 1 || store.find('id', record.getId()) === store.count() - 1) || prevRecord == record || (record.get('stateCd') === approvedCdId)) {
                                return true
                            }
                        },
                        isDisabled : function(view, rowIndex, colIndex, item, record) {
                            var store = view.getStore(),
                                approvedCdId = criterion.CodeDataManager.getStore(criterion.consts.Dict.WORKFLOW_STATE).findRecord('code', WORKFLOW_STATUSES.APPROVED).getId(),
                                approvedRecordIdx = record.store.find('stateCd', approvedCdId),
                                prevRecord = approvedRecordIdx > 1 && store.getAt(approvedRecordIdx - 1);

                            return !record || (record.get('sequence') === 1 || store.find('id', record.getId()) === store.count() - 1 || prevRecord == record || (record.get('stateCd') === approvedCdId))
                        }
                    }
                ]
            }
        ]
    };

});
