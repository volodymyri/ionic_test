Ext.define('criterion.view.person.Educations', function () {

    return {
        alias : 'widget.criterion_person_educations',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.person.GridView',
            'criterion.store.person.Educations'
        ],

        uses : [
            'criterion.view.person.Education'
        ],

        store : {
            type : 'criterion_person_educations'
        },

        controller : {
            type : 'criterion_person_gridview',
            editor : {
                xtype : 'criterion_person_education',
                allowDelete : true,
                controller : {
                    externalUpdate : false
                },
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        title : i18n.gettext('Education'),

        tbar : [
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                },
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_EDUCATION, criterion.SecurityManager.CREATE, true)
                }
            },
            '->',
            {
                xtype : 'button',
                reference : 'refreshButton',
                cls : 'criterion-btn-transparent',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium',
                listeners : {
                    click : 'handleRefreshClick'
                }
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('School Name'),
                dataIndex : 'schoolName',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Field of Study'),
                dataIndex : 'fieldOfStudy',
                flex : 1
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Start Date'),
                dataIndex : 'startDate',
                width : 130
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('End Date'),
                dataIndex : 'endDate',
                width : 130
            },
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('Degree'),
                codeDataId : criterion.consts.Dict.DEGREE,
                dataIndex : 'degreeCd',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Activities'),
                dataIndex : 'activities',
                flex : 1
            }
        ]
    };

});
