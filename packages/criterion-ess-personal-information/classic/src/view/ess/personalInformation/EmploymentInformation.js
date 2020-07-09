Ext.define('criterion.view.ess.personalInformation.EmploymentInformation', function() {

    return {
        alias : 'widget.criterion_selfservice_personal_information_employment_information',

        extend : 'criterion.view.employee.demographic.Employment',

        requires : [
            'criterion.controller.ess.personalInformation.EmploymentInformation'
        ],

        controller : 'criterion_selfservice_personal_information_employment_information',

        title : i18n.gettext('Employment Information'),

        viewModel : {
            data : {
                showCustomfields : false
            }
        },

        frame : true,

        bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.ONE_TIER_FORM,

        ui : 'no-footer',

        buttons : null,

        skipDirtyConfirmation : true,

        initComponent : function() {
            this.callParent(arguments);

            this.getForm().getFields().each(function(cmp) {
                cmp.setReadOnly(true);
            });

            this.getViewModel().set('isReadOnly', true);
            this.down('[reference=reportingStructures]').setDisabled(true);
            this.down('[reference=selectWorkLocation]').setDisabled(true);
        }
    };

});
