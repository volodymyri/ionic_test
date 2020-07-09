Ext.define('criterion.view.settings.performanceReviews.reviewPeriod.goal.Form', function() {

    return {

        alias : 'widget.criterion_settings_performance_reviews_review_period_goal_form',

        extend : 'criterion.view.person.Goal',

        requires : [
            'criterion.controller.settings.performanceReviews.reviewPeriod.goal.Form'
        ],

        controller : {
            type : 'criterion_settings_performance_reviews_review_period_goal_form',
            externalUpdate : false
        },

        noButtons : true,

        listeners : {
            scope : 'controller',
            deleteGoal : 'handleDeleteGoal',
            saveGoal : 'handleSaveGoal'
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
                    reference : 'employeeSelector',
                    fieldLabel : i18n.gettext('Employee'),
                    disabled : true,
                    bind : {
                        store : '{goalEmployees}',
                        value : '{record.employeeId}',
                        disabled : '{!isPhantom}'
                    },
                    queryMode: 'local',
                    editable : true,

                    valueField : 'id',
                    displayField : 'fullName',

                    listeners : {
                        change : 'handleEmployeeChange'
                    }
                }
            ]
        }
    }
});
