Ext.define('criterion.view.person.Education', function() {

    const currentDate = new Date();

    return {
        alias : 'widget.criterion_person_education',

        extend : 'criterion.view.FormView',

        title : i18n.gettext('Education'),

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        viewModel : {
            formulas : {
                hideSave : function(data) {
                    return !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_EDUCATION, criterion.SecurityManager.UPDATE, false, true));
                },

                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_EDUCATION, criterion.SecurityManager.DELETE, false, true));
                }
            }
        },

        items : [
            {
                xtype : 'criterion_panel',

                layout : 'hbox',
                ui : 'clean',

                plugins : [
                    'criterion_responsive_column'
                ],

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDE,

                items : [
                    {
                        ui : 'clean',
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('School Name'),
                                name : 'schoolName',
                                bind : {
                                    value : '{record.schoolName}',
                                    readOnly : '{readOnly}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Field of Study'),
                                name : 'fieldOfStudy',
                                allowBlank : true,
                                bind : {
                                    value : '{record.fieldOfStudy}',
                                    readOnly : '{readOnly}'
                                }
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Start Date'),
                                name : 'startDate',
                                maxValue : currentDate,
                                allowBlank : true,
                                bind : {
                                    value : '{record.startDate}',
                                    readOnly : '{readOnly}'
                                }
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('End Date'),
                                name : 'endDate',
                                maxValue : currentDate,
                                allowBlank : true,
                                bind : {
                                    value : '{record.endDate}',
                                    readOnly : '{readOnly}'
                                }
                            }
                        ]
                    },
                    {
                        ui : 'clean',
                        items : [
                            {
                                xtype: 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Degree'),
                                codeDataId: criterion.consts.Dict.DEGREE,
                                name : 'degreeCd',
                                allowBlank : true,
                                bind : {
                                    value : '{record.degreeCd}',
                                    readOnly : '{readOnly}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Additional Degree Information'),
                                name : 'additionalDegreeInformation',
                                allowBlank : true,
                                bind : {
                                    value : '{record.additionalDegreeInformation}',
                                    readOnly : '{readOnly}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Activities'),
                                name : 'activities',
                                allowBlank : true,
                                bind : {
                                    value : '{record.activities}',
                                    readOnly : '{readOnly}'
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };

});
