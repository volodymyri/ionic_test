Ext.define('criterion.view.recruiting.candidate.SkillForm', function() {

    return {
        alias : 'widget.criterion_recruiting_candidate_skill_form',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.model.candidate.Skill'
        ],

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,
                height : 'auto'
            }
        ],

        viewModel : {
            links : {
                record : {
                    type : 'criterion.model.candidate.Skill',
                    create : true
                }
            },
            formulas : {
                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_PROFILE, criterion.SecurityManager.DELETE, false, true));
                }
            }
        },

        closable : true,

        scrollable : true,

        title : i18n.gettext('Skill'),

        allowDelete : true,

        bodyPadding : 20,

        controller : {
            externalUpdate : false
        },

        defaults : {
            xtype : 'fieldcontainer'
        },

        fieldDefaults : {
            labelAlign : 'left',
            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDTH,
            width : '100%'
        },

        items : [
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Skill'),
                bind : '{record.skill}',
                name : 'skill'
            }
        ]
    };
});
