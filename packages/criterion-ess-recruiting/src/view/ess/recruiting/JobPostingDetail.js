Ext.define('criterion.view.ess.recruiting.JobPostingDetail', function() {

    return {
        alias : 'widget.criterion_selfservice_recruiting_job_posting_detail',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.ess.recruiting.JobPostingDetail'
        ],

        controller : {
            type : 'criterion_selfservice_recruiting_job_posting_detail'
        },

        listeners : {
            activate : 'handleActivate'
        },

        frame : true,

        bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.ONE_TIER_FORM,

        header : {
            title : {
                bind : {
                    text : '{jobPosting.title}'
                },
                minimizeWidth : true
            },
            items : [
                {
                    xtype : 'button',
                    ui : 'secondary',
                    text : i18n.gettext('Candidates'),
                    listeners : {
                        click : 'handleShowCandidates'
                    }
                }
            ]
        },

        bbar : [
            '->',
            {
                xtype : 'criterion_button_back',
                handler : 'handleBack'
            }
        ],

        items : [
            {
                xtype : 'container',
                scrollable : true,
                flex : 1,
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },
                items : [
                    {
                        xtype : 'container',

                        defaults : criterion.Consts.UI_CONFIG.TWO_COL_ACCORDION,

                        items : [
                            {
                                xtype : 'container',

                                plugins : [
                                    'criterion_responsive_column'
                                ],
                                items : [
                                    {
                                        items : [
                                            {
                                                xtype : 'criterion_employer_combo',
                                                fieldLabel : i18n.gettext('Employer'),
                                                readOnly : true,
                                                bind : {
                                                    value : '{jobPosting.employerId}'
                                                }
                                            },
                                            {
                                                xtype : 'container',
                                                layout : 'hbox',
                                                margin : '0 0 18 0',
                                                items : [
                                                    {
                                                        xtype : 'textfield',
                                                        flex : 1,
                                                        fieldLabel : i18n.gettext('Position'),
                                                        bind : {
                                                            value : '{jobPosting.position.title}'
                                                        },
                                                        labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDTH,
                                                        readOnly : true
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        items : [
                                            {
                                                xtype : 'criterion_code_detail_field',
                                                fieldLabel : i18n.gettext('Status'),
                                                codeDataId : criterion.consts.Dict.JOB_POSTING_STATUS,
                                                bind : {
                                                    value : '{jobPosting.statusCd}'
                                                },
                                                readOnly : true,
                                                editable : false
                                            },
                                            {
                                                xtype : 'textfield',
                                                fieldLabel : i18n.gettext('Requisition #'),
                                                readOnly : true,
                                                bind : {
                                                    value : '{jobPosting.requisitionCode}'
                                                }
                                            },
                                            {
                                                xtype : 'textfield',
                                                fieldLabel : i18n.gettext('Salary'),
                                                readOnly : true,
                                                bind : {
                                                    value : '{jobPosting.salary}'
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype : 'container',
                        flex : 1,
                        layout : {
                            type : 'hbox',
                            align : 'stretch'
                        },
                        plugins : [
                            'criterion_responsive_column'
                        ],
                        items : [
                            {
                                xtype : 'container',
                                flex : 4,
                                layout : 'fit',
                                items : [
                                    {
                                        xtype : 'htmleditor',
                                        fieldLabel : i18n.gettext('Description'),
                                        padding : '20 50 25 25',
                                        readOnly : true,
                                        enableFormat : false,
                                        enableFontSize : false,
                                        enableColors : false,
                                        enableAlignments : false,
                                        enableLists : false,
                                        enableSourceEdit : false,
                                        enableLinks : false,
                                        enableFont : false,
                                        bind : {
                                            value : '{jobPosting.description}'
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };

});
