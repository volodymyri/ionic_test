Ext.define('criterion.view.recruiting.candidate.CoverLetter', function() {

    return {
        alias : 'widget.criterion_recruiting_candidate_cover_letter',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.recruiting.candidate.CoverLetter',
            'criterion.model.Candidate',
            'Ext.ux.IFrame'
        ],

        listeners : {
            activate : 'handleActivate'
        },

        controller : {
            type : 'criterion_recruiting_candidate_cover_letter'
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
                    title : i18n.gettext('Cover Letter'),

                    items : [
                        {
                            xtype : 'button',
                            tooltip : i18n.gettext('Attach Cover Letter'),
                            cls : ['criterion-btn-transparent'],
                            glyph : criterion.consts.Glyph['android-attach'],
                            handler : 'handleAddCoverLetterClick'
                        },
                        {
                            xtype : 'button',
                            tooltip : i18n.gettext('Cover Letter Text'),
                            cls : ['criterion-btn-transparent'],
                            glyph : criterion.consts.Glyph['document-text'],
                            handler : 'handleShowCoverLetterAsText'
                        },
                        {
                            xtype : 'button',
                            tooltip : i18n.gettext('Download Cover Letter'),
                            cls : ['criterion-btn-transparent', 'ios7-download-outline'],
                            glyph : criterion.consts.Glyph['ios7-download-outline'],
                            scale : 'small',
                            hidden : true,
                            margin : '0 20 0 0',
                            bind : {
                                hidden : criterion.SecurityManager.getComplexSecurityFormula({
                                    append : '!candidate.hasCoverLetter ||',
                                    rules : [
                                        {
                                            key : criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_COVER_LETTER_DOWNLOAD,
                                            actName : criterion.SecurityManager.ACT,
                                            reverse : true
                                        }
                                    ]
                                })
                            },
                            listeners : {
                                click : 'handleDownloadCoverLetterClick'
                            }
                        }
                    ]
                },

                items : [
                    {
                        xtype : 'uxiframe',
                        reference : 'coverLetterIframe',
                        hidden : true,
                        bind : {
                            hidden : '{!candidate.hasCoverLetter}'
                        }
                    },
                    {
                        xtype : 'component',
                        reference : 'coverLetterTextArea',
                        hidden : true,
                        padding : 10,
                        bind : {
                            html : '{candidate.coverLetterText}',
                            hidden : '{candidate.hasCoverLetter}'
                        }
                    }
                ]

            }
        ]
    };

});
