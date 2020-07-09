Ext.define('criterion.view.recruiting.candidate.Resume', function() {

    return {
        alias : 'widget.criterion_recruiting_candidate_resume',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.recruiting.candidate.Resume',
            'criterion.model.Candidate',
            'Ext.ux.IFrame'
        ],

        listeners : {
            activate : 'handleActivate'
        },

        controller : {
            type : 'criterion_recruiting_candidate_resume'
        },

        viewModel : {
            data : {
                blockParseResume : true,
                parseInProgress : false
            }
        },

        layout : 'fit',

        scrollable : 'vertical',

        items : [
            {
                xtype : 'panel',

                cls : 'transparent-bg-header minimized-header',
                margin : '15 0 0 20',
                layout : 'fit',
                width : '100%',

                header : {
                    title : i18n.gettext('Resume'),

                    items : [
                        {
                            xtype : 'button',
                            tooltip : i18n.gettext('Add Resume'),
                            cls : ['criterion-btn-transparent', 'plus'],
                            glyph : criterion.consts.Glyph['plus'],
                            scale : 'small',
                            hidden : true,
                            bind : {
                                hidden : criterion.SecurityManager.getComplexSecurityFormula({
                                    append : 'candidate.hasResume ||',
                                    rules : [
                                        {
                                            key : criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_RESUME,
                                            actName : criterion.SecurityManager.CREATE,
                                            reverse : true
                                        }
                                    ]
                                })
                            },
                            handler : 'handleAddResume'
                        },
                        {
                            xtype : 'button',
                            tooltip : i18n.gettext('Parse Resume'),
                            cls : ['criterion-btn-transparent', 'document-text'],
                            glyph : criterion.consts.Glyph['code-download'],
                            scale : 'small',
                            hidden : true,
                            bind : {
                                hidden : criterion.SecurityManager.getComplexSecurityFormula({
                                    append : '!candidate.hasResume || blockParseResume ||',
                                    rules : [
                                        {
                                            key : criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_RESUME_PARSE,
                                            actName : criterion.SecurityManager.ACT,
                                            reverse : true
                                        }
                                    ]
                                })
                            },
                            handler : 'handleParseResume'
                        },
                        {
                            xtype : 'component',
                            html : '<span class="blink-text fs-07">' + i18n._('The resume parsing in progress...') + '</span>',
                            margin : '0 10 0 0',
                            hidden : true,
                            bind : {
                                hidden : '{!parseInProgress}'
                            }
                        },
                        {
                            xtype : 'button',
                            tooltip : i18n.gettext('Download Resume'),
                            cls : ['criterion-btn-transparent', 'ios7-download-outline'],
                            glyph : criterion.consts.Glyph['ios7-download-outline'],
                            scale : 'small',
                            hidden : true,
                            margin : '0 20 0 0',
                            bind : {
                                hidden : criterion.SecurityManager.getComplexSecurityFormula({
                                    append : '!candidate.hasResume ||',
                                    rules : [
                                        {
                                            key : criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_RESUME_DOWNLOAD,
                                            actName : criterion.SecurityManager.ACT,
                                            reverse : true
                                        }
                                    ]
                                })
                            },
                            handler : 'handleDownloadResume'
                        }
                    ]
                },

                items : [
                    {
                        xtype : 'uxiframe',
                        reference : 'resumeIframe'
                    }
                ]

            }
        ]
    };

});
