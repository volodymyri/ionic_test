Ext.define('criterion.view.ess.openEnrollment.OpenEnrollmentSummary', function() {

    return {
        alias : 'widget.criterion_selfservice_open_enrollment_summary',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.ess.openEnrollment.OpenEnrollmentSummary',
            'criterion.ux.form.FillableWebForm'
        ],

        controller : {
            type : 'criterion_selfservice_open_enrollment_summary'
        },

        viewModel : {
            data : {
                steps : null,
                cafeCredit : null,
                cafeBenefitPlanName : null
            }
        },

        ui : 'clean',

        isEnrollmentSummary : true,

        webformDataStore : null,

        listeners : {
            activate : 'handleActivate'
        },

        scrollable : 'vertical',

        title : i18n.gettext('Summary'),

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        cls : 'summary',

        padding : criterion.Consts.UI_DEFAULTS.PADDING.SIMPLE_FORM,

        createItems() {
            let me = this,
                vm = this.getViewModel(),
                steps = vm.get('steps');

            me.removeAll(true);

            if (steps.length) {
                me.add({
                    xtype : 'container',
                    layout : 'hbox',
                    padding : '0 0 10 0',

                    defaults : {
                        xtype : 'component',
                        cls : 'title',
                        flex : 1
                    },

                    items : [
                        {
                            html : '&nbsp;'
                        },
                        {
                            html : i18n.gettext('Current')
                        },
                        {
                            html : i18n.gettext('Next Year')
                        },
                        {
                            html : i18n.gettext('Employee Contribution')
                        }
                    ]
                });

                Ext.Array.each(steps, stepData => {
                    let step = stepData.step,
                        plan = stepData.plan,
                        openEnrollmentStepId = step.get('openEnrollmentStepId');

                    me.add({
                        xtype : 'panel',
                        layout : 'hbox',

                        border : true,
                        padding : '10 0',
                        cls : 'panel-summary',

                        defaults : {
                            xtype : 'component',
                            padding : '20 0',
                            flex : 1
                        },

                        items : [
                            {
                                cls : 'title',
                                padding : 20,
                                html : step.get('benefitName')
                            },
                            {
                                xtype : 'container',
                                padding : '10 0',
                                defaults : {
                                    xtype : 'component',
                                    padding : '10 0'
                                },
                                items : me.getCurrentItems(stepData)
                            },
                            {
                                xtype : 'container',
                                padding : '10 0',
                                defaults : {
                                    xtype : 'component',
                                    padding : '10 0'
                                },
                                items : me.getStepItems(stepData)
                            },
                            {
                                html : step.get('contribution')
                            }
                        ]
                    });

                    if (plan && plan.get('webformId')) {
                        step.set('webformId', plan.get('webformId'));

                        me.add({
                            xtype : 'criterion_fillable_webform',
                            header : {
                                title : i18n.gettext('Form') + ' (' + step.get('planName') + ')',
                                padding : '10 0 10 15',
                                margin : 0,
                                items : [
                                    {
                                        xtype : 'tbfill'
                                    },
                                    {
                                        xtype : 'button',
                                        text : i18n._('Download'),
                                        disabled : true,
                                        bind : {
                                            disabled : '{!isApproved}'
                                        },
                                        stepId : step.getId(),
                                        listeners : {
                                            click : 'handleDownloadFormClick'
                                        }
                                    }
                                ]
                            },
                            reference : 'webform_for_' + openEnrollmentStepId,
                            openEnrollmentStepId : openEnrollmentStepId,
                            margin : '20 0 20 0',
                            border : 1,
                            style : {
                                borderColor : '#EEE',
                                borderStyle : 'solid',
                                borderWidth : 0
                            },
                            correctHeightValue : 60,
                            scrollable : true,
                            editable : !vm.get('editDisabled')
                        });
                    }
                });

                if (vm.get('cafeBenefitPlanName')) {
                    me.add({
                        xtype : 'panel',
                        layout : 'hbox',

                        border : true,
                        padding : '10 0',
                        cls : 'panel-summary',

                        defaults : {
                            xtype : 'component',
                            padding : '20 0',
                            flex : 1
                        },

                        items : [
                            {
                                cls : 'title',
                                padding : 20,
                                bind : {
                                    html : '{cafeBenefitPlanName}'
                                }
                            },
                            {
                                bind : {
                                    html : '{cafeCredit:currency}'
                                }
                            }
                        ]
                    });
                }
            }
        },

        getStepItems(stepData) {
            let options = [],
                step = stepData.step;

            if (step.get('isEnroll')) {
                options.push({
                    html : Ext.util.Format.format('<strong>{0}</strong>', step.get('planName'))
                });

                if (step.get('options')) {
                    options.push.apply(options, step.get('options').map(function(option) {
                        return {
                            html : Ext.util.Format.format('{0}: {1}', option.optionName, option.manualValue || option.optionValue)
                        }
                    }));
                }
            } else {
                options.push({
                    html : Ext.util.Format.format('<strong>{0}</strong>', i18n.gettext('No Next Year Plan'))
                });
            }

            return options;
        },

        getCurrentItems(stepData) {
            let currentOptions = [],
                current = stepData.current;

            if (current) {
                currentOptions.push({
                    html : Ext.util.Format.format('<strong>{0}</strong>', current.planName)
                });

                if (current.options) {
                    currentOptions.push.apply(currentOptions, current.options.map(function(option) {
                        return {
                            html : Ext.util.Format.format('{0}: {1}', option.optionName, option.optionValue)
                        }
                    }));
                }
            } else {
                currentOptions.push({
                    html : Ext.util.Format.format('<strong>{0}</strong>', i18n.gettext('No Current Plan'))
                });
            }

            return currentOptions;
        },

        saveWebFormsData() {
            this.getController().saveWebFormsData();
        }
    }
});
