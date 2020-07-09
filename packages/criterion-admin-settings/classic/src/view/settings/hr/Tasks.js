Ext.define('criterion.view.settings.hr.Tasks', function() {

    return {
        alias : 'widget.criterion_settings_tasks',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.controller.settings.hr.Tasks',
            'criterion.store.employer.Tasks',
            'criterion.store.employer.Classifications',
            'criterion.store.employer.TaskClassifications'
        ],

        viewModel : {
            stores : {
                tasks : {
                    type : 'criterion_employer_tasks'
                },
                codes : {
                    type : 'criterion_employer_classifications'
                },
                tasks_classifications : {
                    type : 'criterion_employer_task_classifications'
                }
            }
        },

        title : i18n._('Tasks'),

        layout: 'fit',

        listeners : {
            scope : 'controller',
            activate : 'handleActivate',
            show : 'onShow'
        },

        controller : {
            type : 'criterion_settings_tasks',
            showTitleInConnectedViewMode : true,
            connectParentView : {
                parentForSpecified : true
            }
        },

        columns : [
            // dynamically added
        ]
    };

});
