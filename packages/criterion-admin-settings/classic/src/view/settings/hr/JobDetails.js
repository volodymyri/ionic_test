Ext.define('criterion.view.settings.hr.JobDetails', function() {

    var JOB_COURSE_TYPE = criterion.Consts.JOB_COURSE_TYPE;

    return {

        alias : 'widget.criterion_settings_job_details',

        extend : 'criterion.view.FormView',

        controller : {
            externalUpdate : false
        },

        plugins : [
            {
                ptype : 'criterion_sidebar'
            }
        ],

        title : i18n.gettext('Job details'),

        listeners : {
            scope : 'controller'
        },

        bodyPadding : 0,

        items : [
            {
                xtype : 'criterion_panel',

                plugins : [
                    'criterion_responsive_column'
                ],

                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },

                bodyPadding : '25 20',

                items : [
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Code'),
                        name : 'code',
                        allowBlank : false
                    },
                    {
                        xtype : 'htmleditor',
                        enableAlignments : false,
                        fieldLabel : i18n.gettext('Description'),
                        name : 'description',
                        allowBlank : false
                    }
                ]
            }
        ]
    }

});
