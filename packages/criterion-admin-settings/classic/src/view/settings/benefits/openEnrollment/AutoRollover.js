Ext.define('criterion.view.settings.benefits.openEnrollment.AutoRollover', function() {

    return {

        alias : 'widget.criterion_settings_open_enrollment_auto_rollover',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.settings.benefits.openEnrollment.AutoRollover',
            'criterion.store.employer.openEnrollment.Rollovers',
            'criterion.store.employer.openEnrollment.ReplacementBenefitPlans'
        ],

        controller : {
            type : 'criterion_settings_open_enrollment_auto_rollover'
        },

        viewModel : {
            stores : {
                rollovers : {
                    type : 'criterion_employer_open_enrollment_rollovers'
                },
                replacementBenefitPlans : {
                    type : 'criterion_employer_open_enrollment_replacement_benefit_plans'
                }
            }
        },

        buttons : [
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
                text : i18n.gettext('Save')
            }
        ],

        tbar : [
            {
                xtype : 'toggleslidefield',
                fieldLabel : i18n.gettext('Enable Auto Rollover'),
                labelWidth : 150,
                bind : {
                    value : '{openEnrollment.isAutoRollover}'
                }
            }
        ],

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        items : [
            {
                xtype : 'criterion_gridpanel',
                margin : '10 0 0 0',

                scrollable : true,
                flex : 1,
                hidden : true,
                bind : {
                    hidden : '{!openEnrollment.isAutoRollover}',
                    store : '{rollovers}'
                },

                listeners : {
                    configureAction : 'handleConfigureRollover'
                },

                columns : [
                    {
                        xtype : 'gridcolumn',
                        dataIndex : 'originalBenefitPlanName',
                        text : i18n.gettext('Original Benefit Plan'),
                        flex : 1
                    },
                    {
                        xtype : 'widgetcolumn',
                        text : i18n.gettext('Auto Rollover Benefit Plan'),
                        dataIndex : 'replacementBenefitPlanId',
                        flex : 1,
                        widget : {
                            xtype : 'combobox',
                            forceSelection : true,
                            allowBlank : true,
                            autoSelect : true,
                            editable : true,
                            queryMode : 'local',
                            valueField : 'id',
                            displayField : 'name',
                            listeners : {
                                change : (cmp, value, oldValue) => {
                                    let widgetRecord = cmp.getWidgetRecord(),
                                        recv = cmp.getSelection();

                                    if (widgetRecord.generation > 1) {
                                        widgetRecord.set('optionChange', null);
                                    }

                                    widgetRecord.set({
                                        replacementBenefitPlanId : value,
                                        replacementBenefitPlanName : recv ? recv.get('name') : ''
                                    });
                                }
                            }
                        },
                        onWidgetAttach : (column, widget, record) => {
                            let originalBenefitPlanId = record.get('originalBenefitPlanId'),
                                replacementBenefitPlans = column.up('criterion_settings_open_enrollment_auto_rollover').getViewModel().get('replacementBenefitPlans');

                            widget.setStore(replacementBenefitPlans.getById(originalBenefitPlanId).replacementPlans());
                        }
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Configured'),
                        dataIndex : 'isConfigured',
                        align : 'center',
                        encodeHtml : false,
                        renderer : (value, cell, record) => record.get('replacementBenefitPlanId') ? (value ? '<span class="criterion-green bold">✓</span>' : '<span class="criterion-darken-gray">x</span>') : '',
                        width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                    },
                    {
                        xtype : 'criterion_actioncolumn',
                        width : 145,
                        items : [
                            {
                                text : i18n.gettext('Configure'),
                                asButton : true,
                                action : 'configureAction',
                                getClass : (v, m, record) => record && record.get('replacementBenefitPlanId') ? '' : 'hidden-el'
                            }
                        ]
                    }
                ]
            }
        ]
    };

});
