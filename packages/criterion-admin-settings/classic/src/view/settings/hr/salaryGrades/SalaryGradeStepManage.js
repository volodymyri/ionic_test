Ext.define('criterion.view.settings.hr.salaryGrades.SalaryGradeStepManage', function() {

    return {

        alias : 'widget.criterion_settings_salary_grade_step_manage',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.settings.hr.salaryGrades.SalaryGradeStepManage'
        ],

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : '85%',
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
            }
        ],
        draggable : true,

        bodyPadding : 0,

        viewModel : {
            data : {
                currentGradeGroup : null,
                currentGradeStore : null,
                currentGradeSteps : null,
                gradeType : null,
                employerId : null
            }
        },

        controller : {
            type : 'criterion_settings_salary_grade_step_manage'
        },

        layout : 'fit',

        title : i18n.gettext('Manage Salary Steps'),

        buttons : [
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                scale : 'small',
                handler : 'onCancel'
            },
            {
                xtype : 'button',
                text : i18n.gettext('Save'),
                cls : 'criterion-btn-primary',
                reference : 'saveBtn',
                disabled : 1,
                scale : 'small',
                handler : 'onSaveHandler'
            }
        ],

        items : [
            {
                xtype : 'criterion_gridpanel',
                rowEditing : false,

                useDefaultActionColumn : false,
                useDefaultTbar : false,

                reference : 'grid',

                columns : [
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Name'),
                        flex : 1,
                        dataIndex : 'salaryGradeCd',
                        editor : false,
                        renderer : function(value, metaData, record) {
                            return record.get('description');
                        },
                        sortable : false,
                        menuDisabled : true
                    },
                    {
                        xtype : 'checkcolumn',
                        width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                        text : i18n.gettext('Enabled'),
                        flex : 0,
                        dataIndex : 'selected',
                        editor : false,
                        sortable : false,
                        menuDisabled : true
                    }
                ]
            }
        ]
    }
});
