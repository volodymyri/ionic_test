Ext.define('criterion.view.recruiting.candidate.Details', function() {

    const GLYPH = criterion.consts.Glyph;

    return {

        alias : 'widget.criterion_recruiting_candidate_details',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.recruiting.candidate.Details',
            'Ext.layout.container.Border',
            'Ext.layout.container.Column',
            'criterion.ux.rating.Picker',
            'criterion.view.recruiting.candidate.CandidateForm',
            'criterion.ux.plugin.Affix',
            'Ext.grid.column.Template',
            'criterion.view.recruiting.CandidateJobPostingPanel'
        ],

        controller : {
            type : 'criterion_recruiting_candidate_details'
        },

        viewModel : {
            data : {
                currentJobPostingCandidate : null
            },

            formulas : {
                candidatesCountText : {
                    bind : {
                        bindTo : '{detailsGrid.selection}',
                        deep : true
                    },
                    get : function() {
                        let view = this.getView(),
                            detailsGrid = view.lookup('detailsGrid'),
                            store = detailsGrid.getStore(),
                            count = store.count();

                        return Ext.util.Format.format('{0} {1}', store.count(), i18n.ngettext('Candidate', 'Candidates', count));
                    }
                }
            }
        },

        layout : 'border',

        bodyPadding : 0,

        items : [
            {
                xtype : 'panel',
                region : 'west',
                cls : 'criterion-side-panel',
                split : false,
                width : 300,
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },

                defaults : {
                    xtype : 'container',
                    cls : 'info'
                },

                items : [
                    {
                        xtype : 'button',
                        text : i18n.gettext('Back'),
                        textAlign : 'left',
                        padding : '17 25 16 20',
                        glyph : GLYPH['chevron-left'],
                        cls : 'criterion-btn-transparent',
                        handler : 'handleGoBack'
                    },
                    {
                        layout : {
                            type : 'vbox',
                            align : 'stretch'
                        },

                        padding : '25 25 0 25',

                        items : [
                            {
                                xtype : 'component',
                                cls : 'highlight',
                                bind : {
                                    html : '<span class="candidates-count">{candidatesCountText}</span>'
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'grid',
                        flex : 1,
                        border : true,
                        reference : 'detailsGrid',
                        hideHeaders : true,

                        columns : [
                            {
                                xtype : 'templatecolumn',
                                tpl : Ext.create('Ext.XTemplate', '{[this.getInfo(values)]}'
                                    + '<div>{appliedDate:date("m/d/Y")} {[this.getStatus(values.jobPostingId, values.candidateStatus)]}</div>'
                                    + '<fieldset class="rating">'
                                    + '{[this.generateRating(values.jobPostingId, 5, values.rating)]}'
                                    + '</fieldset>', {
                                    getInfo : val => Ext.util.Format.format(
                                        '<div class="highlight">{0}</div><div>{1}</div>',
                                        Ext.String.htmlEncode(val.candidate.firstName + ' ' + val.candidate.lastName),
                                        val.jobPostingId ? Ext.String.htmlEncode(val.candidate.location) : val.candidate.email
                                    ),
                                    generateRating : (jobPostingId, count, rating) => {
                                        let html = '';

                                        if (jobPostingId) {
                                            for (let i = 0; i < count; i++) {
                                                html += Ext.util.Format.format('<label class="{0}"></label>', i >= count - rating ? 'selected' : '')
                                                    + Ext.util.Format.format('<label class="half {0}"></label>', count - rating > i && count - rating < i + 1 ? 'selected' : '');
                                            }
                                        }

                                        return html;
                                    },
                                    getStatus : (jobPostingId, status) => jobPostingId ? '- ' + status : ''
                                }),
                                flex : 1
                            }
                        ]
                    }

                ]
            },
            {
                xtype : 'criterion_panel',
                region : 'center',
                hidden : true,
                cls : 'topDetails',

                bind : {
                    hidden : '{!detailsGrid.selection}'
                },

                dockedItems : [
                    {
                        xtype : 'criterion_recruiting_candidate_job_posting_panel',
                        dock : 'top',
                        margin : '10 0',
                        cls : 'topInfoBar',
                        listeners : {
                            jobPostingCandidateChanged : 'onJobPostingCandidateChanged',
                            candidateUpdated : 'onCandidateUpdated'
                        }
                    }
                ],

                layout : 'vbox',

                items : [
                    {
                        xtype : 'container',
                        width : '100%',
                        height : '100%',
                        layout : 'fit',
                        flex : 1,
                        items : [
                            {
                                xtype : 'criterion_recruiting_candidate_form',
                                reference : 'candidateForm',
                                itemId : 'candidateForm',

                                responsiveConfig : criterion.Utils.createResponsiveConfig([
                                    {
                                        rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.MINIMAL,
                                        config : {
                                            tabPosition : 'top',
                                            tabStretchMax : true,
                                            minTabWidth : 1
                                        }
                                    },

                                    {
                                        rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.MTMINIMAL,
                                        config : {
                                            tabPosition : 'left',
                                            minTabWidth : 1
                                        }
                                    }
                                ]),

                                cls : 'criterion_recruiting_navigation',
                                plain : true,

                                tabBar : {
                                    minWidth : 0
                                },
                                useRouter : false,
                                viewModel : {
                                    data : {
                                        hideToolbar : true
                                    }
                                },
                                bind : {
                                    candidateId : '{detailsGrid.selection.candidateId}'
                                },

                                listeners : {
                                    jpCandidateChanged : 'onJpCandidateChanged'
                                }
                            }
                        ]
                    }
                ]
            }
        ],

        loadData(candidateId, candidates, jobPostingCandidates) {
            this.getController().loadData(candidateId, candidates, jobPostingCandidates)
        }
    };

});
