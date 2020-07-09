Ext.define('criterion.view.ess.personalInformation.AssignmentHistory', function() {

    return {
        alias : 'widget.criterion_selfservice_personal_information_assignment_history',

        extend : 'criterion.view.employee.AssignmentHistory',

        requires : [
            'criterion.view.ess.personalInformation.PositionsView'
        ],

        viewModel : {
            data : {
                allowEdit : false
            }
        },

        cls : 'criterion-ess-panel',

        ui : 'no-footer',

        frame : true,

        header : {

            title : i18n.gettext('Position History'),

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
            suppressIdentity : ['employeeContext'],
            baseRoute : criterion.consts.Route.SELF_SERVICE.PERSONAL_INFORMATION_ASSIGNMENT_HISTORY,
            editor : {
                type : 'criterion_selfservice_personal_information_positions_view',
                showCustomfields : false,
                hideDelete : true,
                frame : true,
                cls : 'criterion-ess-panel',
                bind : {
                    title : i18n.gettext('Position History')
                },
                isPartOfESS : true
            }
        }

    }
});
