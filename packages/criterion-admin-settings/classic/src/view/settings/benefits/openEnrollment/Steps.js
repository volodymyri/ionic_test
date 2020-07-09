Ext.define('criterion.view.settings.benefits.openEnrollment.Steps', function() {

    return {
        alias : 'widget.criterion_settings_open_enrollment_steps',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.settings.benefits.openEnrollment.Steps',
            'criterion.store.employer.openEnrollment.Steps',
            'criterion.view.settings.benefits.openEnrollment.StepForm'
        ],

        controller : {
            type : 'criterion_settings_open_enrollment_steps',
            editor : {
                xtype : 'criterion_settings_open_enrollment_step_form',
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        viewModel : {
            stores : {
                stepsStore : {
                    type : 'criterion_employer_open_enrollment_steps',
                    sorters : [
                        {
                            property : 'sequenceNumber',
                            direction : 'ASC'
                        }
                    ]
                }
            },

            formulas : {
                nextBtnTitle : data => {
                    return data('openEnrollment.phantom') ? i18n.gettext('Save') : i18n.gettext('Next');
                }
            }
        },

        minButtonWidth : 100,

        bind : {
            store : '{stepsStore}'
        },

        tbar : [
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add Step'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                }
            }
        ],

        buttons : [
            {
                xtype : 'button',
                cls : 'criterion-btn-primary',
                text : i18n.gettext('Previous'),
                listeners : {
                    click : 'handlePrevClick'
                }
            },
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                listeners : {
                    click : 'handleCancelClick'
                }
            },
            {
                xtype : 'button',
                cls : 'criterion-btn-primary',
                listeners : {
                    click : 'handleNextClick'
                },
                bind : {
                    text : '{nextBtnTitle}'
                }
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Step Name'),
                dataIndex : 'name',
                flex : 1
            },
            {
                xtype : 'criterion_codedatacolumn',
                codeDataId : criterion.consts.Dict.BENEFIT_TYPE,
                dataIndex : 'benefitTypeCd',
                text : i18n.gettext('Benefit Type'),
                flex : 1
            },
            {
                xtype : 'criterion_actioncolumn',
                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH * 3,
                items : [
                    {
                        glyph : criterion.consts.Glyph['ios7-arrow-thin-up'],
                        tooltip : i18n.gettext('Move Up'),
                        text : '',
                        action : 'moveupaction',
                        getClass : function(value, metaData, record, rowIndex, colIndex, gridView) {
                            let store = gridView.store;

                            if (!record || (record.get('sequenceNumber') === (store.min('sequenceNumber') || 0))) {
                                return 'pseudo-disabled'
                            }
                        },
                        isActionDisabled : function(view, rowIndex, colIndex, item, record) {
                            let store = view.getStore();

                            return !record || (record.get('sequenceNumber') === (store.min('sequenceNumber') || 0))
                        }

                    },
                    {
                        glyph : criterion.consts.Glyph['ios7-arrow-thin-down'],
                        tooltip : i18n.gettext('Move Down'),
                        text : '',
                        action : 'movedownaction',
                        getClass : function(value, metaData, record, rowIndex, colIndex, gridView) {
                            let store = gridView.store;

                            if (!record || (record.get('sequenceNumber') === (store.max('sequenceNumber') || 0))) {
                                return 'pseudo-disabled'
                            }
                        },
                        isActionDisabled : function(view, rowIndex, colIndex, item, record) {
                            let store = view.getStore();

                            return !record || (record.get('sequenceNumber') === (store.max('sequenceNumber') || 0))
                        }
                    },
                    {
                        glyph : criterion.consts.Glyph['ios7-trash-outline'],
                        tooltip : i18n.gettext('Delete'),
                        action : 'removeaction'
                    }
                ]
            }
        ]
    };

});
