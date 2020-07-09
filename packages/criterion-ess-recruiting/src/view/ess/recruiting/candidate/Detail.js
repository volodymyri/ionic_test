Ext.define('criterion.view.ess.recruiting.candidate.Detail', function() {

    const GLYPH = criterion.consts.Glyph;

    return {
        alias : 'widget.criterion_selfservice_recruiting_candidate_detail',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.ess.recruiting.candidate.Detail',
            'criterion.view.ess.recruiting.candidate.Toolbar'
        ],

        controller : {
            type : 'criterion_selfservice_recruiting_candidate_detail'
        },

        listeners : {
            activate : 'handleActivate'
        },

        frame : true,

        bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.ONE_TIER_FORM,

        header : {
            title : {
                bind : {
                    text : '{jobPosting.title} &bull; {jobPostingCandidate.candidate.firstName} {jobPostingCandidate.candidate.lastName}'
                },
                minimizeWidth : true
            }
        },

        tbar : {
            xtype : 'criterion_selfservice_recruiting_candidate_toolbar'
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
                                        xtype : 'container',

                                        items : [
                                            {
                                                xtype : 'textfield',
                                                fieldLabel : i18n.gettext('Location'),
                                                bind : {
                                                    value : '{jobPostingCandidate.candidate.location}'
                                                },
                                                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDTH,
                                                readOnly : true
                                            },
                                            {
                                                xtype : 'criterion_code_detail_field',
                                                fieldLabel : i18n.gettext('Status'),
                                                codeDataId : criterion.consts.Dict.CANDIDATE_STATUS,
                                                bind : {
                                                    value : '{jobPostingCandidate.candidateStatusCd}'
                                                },
                                                readOnly : true,
                                                editable : false
                                            }
                                        ]
                                    },
                                    {
                                        items : [
                                            {
                                                xtype : 'datefield',
                                                fieldLabel : i18n.gettext('Applied Date'),
                                                readOnly : true,
                                                bind : {
                                                    value : '{jobPostingCandidate.appliedDate}'
                                                }
                                            },
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
                                                        xtype : 'criterion_rating',
                                                        family : 'Ionicons',
                                                        glyphs : [GLYPH['ios7-star'], GLYPH['ios7-star']],
                                                        rounding : 0.5,
                                                        minimum : 0,
                                                        scale : '2em',
                                                        readOnly : true,
                                                        trackOver : false,
                                                        forViewOnly : true,
                                                        bind : '{jobPostingCandidate.rating}'
                                                    }
                                                ],
                                                margin : '0 0 5 0'
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
                        minHeight : 200,
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
                                        fieldLabel : i18n.gettext('Cover Letter Text'),
                                        padding : '20 50 25 15',
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
                                            value : '{jobPostingCandidate.coverLetter}'
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
