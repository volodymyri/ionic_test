Ext.define('criterion.view.recruiting.JobPostingCandidateNoteForm', function() {

    return {

        alias : 'widget.criterion_recruiting_job_posting_candidate_note_form',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.recruiting.JobPostingCandidateNoteForm'
        ],

        controller : {
            type : 'criterion_recruiting_job_posting_candidate_note_form',
            externalUpdate : false
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                height : 'auto',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
            }
        ],

        title : i18n.gettext('Note'),

        viewModel : {
            formulas : {
                hideSave : function(data) {
                    return !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_NOTES, criterion.SecurityManager.UPDATE, false, true));
                },

                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_NOTES, criterion.SecurityManager.DELETE, false, true));
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
                xtype : 'fieldcontainer',
                layout : 'hbox',
                fieldLabel : i18n.gettext('Date / Time'),
                requiredMark : true,
                items : [
                    {
                        xtype : 'datefield',
                        name : 'notesDateDate',
                        fieldLabel : '',
                        hideLabel : true,
                        allowBlank : false,
                        bind : '{record.notesDateDate}',
                        margin : '0 10 0 0',
                        listeners : {
                            change : 'changeNotesDateDate'
                        }
                    },
                    {
                        xtype : 'timefield',
                        name : 'notesDateTime',
                        fieldLabel : '',
                        hideLabel : true,
                        bind : '{record.notesDateTime}',
                        allowBlank : false,
                        flex : 1,
                        listeners : {
                            change : 'changeNotesDateTime'
                        }
                    }
                ],
                margin : '0 0 15 0'
            },

            {
                xtype : 'criterion_code_detail_field',
                fieldLabel : i18n.gettext('Type'),
                name : 'candidateNotesCd',
                bind : '{record.candidateNotesCd}',
                codeDataId : criterion.consts.Dict.CANDIDATE_NOTES
            },
            {
                xtype : 'textarea',
                fieldLabel : i18n.gettext('Notes'),
                name : 'notes',
                height : 300,
                bind : '{record.notes}'
            }
        ]
    };

});
