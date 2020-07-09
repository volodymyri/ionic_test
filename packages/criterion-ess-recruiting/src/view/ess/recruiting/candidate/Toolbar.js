Ext.define('criterion.view.ess.recruiting.candidate.Toolbar', function() {

    return {

        alias : 'widget.criterion_selfservice_recruiting_candidate_toolbar',

        extend : 'Ext.Toolbar',

        layout : 'hbox',

        items : [
            {
                xtype : 'button',
                enableToggle : true,
                pressed : true,
                allowDepress : false,
                toggleGroup : 'detailSection',
                cls : 'criterion-plain-toggle-btn',
                text : i18n.gettext('Details'),
                ref : 'candidateDetail',
                handler : 'handleShowDetails'
            },
            {
                xtype : 'button',
                enableToggle : true,
                pressed : false,
                allowDepress : false,
                toggleGroup : 'detailSection',
                cls : 'criterion-plain-toggle-btn',
                text : i18n.gettext('Interview'),
                ref : 'candidateInterview',
                handler : 'handleShowCandidateInterview'
            },
            {
                xtype : 'button',
                enableToggle : true,
                pressed : false,
                allowDepress : false,
                toggleGroup : 'detailSection',
                cls : 'criterion-plain-toggle-btn',
                text : i18n.gettext('Resume'),
                ref : 'candidateResume',
                handler : 'handleShowResume'
            },
            {
                xtype : 'button',
                enableToggle : true,
                pressed : false,
                allowDepress : false,
                toggleGroup : 'detailSection',
                cls : 'criterion-plain-toggle-btn',
                text : i18n.gettext('Question Responses'),
                ref : 'candidateQuestionResponses',
                handler : 'handleShowQuestionResponses'
            },
            {
                xtype : 'button',
                enableToggle : true,
                pressed : false,
                allowDepress : false,
                toggleGroup : 'detailSection',
                cls : 'criterion-plain-toggle-btn',
                text : i18n.gettext('Cover Letter'),
                ref : 'candidateCoverLetter',
                handler : 'handleShowCoverLetter'
            },
            {
                xtype : 'button',
                enableToggle : true,
                pressed : false,
                allowDepress : false,
                toggleGroup : 'detailSection',
                cls : 'criterion-plain-toggle-btn',
                text : i18n.gettext('Profile'),
                ref : 'candidateAdditionalDetails',
                handler : 'handleShowAdditionalDetails'
            },
            {
                xtype : 'button',
                enableToggle : true,
                pressed : false,
                allowDepress : false,
                toggleGroup : 'detailSection',
                cls : 'criterion-plain-toggle-btn',
                text : i18n.gettext('Notes'),
                ref : 'candidateNotes',
                handler : 'handleShowNotes'
            }
        ],

        setPressedBtn() {
            let paths = Ext.History.getToken().split('/'),
                path = paths[paths.length - 1],
                btn;

            btn = this.down('[ref=' + path + ']');
            btn && btn.setPressed(true);
        }
    }
});
