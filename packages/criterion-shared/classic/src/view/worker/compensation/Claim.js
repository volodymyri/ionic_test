Ext.define('criterion.view.worker.compensation.Claim', function() {

    var DICT = criterion.consts.Dict;

    return {
        alias : 'widget.criterion_worker_compensation_claim',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.view.CustomFields',
            'criterion.controller.worker.compensation.Claim',
            'criterion.view.worker.compensation.claim.Costs',
            'criterion.view.worker.compensation.claim.Logs'
        ],

        controller : {
            type : 'criterion_worker_compensation_claim',
            externalUpdate : false
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        defaultType : 'container',

        bodyPadding : 0,

        viewModel : {
            formulas : {
                hideSave : function(data) {
                    return !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_WORKERS_COMPENSATION, criterion.SecurityManager.UPDATE, false, true));
                },

                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_WORKERS_COMPENSATION, criterion.SecurityManager.DELETE, false, true));
                }
            }
        },

        items : [
            {
                xtype : 'criterion_panel',

                title : i18n.gettext('Workers Compensation Claim'),
                layout : 'hbox',
                plugins : [
                    'criterion_responsive_column'
                ],

                bodyPadding : 10,

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,

                items : [
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Claim Number'),
                                name : 'claimNumber',
                                allowBlank : false
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Claim Date'),
                                name : 'claimDate',
                                allowBlank : false
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                codeDataId : DICT.WC_CLAIM_STATUS,
                                fieldLabel : i18n.gettext('Status'),
                                name : 'wcClaimStatusCd',
                                allowBlank : true
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                codeDataId : DICT.WC_CLAIM_ACTION,
                                fieldLabel : i18n.gettext('Action'),
                                name : 'wcClaimActionCd',
                                allowBlank : true
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Date Of Injury'),
                                name : 'injuryDate'
                            },
                            {
                                xtype : 'timefield',
                                fieldLabel : i18n.gettext('Time Of Injury'),
                                name : 'injuryTime'
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Date Reported'),
                                name : 'reportedDate',
                                allowBlank : false
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Date Closed'),
                                name : 'closedDate'
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_panel',

                title : i18n.gettext('Inquiry Information'),
                layout : 'hbox',
                plugins : [
                    'criterion_responsive_column'
                ],

                bodyPadding : 10,

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,

                items : [
                    {
                        items : [
                            {
                                xtype : 'criterion_code_detail_field',
                                codeDataId : DICT.WC_CLAIM_TYPE,
                                fieldLabel : i18n.gettext('Type of Claim'),
                                name : 'wcClaimTypeCd',
                                allowBlank : false
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                codeDataId : DICT.WC_NATURE_OF_INJURY,
                                fieldLabel : i18n.gettext('Nature of Injury'),
                                reference : 'natureClaim',
                                name : 'wcNatureOfInjuryCd',
                                allowBlank : false
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                codeDataId : DICT.WC_BODY_PART,
                                fieldLabel : i18n.gettext('Body part'),
                                name : 'wcBodyPartCd',
                                allowBlank : true
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                codeDataId : DICT.WC_TASK,
                                fieldLabel : i18n.gettext('Task when Injured'),
                                name : 'wcTaskCd',
                                allowBlank : true
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Litigation'),
                                name : 'litigated'
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'criterion_code_detail_field',
                                codeDataId : DICT.WC_LOCATION,
                                fieldLabel : i18n.gettext('Location'),
                                name : 'wcLocationCd',
                                allowBlank : true
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                codeDataId : DICT.WC_TOOL,
                                fieldLabel : i18n.gettext('Tools/Machinery'),
                                name : 'wcToolCd',
                                allowBlank : true
                            },
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Restricted Time'),
                                name : 'restrictedTime',
                                minValue : 0
                            },
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Absent Time'),
                                name : 'absentTime',
                                minValue : 0
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'tabpanel',

                cls : 'criterion-tab-bar-top-border',

                tabBar : {
                    defaults : {
                        margin : 0
                    }
                },

                listeners : {
                    afterrender : function(panel) {
                        panel.tabBar.add([
                            {
                                xtype : 'component',
                                flex : 1
                            },
                            {
                                xtype : 'button',
                                text : i18n.gettext('Add'),
                                margin : '0 10 5 0',
                                cls : 'criterion-btn-feature',
                                listeners : {
                                    click : 'handleAddObject'
                                }
                            }
                        ]);
                    }
                },

                items : [
                    {
                        xtype : 'criterion_worker_compensation_claim_costs',
                        reference : 'costs',
                        tbar : null
                    },
                    {
                        xtype : 'criterion_employee_compensation_claim_logs',
                        reference : 'details',
                        tbar : null
                    }
                ]
            }
        ]
    };

});
