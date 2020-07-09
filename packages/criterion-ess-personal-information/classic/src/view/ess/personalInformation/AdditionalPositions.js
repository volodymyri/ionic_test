Ext.define('criterion.view.ess.personalInformation.AdditionalPositions', function() {

    return {
        alias : 'widget.criterion_selfservice_personal_information_additional_positions',

        extend : 'criterion.view.employee.Positions',

        requires : [
            'criterion.controller.ess.personalInformation.AdditionalPositions'
        ],

        frame : true,

        header : {

            title : i18n.gettext('Additional Position'),

            items : [
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'button',
                    reference : 'refreshButton',
                    cls : 'criterion-btn-glyph-only',
                    glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                    scale : 'medium',
                    listeners : {
                        click : 'handleRefreshClick'
                    }
                }
            ]
        },

        controller : {
            type : 'criterion_selfservice_personal_information_additional_positions',
            baseRoute : criterion.consts.Route.SELF_SERVICE.PERSONAL_INFORMATION_POSITIONS
        }
    };

});
