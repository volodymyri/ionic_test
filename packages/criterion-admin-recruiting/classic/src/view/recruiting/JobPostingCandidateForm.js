Ext.define('criterion.view.recruiting.JobPostingCandidateForm', function() {

    var DICT = criterion.consts.Dict,
        GLYPH = criterion.consts.Glyph;

    return {

        alias : 'widget.criterion_recruiting_job_posting_candidate_form',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.ux.rating.Picker',
            'criterion.controller.recruiting.JobPostingCandidateForm',
            'criterion.store.EmailLayouts'
        ],

        controller : {
            type : 'criterion_recruiting_job_posting_candidate_form',
            externalUpdate : false
        },

        bind : {
            title : '{record.candidate.firstName} {record.candidate.lastName} / {record.jobPostingTitle}'
        },

        listeners : {
            show : 'handleShow',
            afterSave : 'handleSendEmail'
        },

        viewModel : {
            data : {
                createEmployee : false,
                sendEmailEnabled : false,
                sendEmailRejStatus : false,
                candidateStatus : null
            },
            stores : {
                recruitingEmails : {
                    type : 'criterion_email_layouts'
                }
            },
            formulas : {
                showSendEmail : function(get) {
                    return get('sendEmailEnabled') && get('sendEmailRejStatus');
                },
                isRejection : function(get) {
                    var status = get('statusCombo.selection');

                    return status && status.get('attribute1') == 0;
                }
            }
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : 'auto'
            }
        ],
        draggable : true,

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        defaults : criterion.Consts.UI_CONFIG.ONE_COL_FORM,

        bodyPadding : '25 10',

        initComponent : function() {
            this.items = [
                {
                    xtype : 'container',
                    layout : 'hbox',
                    items : [
                        {
                            xtype : 'label',
                            cls : 'x-form-item-label x-form-item-label-default  x-unselectable',
                            html : '<span class="x-form-item-label-inner x-form-item-label-inner-default">Rating&nbsp;</span>',
                            width : criterion.Consts.UI_DEFAULTS.LABEL_WIDTH
                        },
                        {
                            xtype : 'rating',
                            family : 'Ionicons',
                            glyphs : [GLYPH['ios7-star'], GLYPH['ios7-star']],
                            rounding : 0.5,
                            minimum : 0,
                            scale : '2em',
                            bind : '{record.rating}'
                        }
                    ],
                    margin : '0 0 5 0'
                },
                {
                    xtype : 'criterion_code_detail_field',
                    fieldLabel : i18n.gettext('Status'),
                    name : 'candidateStatusCd',
                    bind : '{record.candidateStatusCd}',
                    reference : 'statusCombo',
                    codeDataId : DICT.CANDIDATE_STATUS,
                    listeners : {
                        change : 'handleCandidateStatusChange',
                        select : 'handleCandidateStatusSelect'
                    }
                },
                {
                    xtype : 'criterion_code_detail_field',
                    fieldLabel : i18n.gettext('Reason'),
                    name : 'rejectionReasonCd',
                    codeDataId : DICT.REJECTION_REASON,
                    allowBlank : false,
                    bind : {
                        value : '{record.rejectionReasonCd}',
                        disabled : '{!isRejection}',
                        hidden : '{!isRejection}'
                    }
                },
                {
                    xtype : 'toggleslidefield',
                    fieldLabel : i18n.gettext('Send email'),
                    reference : 'sendEmail',
                    value : false,
                    bind : {
                        hidden : '{!showSendEmail}'
                    }
                }
            ];

            this.callParent(arguments);
        }
    };

});

