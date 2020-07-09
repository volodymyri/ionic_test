/**
 * @deprecated not used
 */
Ext.define('criterion.view.person.Jobs', function () {

    return {
        alias : 'widget.criterion_person_jobs',

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
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        title : i18n.gettext('Jobs'),

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
                width : 100
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('End Date'),
                dataIndex : 'endDate',
                width : 100
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
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Notes'),
                dataIndex : 'notes',
                flex : 1
            },
            {
                xtype : 'criterion_actioncolumn',
                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                items : [
                    {
                        glyph : criterion.consts.Glyph['ios7-trash-outline'],
                        tooltip : i18n.gettext('Delete'),
                        action : 'removeaction'
                    }
                ]
            }
        ]
    };

});
