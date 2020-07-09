Ext.define('criterion.view.settings.benefits.openEnrollment.RolloverConfigure', function() {

    return {
        alias : 'widget.criterion_settings_open_enrollment_rollover_configure',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.settings.benefits.openEnrollment.RolloverConfigure'
        ],

        controller : {
            type : 'criterion_settings_open_enrollment_rollover_configure'
        },

        listeners : {
            scope : 'controller',
            show : 'handleShow'
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,
                height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT
            }
        ],

        viewModel : {
            data : {
                /**
                 * @see criterion.model.employer.BenefitPlan
                 */
                originalBenefitPlan : null,
                replacementBenefitPlan : null,
                optionChange : null
            }
        },

        title : i18n.gettext('Configure Option Groups'),

        bodyPadding : 0,

        dockedItems : [
            {
                xtype : 'container',
                layout : 'hbox',
                dock : 'top',
                items : [
                    {
                        xtype : 'container',
                        width : 150,
                        items : [
                            {
                                xtype : 'component',
                                padding : '10 0 5 10',
                                html : ''
                            }
                        ]
                    },

                    {
                        xtype : 'container',
                        flex : 1,
                        items : [
                            {
                                xtype : 'component',
                                padding : '10 0 5 10',
                                cls : 'bold',
                                html : i18n.gettext('Old')
                            }
                        ]
                    },

                    {
                        xtype : 'container',
                        flex : 1,
                        items : [
                            {
                                xtype : 'component',
                                padding : '10 0 5 10',
                                cls : 'bold',
                                html : i18n.gettext('New')
                            }
                        ]
                    }
                ]
            }
        ],

        scrollable : 'vertical',

        items : [],

        buttons : [
            {
                xtype : 'button',
                reference : 'cancelBtn',
                cls : 'criterion-btn-light',
                text : i18n.gettext('Cancel'),
                handler : 'handleCancel'
            },
            {
                xtype : 'button',
                reference : 'saveButton',
                cls : 'criterion-btn-primary',
                text : i18n.gettext('Save'),
                handler : 'handleSave'
            }
        ],

        createGroupBlock(data) {
            let {index, optionGroup, optionGroupIsManual, options, newPlanOptions, existedOptionChanges} = data,
                optionLabels = [],
                originalOptionFields = [],
                selectOptionFields = [],
                groupOptionChanges = {};

            Ext.Array.each(options, (option, i) => {
                let originalOptionId = option.id;

                groupOptionChanges[i] = {};
                groupOptionChanges[i]['originalOptionId'] = originalOptionId;

                if (existedOptionChanges) {
                    Ext.Array.each(existedOptionChanges.options, opt => {
                        if (opt.originalOptionId === originalOptionId) {
                            groupOptionChanges[i]['replacementOptionId'] = opt.replacementOptionId;
                        }
                    });
                }

                optionLabels.push({
                    xtype : 'label',
                    text : '\u00A0 \u21B3 \u00A0' + i18n.gettext('Option') + (i + 1),
                    margin : '15 0 24 15'
                });

                originalOptionFields.push({
                    xtype : 'textfield',
                    readOnly : true,
                    value : `${option.name} [${option.code}]`
                });

                selectOptionFields.push({
                    xtype : 'combobox',
                    disabled : true,
                    allowBlank : false,
                    queryMode : 'local',
                    valueField : 'id',
                    displayField : 'name',
                    editable : false,
                    bind : {
                        disabled : '{!groupIndex}',
                        value : `{groupOptionChanges.${i}.replacementOptionId}`,
                        store : '{options}',

                        filters : [
                            {
                                property : 'optionGroup',
                                value : '{groupIndex}',
                                exactMatch : true
                            }
                        ]
                    }
                });
            });

            this.add({
                xtype : 'component',
                autoEl : 'hr',
                cls : 'criterion-horizontal-ruler'
            });

            this.add({
                xtype : 'container',
                layout : 'hbox',
                reference : `groupContainer${index}`,

                viewModel : {
                    data : {
                        groupIndex : (existedOptionChanges ? existedOptionChanges['toGroup'] : null),
                        groupOptionChanges : groupOptionChanges
                    },
                    stores : {
                        optionGroups : {
                            proxy : {
                                type : 'memory'
                            },
                            fields : [
                                {
                                    name : 'id',
                                    type : 'int'
                                },
                                {
                                    name : 'name',
                                    type : 'string'
                                }
                            ],
                            data : Ext.Array.filter(newPlanOptions.groups, group => group.isManual === optionGroupIsManual)
                        },
                        options : {
                            proxy : {
                                type : 'memory'
                            },
                            fields : [
                                {
                                    name : 'id',
                                    type : 'int'
                                },
                                {
                                    name : 'name',
                                    type : 'string'
                                },
                                {
                                    name : 'optionGroup',
                                    type : 'integer'
                                }
                            ],
                            data : newPlanOptions.options
                        }
                    }
                },

                items : [
                    {
                        xtype : 'container',
                        width : 150,
                        layout : {
                            type : 'vbox',
                            align : 'stretch'
                        },
                        items : [
                            {
                                xtype : 'label',
                                html : i18n.gettext('Option Group') + index + (optionGroupIsManual ? '<br/><span class="bold">' + i18n.gettext('is manual') + '</span>' : ''),
                                margin : optionGroupIsManual ? '10 0 12 10' : '15 0 24 10',
                            },
                            ...optionLabels
                        ]
                    },

                    {
                        xtype : 'container',
                        flex : 1,
                        layout : {
                            type : 'vbox',
                            align : 'stretch'
                        },
                        defaults : {
                            margin : '10 10 10 5'
                        },
                        items : [
                            {
                                xtype : 'textfield',
                                value : optionGroup,
                                readOnly : true
                            },
                            ...originalOptionFields
                        ]
                    },

                    {
                        xtype : 'container',
                        flex : 1,
                        layout : {
                            type : 'vbox',
                            align : 'stretch'
                        },
                        defaults : {
                            margin : '10 10 10 5'
                        },
                        items : [
                            {
                                xtype : 'combobox',
                                allowBlank : false,
                                queryMode : 'local',
                                valueField : 'id',
                                displayField : 'name',
                                editable : false,
                                bind : {
                                    value : '{groupIndex}',
                                    store : '{optionGroups}'
                                }
                            },
                            ...selectOptionFields
                        ]
                    }
                ]
            });
        }

    };

});
