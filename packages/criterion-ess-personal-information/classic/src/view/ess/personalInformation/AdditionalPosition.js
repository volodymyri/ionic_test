Ext.define('criterion.view.ess.personalInformation.AdditionalPosition', function() {

    return {
        alias : 'widget.criterion_selfservice_personal_information_additional_position',

        extend : 'criterion.view.employee.Position',

        requires : [
            'criterion.controller.ess.personalInformation.AdditionalPosition'
        ],

        controller : {
            type : 'criterion_selfservice_personal_information_additional_position'
        },

        title : i18n.gettext('Additional Position'),

        cls : 'criterion-ess-panel',

        frame : true,

        bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.TWO_TIER_FORM,

        viewModel : {
            data : {
                viewOnly : true
            }
        }

    };

});
