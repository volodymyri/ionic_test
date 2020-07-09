Ext.define('criterion.view.settings.hr.salaryGrades.SalaryGradeManage', function() {

    return {
        alias : 'widget.criterion_settings_salary_grade_manage',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.settings.hr.salaryGrades.SalaryGradeManage',
            'criterion.store.SalaryGradesGradeOnly',
            'Ext.ux.form.ItemSelector'
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
            type : 'criterion_settings_salary_grade_manage'
        },

        layout : 'fit',

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
                xtype : 'panel',
                layout : 'fit',
                items : [
                    {
                        xtype : 'itemselector',
                        title : i18n.gettext('Manage Salary Grades'),
                        store : Ext.create('Ext.data.ArrayStore', {
                            fields : ['id', 'description', 'sequence'],
                            data : []
                        }),
                        cls : 'criterion-itemselector',
                        imagePath : '../ux/images/',
                        reference : 'itemselector',
                        displayField : 'description',
                        valueField : 'id',
                        fromTitle : i18n.gettext('Available grades'),
                        toTitle : i18n.gettext('Selected grades'),
                        listeners : {
                            scope : 'controller',
                            change : 'onSelectionChange'
                        }
                    }
                ]
            }
        ]
    }
});
