Ext.define('criterion.view.settings.hr.SalaryGrades', function() {

    var DICT = criterion.consts.Dict;

    return {
        alias : 'widget.criterion_settings_salary_grades',

        extend : 'Ext.Panel',

        requires : [
            'criterion.ux.grid.PanelExtended',
            'criterion.controller.settings.hr.SalaryGrades',
            'criterion.store.SalaryGradesGradeOnly',
            'criterion.store.SalaryGradesGradeStep'
        ],

        title : i18n.gettext('Salary Grades'),

        layout : {
            type : 'border'
        },

        controller : {
            type : 'criterion_settings_salary_grades'
        },

        listeners : {
            scope : 'controller',
            activate : 'onActivate'
        },

        viewModel : {
            data : {
                hasManageSteps : false
            }
        },

        scrollable : false,

        tbar : {
            padding : 0,
            items : [
                {
                    xtype : 'criterion_settings_employer_bar',
                    context : 'criterion_settings',
                    padding : '10 25'
                }
            ]
        },

        items : [
            {
                xtype : 'container',
                layout : 'vbox',
                region : 'north',
                margin : 15,
                items : [
                    {
                        xtype : 'panel',
                        collapsible : false,
                        height : 50,
                        bodyPadding : 10,
                        layout : 'hbox',
                        items : [
                            {
                                xtype : 'criterion_code_detail_field',
                                codeDataId : DICT.SALARY_GROUP,
                                reference : 'salaryGroupData',
                                fieldLabel : i18n.gettext('Group Name'),
                                name : 'salaryGroup',
                                allowBlank : false,
                                editable : false,
                                listeners : {
                                    select : 'handleGroupSelect'
                                }
                            },
                            {
                                xtype : 'button',
                                text : i18n.gettext('Manage Grades'),
                                margin : '0 0 0 10',
                                cls : 'criterion-btn-feature',
                                scale : 'small',
                                handler : 'handleManageGrades'
                            },
                            {
                                xtype : 'button',
                                text : i18n.gettext('Manage Steps'),
                                hidden : true,
                                bind : {
                                    hidden : '{!hasManageSteps}'
                                },
                                margin : '0 0 0 10',
                                cls : 'criterion-btn-feature',
                                scale : 'small',
                                handler : 'handleManageSteps'
                            }
                        ]
                    },
                    {
                        xtype : 'criterion_code_detail_field',
                        codeDataId : DICT.RATE_UNIT,
                        reference : 'frequencyData',
                        fieldLabel : i18n.gettext('Frequency'),
                        name : 'frequency',
                        allowBlank : false,
                        editable : false,
                        padding : 10,
                        listeners : {
                            select : 'handleFrequencySelect'
                        }
                    }
                ]
            },
            {
                xtype : 'criterion_gridpanel_extended',
                region : 'center',
                rowEditing : false,
                useDefaultActionColumn : false,
                useDefaultTbar : false,

                reference : 'grid',

                viewModel : {
                    stores : {
                        gradeOnly : {
                            type : 'criterion_salary_grades_grade_only'
                        },
                        gradeStep : {
                            type : 'criterion_salary_grades_grade_step'
                        }
                    },
                    data : {
                        lastGradeType : null
                    }
                },

                tbar : null,

                viewConfig : {
                    markDirty : false
                },

                columns : [],

                buttons : [
                    {
                        xtype : 'button',
                        text : i18n.gettext('Save'),
                        cls : 'criterion-btn-primary',
                        reference : 'saveBtn',
                        disabled : true,
                        scale : 'small',
                        handler : 'onSave'
                    }
                ]
            }
        ]
    };

});
