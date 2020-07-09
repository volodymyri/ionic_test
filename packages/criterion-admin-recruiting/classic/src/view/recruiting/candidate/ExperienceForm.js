Ext.define('criterion.view.recruiting.candidate.ExperienceForm', function() {

    return {
        alias : 'widget.criterion_recruiting_candidate_experience_form',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.model.candidate.Experience',
            'Ext.layout.container.Column'
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
                    type : 'criterion.model.candidate.Experience',
                    create : true
                }
            },
            formulas : {
                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_PROFILE, criterion.SecurityManager.DELETE, false, true));
                }
            }
        },

        closable : false,

        scrollable : true,

        title : i18n.gettext('Employment History'),

        allowDelete : true,

        controller : {
            externalUpdate : false
        },

        bodyPadding : 20,

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
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Company'),
                                bind : '{record.company}',
                                name : 'company'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Location'),
                                bind : '{record.location}',
                                name : 'location'
                            }
                        ]
                    },
                    {
                        layout : 'column',

                        defaults : {
                            columnWidth : 0.5
                        },

                        fieldDefaults : {
                            width : '100%'
                        },

                        items : [
                            {
                                margin : '0 10 0 0',
                                items : [
                                    {
                                        xtype : 'datefield',
                                        fieldLabel : i18n.gettext('Start Date'),
                                        bind : '{record.startDate}',
                                        name : 'startDate'
                                    }
                                ]
                            },
                            {
                                items : [
                                    {
                                        xtype : 'datefield',
                                        fieldLabel : i18n.gettext('End Date'),
                                        bind : '{record.endDate}',
                                        name : 'endDate'
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
