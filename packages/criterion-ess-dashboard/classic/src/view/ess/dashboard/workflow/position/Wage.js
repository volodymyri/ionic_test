Ext.define('criterion.view.ess.dashboard.workflow.position.Wage', function() {

    var DICT = criterion.consts.Dict;

    return {

        alias : 'widget.criterion_selfservice_workflow_position_wage',

        extend : 'criterion.ux.Panel',

        items : [
            {
                xtype : 'criterion_code_detail_field',
                name : 'salaryGroupCd',
                codeDataId : DICT.SALARY_GROUP,
                fieldLabel : i18n.gettext('Salary Group')
            },
            {
                xtype : 'textfield',
                name : 'minSalaryGrade',
                fieldLabel : i18n.gettext('Salary Grade (Min)')
            },
            {
                xtype : 'textfield',
                name : 'maxSalaryGrade',
                fieldLabel : i18n.gettext('Salary Grade (Max)')
            },
            {
                xtype : 'toggleslidefield',
                name : 'isSalary',
                fieldLabel : i18n.gettext('Salary')
            },
            {
                xtype : 'criterion_code_detail_field',
                name : 'rateUnitCd',
                codeDataId : DICT.RATE_UNIT,
                fieldLabel : i18n.gettext('Pay Rate Unit')
            },
            {
                xtype : 'criterion_currencyfield',
                name : 'payRate',
                fieldLabel : i18n.gettext('Target Pay Rate'),
                isRatePrecision : true,
                useGlobalFormat : false,
                currencySymbol : '$',
                thousandSeparator : ',',
                decimalSeparator : '.',
                decimalPrecision : 0,
                currencySymbolPos : false
            }
        ]
    }
});
