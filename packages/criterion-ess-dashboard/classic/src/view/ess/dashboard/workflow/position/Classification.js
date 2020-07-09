Ext.define('criterion.view.ess.dashboard.workflow.position.Classification', function() {

    var DICT = criterion.consts.Dict;

    return {

        alias : 'widget.criterion_selfservice_workflow_position_classification',

        extend : 'criterion.ux.Panel',

        items : [
            {
                xtype : 'numberfield',
                name : 'averageHours',
                fieldLabel : i18n.gettext('Hours per Day')
            },
            {
                xtype : 'numberfield',
                name : 'averageDays',
                fieldLabel : i18n.gettext('Days per Week')
            },
            {
                xtype : 'numberfield',
                name : 'averageWeeks',
                fieldLabel : i18n.gettext('Weeks per Year')
            },
            {
                xtype : 'toggleslidefield',
                name : 'isHighSalary',
                fieldLabel : i18n.gettext('HCE')
            },
            {
                xtype : 'toggleslidefield',
                name : 'isSeasonal',
                fieldLabel : i18n.gettext('Seasonal')
            },
            {
                xtype : 'toggleslidefield',
                name : 'isOfficer',
                fieldLabel : i18n.gettext('Officer')
            },
            {
                xtype : 'toggleslidefield',
                name : 'isManager',
                fieldLabel : i18n.gettext('Manager')
            },
            {
                xtype : 'criterion_code_detail_field',
                name : 'officerCodeCd',
                codeDataId : DICT.OFFICER_CODE,
                fieldLabel : i18n.gettext('Officer Code')
            },
            {
                xtype : 'textfield',
                name : 'org1PositionId'
            },
            {
                xtype : 'textfield',
                name : 'org2PositionId'
            },
            {
                xtype : 'textfield',
                name : 'org3PositionId'
            },
            {
                xtype : 'textfield',
                name : 'org4PositionId'
            }
        ]
    }
});
