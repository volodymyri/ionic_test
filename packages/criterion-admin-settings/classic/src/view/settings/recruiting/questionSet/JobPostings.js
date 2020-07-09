Ext.define('criterion.view.settings.recruiting.questionSet.JobPostings', function() {

    return {
        alias : 'widget.criterion_settings_recruiting_question_set_job_postings',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.employer.JobPostings',
            'criterion.controller.settings.recruiting.questionSet.JobPostings'
        ],

        tbar : null,

        controller : {
            type : 'criterion_settings_recruiting_question_set_job_postings'
        },

        viewModel : {
            stores : {
                jobPostings : {
                    type : 'criterion_employer_job_postings',
                    remoteFilters : true,
                    remoteSort : false,
                    sorters : [
                        {
                            property : 'title',
                            direction : 'ASC'
                        }
                    ],
                    proxy : {
                        extraParams : {
                            employerId : '{questionSet.employerId}'
                        }
                    },
                    listeners : {
                        load : 'handleJobPostingsLoaded'
                    }
                }
            }
        },

        bind : {
            store : '{jobPostings}'
        },

        title : i18n.gettext('Question Set') + ' -> ' + i18n.gettext('Jobs'),

        bodyPadding : 0,
        closable : true,
        modal : true,
        alwaysOnTop : true,

        plugins : [
            {
                ptype : 'criterion_sidebar',
                height : '70%',
                width : '70%',
                modal : true
            }
        ],

        buttons : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                handler : 'handleCancel'
            },
            {
                xtype : 'button',
                cls : 'criterion-btn-primary',
                text : i18n.gettext('Update'),
                handler : 'handleUpdate'
            }
        ],

        selModel : {
            selType : 'checkboxmodel',
            mode : 'MULTI'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Requisition #'),
                dataIndex : 'requisitionCode',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Title'),
                dataIndex : 'title',
                flex : 1
            }

        ]
    };

});
