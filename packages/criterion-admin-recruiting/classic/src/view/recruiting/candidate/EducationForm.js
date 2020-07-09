Ext.define('criterion.view.recruiting.candidate.EducationForm', function() {

    return {
        alias : 'widget.criterion_recruiting_candidate_education_form',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.model.candidate.Education'
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
                    type : 'criterion.model.candidate.Education',
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

        title : i18n.gettext('Education'),

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
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('School'),
                        bind : '{record.school}',
                        name : 'school'
                    },
                    {
                        xtype : 'criterion_code_detail_field',
                        fieldLabel : i18n.gettext('Degree'),
                        codeDataId : criterion.consts.Dict.DEGREE,
                        name : 'degreeCd',
                        bind : '{record.degreeCd}'
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Field of Study'),
                        bind : '{record.fieldOfStudy}',
                        name : 'fieldOfStudy'
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('GPA'),
                        bind : '{record.gpa}',
                        name : 'gpa'
                    }
                ]
            },
            {
                layout : 'hbox',

                items : [
                    {
                        xtype : 'datefield',
                        fieldLabel : i18n.gettext('Start Date'),
                        bind : '{record.startDate}',
                        name : 'startDate',
                        padding : '0 10 0 0',
                        width : '50%'
                    },
                    {
                        xtype : 'datefield',
                        fieldLabel : i18n.gettext('End Date'),
                        bind : '{record.endDate}',
                        name : 'endDate',
                        width : '50%'
                    }
                ]
            },
            {
                items : [
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Additional Degree Information'),
                        bind : '{record.additionalDegreeInformation}',
                        name : 'additionalDegreeInformation'
                    },
                    {
                        xtype : 'textarea',
                        fieldLabel : i18n.gettext('Activities'),
                        bind : '{record.activities}',
                        name : 'activities'
                    }
                ]
            }
        ]
    };
});
