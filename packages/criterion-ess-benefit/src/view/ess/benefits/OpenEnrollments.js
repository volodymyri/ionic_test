Ext.define('criterion.view.ess.benefits.OpenEnrollments', function() {

    var DICT = criterion.consts.Dict;

    return {
        alias : 'widget.criterion_selfservice_benefits_open_enrollments',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.ess.benefits.OpenEnrollments',
            'criterion.view.ess.openEnrollment.OpenEnrollment',
            'criterion.store.employer.OpenEnrollments'
        ],

        viewModel : {
            stores : {
                activeOpenEnrollments : {
                    type : 'criterion_employer_open_enrollments'
                }
            }
        },

        bind : {
            store : '{activeOpenEnrollments}'
        },

        controller : {
            type : 'criterion_selfservice_benefits_open_enrollments',
            baseRoute : criterion.consts.Route.SELF_SERVICE.BENEFITS_OPEN_ENROLLMENTS,
            loadRecordOnEdit : false,
            editor : {
                xtype : 'criterion_selfservice_open_enrollment',
                plugins : {
                    ptype : 'criterion_sidebar'
                }
            }
        },

        tbar : null,

        header : {

            title : i18n.gettext('Open Enrollment'),

            items : [
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'button',
                    reference : 'refreshButton',
                    cls : 'criterion-btn-glyph-only',
                    glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                    scale : 'medium',
                    listeners : {
                        click : 'handleRefreshClick'
                    }
                }
            ]
        },

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
            },
            {
                xtype : 'criterion_codedatacolumn',
                dataIndex : 'employeeOpenEnrollmentStatusCd',
                codeDataId : DICT.WORKFLOW_STATE,
                unselectedText : '',
                text : i18n.gettext('Status'),
                flex : 1
            }
        ]
    };

});
