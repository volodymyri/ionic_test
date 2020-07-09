Ext.define('criterion.view.ess.performance.TeamGoal', function() {

    return {
        alias : 'widget.criterion_selfservice_performance_team_goal',

        extend : 'criterion.view.ess.performance.Goal',

        requires : [
            'criterion.controller.ess.performance.TeamGoal'
        ],

        controller : {
            type : 'criterion_selfservice_performance_team_goal'
        },

        viewModel : {
            data : {
                hidePlaceholder : true
            }
        },

        getAdditionalFields() {
            return [
                {
                    xtype : 'combobox',
                    fieldLabel : i18n.gettext('Employee'),
                    disabled : true,
                    bind : {
                        store : '{teamEmployees}',
                        value : '{record.employeeId}',
                        disabled : '{!isPhantom}'
                    },
                    queryMode: 'local',
                    editable : true,

                    valueField : 'id',
                    displayField : 'fullName',

                    listeners : {
                        change : 'handleEmployeeChange'
                    },

                    allowBlank : false
                }
            ]
        }
    }
});
