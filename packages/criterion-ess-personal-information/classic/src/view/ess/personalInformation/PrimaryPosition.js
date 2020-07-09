Ext.define('criterion.view.ess.personalInformation.PrimaryPosition', function() {

    return {
        alias : 'widget.criterion_selfservice_personal_information_primary_position',

        extend : 'criterion.view.employee.Position',

        title : i18n.gettext('Primary Position'),

        frame : true,

        bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.TWO_TIER_FORM,

        cls : 'criterion-ess-panel',

        ui : 'no-footer',

        viewModel : {
            data : {
                showCustomfields : false
            }
        }
    };

});
