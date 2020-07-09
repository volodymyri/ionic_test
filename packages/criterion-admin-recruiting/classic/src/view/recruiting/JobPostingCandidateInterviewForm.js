Ext.define('criterion.view.recruiting.JobPostingCandidateInterviewForm', function() {

    return {

        alias : 'widget.criterion_recruiting_job_posting_candidate_interview_form',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.recruiting.JobPostingCandidateInterviewForm'
        ],

        controller : {
            type : 'criterion_recruiting_job_posting_candidate_interview_form',
            externalUpdate : false
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                height : 'auto',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
            }
        ],

        title : i18n._('Interview'),

        viewModel : {
            formulas : {
                hideSave : function(data) {
                    return !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_INTERVIEW, criterion.SecurityManager.UPDATE, false, true));
                },

                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_INTERVIEW, criterion.SecurityManager.DELETE, false, true));
                },

                interviewers : {
                    bind : {
                        bindTo : '{record.details}',
                        deep : true
                    },
                    get : function(details) {
                        let names = [];

                        if (details) {
                            details.each(rec => {
                                names.push(rec.get('interviewerName'));
                            });
                        }

                        return names.join(', ');
                    }
                }
            }
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        bodyPadding : 20,

        items : [
            {
                xtype : 'criterion_code_detail_field',
                fieldLabel : i18n._('Interview Type'),
                name : 'interviewTypeCd',
                bind : '{record.interviewTypeCd}',
                codeDataId : criterion.consts.Dict.INTERVIEW_REVIEW_TYPE
            },

            {
                xtype : 'fieldcontainer',
                layout : 'hbox',
                fieldLabel : i18n._('Date / Time'),
                requiredMark : true,
                items : [
                    {
                        xtype : 'datefield',
                        name : 'interviewDateDate',
                        fieldLabel : '',
                        hideLabel : true,
                        allowBlank : false,
                        bind : '{record.interviewDateDate}',
                        margin : '0 10 0 0',
                        listeners : {
                            change : 'changeInterviewDateDate'
                        }
                    },
                    {
                        xtype : 'timefield',
                        name : 'interviewDateTime',
                        fieldLabel : '',
                        hideLabel : true,
                        bind : '{record.interviewDateTime}',
                        allowBlank : false,
                        flex : 1,
                        listeners : {
                            change : 'changeInterviewDateTime'
                        }
                    }
                ],
                margin : '0 0 15 0'
            },
            {
                xtype : 'combobox',
                fieldLabel : i18n._('Duration') + '<br><span class="fs-08">' + i18n._('(minutes)') + '</span>',
                allowBlank : false,
                valueField : 'minutes',
                bind : '{record.interviewDuration}',
                name : 'interviewDuration',
                displayField : 'text',

                sortByDisplayField : false,
                store : Ext.create('Ext.data.Store', {
                    fields : ['minutes', 'text'],
                    data : criterion.Consts.INTERVIEW_DURATIONS
                }),
                editable : true
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n._('Address'),
                name : 'interviewAddress',
                bind : '{record.interviewAddress}'
            },
            {
                xtype : 'fieldcontainer',
                fieldLabel : i18n._('Interviewers'),
                layout : 'hbox',
                items : [
                    {
                        xtype : 'textfield',
                        flex : 1,
                        bind : {
                            value : '{interviewers}'
                        },
                        readOnly : true
                    },
                    {
                        xtype : 'button',
                        scale : 'small',
                        margin : '0 0 0 3',
                        cls : 'criterion-btn-light',
                        glyph : criterion.consts.Glyph['ios7-search'],
                        handler : 'handleInterviewerSearch'
                    }
                ]
            },
            {
                xtype : 'toggleslidefield',
                fieldLabel : i18n._('Send email'),
                reference : 'sendEmail',
                value : false,
                bind : {
                    value : '{record.sendEmail}'
                }
            },
            {
                xtype : 'textarea',
                fieldLabel : i18n._('Message'),
                name : 'message',
                height : 300,
                bind : '{record.message}'
            },
            {
                layout : 'center',
                items : [
                    {
                        xtype : 'button',
                        text : i18n._('Download Calendar'),
                        handler : 'handleDownloadCalendar',
                        hidden : true,
                        bind : {
                            hidden : criterion.SecurityManager.getComplexSecurityFormula({
                                append : 'isPhantom ||',
                                rules : [
                                    {
                                        key : criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_INTERVIEW_DOWNLOAD_CALENDAR,
                                        actName : criterion.SecurityManager.ACT,
                                        reverse : true
                                    }
                                ]
                            })
                        }
                    }
                ]
            }
        ]
    };

});
