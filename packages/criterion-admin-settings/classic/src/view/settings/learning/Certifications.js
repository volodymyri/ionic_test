Ext.define('criterion.view.settings.learning.Certifications', {

    alias : 'widget.criterion_settings_learning_certifications',

    extend : 'criterion.view.settings.employer.GridView',

    requires : [
        'criterion.store.employer.Certifications',
        'criterion.view.settings.learning.Certification'
    ],

    controller : {
        type : 'criterion_employer_gridview',
        showTitleInConnectedViewMode : true,
        connectParentView : {
            parentForSpecified : true
        },
        reloadAfterEditorSave : true,
        reloadAfterEditorDelete : true,
        editor : {
            xtype : 'criterion_settings_learning_certification',
            allowDelete : true,
            plugins : [
                {
                    ptype : 'criterion_sidebar'
                }
            ]
        }
    },

    title : i18n.gettext('Certification'),

    store : {
        type : 'criterion_employer_certifications'
    },

    initComponent : function() {
        this.columns = [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                flex : 1,
                dataIndex : 'name'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Min Courses Required'),
                flex : 1,
                dataIndex : 'minCoursesRequired'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Validity Period'),
                flex : 1,
                dataIndex : 'validityPeriod'
            }
        ];

        this.callParent(arguments);
    }

});
