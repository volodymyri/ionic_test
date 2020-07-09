Ext.define('criterion.view.recruiting.candidate.AwardForm', function() {

    return {
        alias : 'widget.criterion_recruiting_candidate_award_form',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.model.candidate.Award'
        ],

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,
                height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT
            }
        ],

        viewModel : {
            links : {
                record : {
                    type : 'criterion.model.candidate.Award',
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

        title : i18n.gettext('Award'),

        allowDelete : true,

        controller : {
            externalUpdate : false
        },

        bodyPadding : 20,

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
                items : [
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Title'),
                                bind : '{record.title}',
                                name : 'title'
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Award Date'),
                                bind : '{record.awardDate}',
                                name : 'awardDate',
                                width : '50%'
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'container',
                flex : 1,
                layout : 'fit',
                items : [
                    {
                        xtype : 'htmleditor',
                        reference : 'description',
                        enableAlignments : false,
                        fieldLabel : i18n.gettext('Description'),
                        padding : '0 5 20 0',
                        bind : {
                            value : '{record.description}'
                        }
                    }
                ]
            }
        ]
    };
});
