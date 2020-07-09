Ext.define('criterion.view.settings.benefits.OpenEnrollments', function() {

    return {
        alias : 'widget.criterion_settings_open_enrollments',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.controller.settings.benefits.OpenEnrollments',
            'criterion.view.settings.benefits.openEnrollment.OpenEnrollment',
            'criterion.store.employer.OpenEnrollments'
        ],

        controller : {
            type : 'criterion_settings_open_enrollment_grid',
            connectParentView : {
                parentForSpecified : true
            },
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_open_enrollment',
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        viewModel : {
            data : {
                selectionCount : 0
            }
        },

        store : {
            type : 'criterion_employer_open_enrollments'
        },

        title : i18n.gettext('Open Enrollments'),

        selModel : {
            selType : 'checkboxmodel',
            listeners : {
                scope : 'controller',
                selectionchange : 'handleSelectionChange'
            }
        },

        tbar : [
            {
                xtype : 'criterion_settings_employer_bar',
                reference : 'employerSelector',
                context : 'criterion_settings'
            },
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Clone'),
                cls : 'criterion-btn-feature',
                hidden : true,
                bind : {
                    hidden : '{!selectionCount}'
                },
                handler : 'handleClone'
            },
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                handler : 'handleAddClick'
            },
            {
                xtype : 'button',
                reference : 'refreshButton',
                cls : 'criterion-btn-transparent',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium',
                handler : 'handleRefreshClick'
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                dataIndex : 'name',
                text : i18n.gettext('Name'),
                flex : 1
            },
            {
                xtype : 'datecolumn',
                dataIndex : 'startDate',
                text : i18n.gettext('Start Date'),
                flex : 1
            },
            {
                xtype : 'datecolumn',
                dataIndex : 'endDate',
                text : i18n.gettext('End Date'),
                flex : 1
            }
        ]
    };

});
