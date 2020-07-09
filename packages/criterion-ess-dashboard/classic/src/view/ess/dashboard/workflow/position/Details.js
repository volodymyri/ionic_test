Ext.define('criterion.view.ess.dashboard.workflow.position.Details', function() {

    var DICT = criterion.consts.Dict;

    return {

        alias : 'widget.criterion_selfservice_workflow_position_details',

        extend : 'criterion.ux.Panel',

        items : [
            {
                xtype : 'textfield',
                name : 'code',
                fieldLabel : i18n.gettext('Code')
            },
            {
                xtype : 'textfield',
                name : 'jobDescription',
                fieldLabel : i18n.gettext('Job')
            },
            {
                xtype : 'textfield',
                name : 'title',
                fieldLabel : i18n.gettext('Title')
            },
            {
                xtype : 'textfield',
                name : 'employerWorkLocation',
                fieldLabel : i18n.gettext('Location')
            },
            {
                xtype : 'criterion_code_detail_field',
                name : 'departmentCd',
                codeDataId : DICT.DEPARTMENT,
                fieldLabel : i18n.gettext('Department')
            },
            {
                xtype : 'criterion_code_detail_field',
                fieldLabel : i18n.gettext('Division'),
                codeDataId : DICT.DIVISION,
                name : 'divisionCd'
            },
            {
                xtype : 'criterion_code_detail_field',
                fieldLabel : i18n.gettext('Section'),
                codeDataId : DICT.SECTION,
                name : 'sectionCd'
            },
            {
                xtype : 'criterion_code_detail_field',
                name : 'costCenterCd',
                codeDataId : DICT.COST_CENTER,
                fieldLabel : i18n.gettext('Cost Center')
            },
            {
                xtype : 'textfield',
                name : 'fullTimeEquivalency',
                fieldLabel : i18n.gettext('Full Time Equivalency')
            },
            {
                xtype : 'toggleslidefield',
                name : 'isActive',
                fieldLabel : i18n.gettext('Active')
            },
            {
                xtype : 'toggleslidefield',
                name : 'isExempt',
                fieldLabel : i18n.gettext('Exempt')
            },
            {
                xtype : 'criterion_code_detail_field',
                name : 'positionTypeCd',
                codeDataId : DICT.POSITION_TYPE,
                fieldLabel : i18n.gettext('Type')
            },
            {
                xtype : 'criterion_code_detail_field',
                name : 'eeocCd',
                codeDataId : DICT.EEOC,
                fieldLabel : i18n.gettext('EEO Category')
            },
            {
                xtype : 'textfield',
                name : 'workPeriod',
                fieldLabel : i18n.gettext('Work Period')
            },
            {
                xtype : 'criterion_code_detail_field',
                name : 'categoryCd',
                codeDataId : DICT.POSITION_CATEGORY,
                fieldLabel : i18n.gettext('Category')
            },
            {
                xtype : 'criterion_code_detail_field',
                name : 'workersCompensationCd',
                codeDataId : DICT.WORKERS_COMPENSATION,
                fieldLabel : i18n.gettext('Workers Compensation')
            }
        ]
    }
});
