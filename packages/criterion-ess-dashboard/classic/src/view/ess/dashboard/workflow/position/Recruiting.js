Ext.define('criterion.view.ess.dashboard.workflow.position.Recruiting', function() {

    var DICT = criterion.consts.Dict;

    return {

        alias : 'widget.criterion_selfservice_workflow_position_recruiting',

        extend : 'criterion.ux.Panel',

        items : [
            {
                xtype : 'criterion_code_detail_field',
                name : 'educationCd',
                codeDataId : DICT.EDUCATION,
                fieldLabel : i18n.gettext('Education')
            },
            {
                xtype : 'criterion_code_detail_field',
                name : 'experienceCd',
                codeDataId : DICT.EXPERIENCE,
                fieldLabel : i18n.gettext('Experience')
            },
            {
                xtype : 'criterion_code_detail_field',
                name : 'securityClearanceCd',
                codeDataId : DICT.SECURITY_CLEARANCE,
                fieldLabel : i18n.gettext('Security Clearance')
            },
            {
                xtype : 'criterion_code_detail_field',
                name : 'travelRequirementsCd',
                codeDataId : DICT.TRAVEL_REQUIREMENTS,
                fieldLabel : i18n.gettext('Travel Requirements')
            },
            {
                xtype : 'criterion_code_detail_field',
                name : 'workFromHomeCd',
                codeDataId : DICT.WORK_FROM_HOME,
                fieldLabel : i18n.gettext('Work from Home')
            },
            {
                xtype : 'criterion_code_detail_field',
                name : 'dressCd',
                codeDataId : DICT.DRESS,
                fieldLabel : i18n.gettext('Dress / Attire')
            },
            {
                xtype : 'htmleditor',
                name : 'description',
                fieldLabel : i18n.gettext('Description'),
                enableFont : false
            }
        ]
    }
});
