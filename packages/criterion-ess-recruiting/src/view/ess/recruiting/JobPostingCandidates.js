Ext.define('criterion.view.ess.recruiting.JobPostingCandidates', function() {

    var GLYPH = criterion.consts.Glyph;

    return {

        alias : 'widget.criterion_selfservice_recruiting_job_posting_candidates',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.ess.recruiting.JobPostingCandidates',
            'criterion.store.employer.jobPosting.Candidates',
            'criterion.ux.rating.Picker'
        ],

        viewModel : {
            stores : {
                jobPostingCandidates : {
                    type : 'criterion_job_posting_candidates',
                    proxy : {
                        extraParams : {
                            jobPostingId : '{jobPostingId}'
                        }
                    },
                    listeners : {
                        load : 'onJobPostingCandidatesLoad'
                    }
                }
            }
        },

        controller : {
            type : 'criterion_selfservice_recruiting_job_posting_candidates'
        },

        bind : {
            store : '{jobPostingCandidates}'
        },

        tbar : null,

        frame : true,

        header : {
            title : {
                bind : {
                    text : Ext.String.format('{0} {1}', i18n.gettext('Candidates for'), ' {jobPosting.title}')
                }
            },
            items : [
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'toggleslidefield',
                    reference : 'showInactiveSelect',
                    labelWidth : 100,
                    fieldLabel : i18n.gettext('Show Inactive'),
                    listeners : {
                        change : 'handleChangeShowInactive'
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

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('First Name'),
                dataIndex : 'firstName',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Last Name'),
                dataIndex : 'lastName',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Location'),
                dataIndex : 'location',
                flex : 1
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Applied Date'),
                dataIndex : 'appliedDate',
                width : 140
            },
            {
                xtype : 'criterion_codedatacolumn',
                dataIndex : 'candidateStatusCd',
                codeDataId : criterion.consts.Dict.CANDIDATE_STATUS,
                text : i18n.gettext('Status'),
                flex : 1
            },
            {
                xtype : 'widgetcolumn',
                dataIndex : 'rating',
                text : i18n.gettext('Rating'),
                width : 130,
                widget : {
                    xtype : 'criterion_rating',
                    family : 'Ionicons',
                    glyphs : [GLYPH['ios7-star'], GLYPH['ios7-star']],
                    rounding : 0.5,
                    minimum : 0,
                    trackOver : false,
                    forViewOnly : true
                }
            }
        ]
    };

});
