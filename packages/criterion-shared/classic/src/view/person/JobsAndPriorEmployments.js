Ext.define('criterion.view.person.JobsAndPriorEmployments', function () {

    return {
        alias : 'widget.criterion_person_jobsandprioremployments',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.person.JobsAndPriorEmployments',
            'criterion.view.person.Jobs',
            'criterion.view.person.PriorEmployments'
        ],

        controller : {
            type : 'criterion_person_jobandprioremployments'
        },

        listeners : {
            scope : 'controller',
            activate : 'handleActivate'
        },

        layout : {
            type : 'accordion',
            titleCollapse : true,
            animate : true
        },

        title : i18n.gettext('Job and Prior Employment'),

        items : [
            {
                xtype : 'criterion_person_jobs',
                reference : 'jobs'
            },
            {
                xtype: 'criterion_person_prioremployments',
                reference : 'prioremployments'
            }
        ]
    };

});