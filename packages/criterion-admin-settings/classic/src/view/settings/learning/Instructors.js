Ext.define('criterion.view.settings.learning.Instructors', {

    alias : 'widget.criterion_settings_learning_instructors',

    extend : 'criterion.view.settings.GridView',

    requires : [
        'criterion.store.learning.Instructors',
        'criterion.view.settings.learning.Instructor',
        'criterion.controller.employer.GridView'
    ],

    controller : {
        type : 'criterion_gridview',
        showTitleInConnectedViewMode : true,
        connectParentView : {
            parentForSpecified : true
        },
        reloadAfterEditorSave : true,
        reloadAfterEditorDelete : true,
        editor : {
            xtype : 'criterion_settings_learning_instructor',
            allowDelete : true,
            plugins : [
                {
                    ptype : 'criterion_sidebar'
                }
            ]
        }
    },

    title : i18n.gettext('Instructors'),

    store : {
        type : 'criterion_learning_instructors'
    },

    columns : [
        {
            xtype : 'gridcolumn',
            text : i18n.gettext('Name'),
            flex : 1,
            dataIndex : 'name'
        },
        {
            xtype : 'gridcolumn',
            text : i18n.gettext('Company'),
            flex : 1,
            dataIndex : 'company'
        },
        {
            xtype : 'gridcolumn',
            text : i18n.gettext('Phone Number'),
            flex : 1,
            dataIndex : 'phoneNumber'
        }
    ]
});
