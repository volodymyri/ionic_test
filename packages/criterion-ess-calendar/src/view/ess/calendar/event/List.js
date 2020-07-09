Ext.define('criterion.view.ess.calendar.event.List', function() {

    return {

        alias : 'widget.criterion_selfservice_calendar_event_list',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.employer.CompanyEvents',
            'criterion.store.employer.companyEvent.Details',

            'criterion.controller.ess.calendar.event.List',
            'criterion.view.ess.calendar.event.Form'
        ],

        controller : {
            type : 'criterion_selfservice_calendar_event_list',
            connectParentView : false,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,

            editor : {
                xtype : 'criterion_selfservice_calendar_event_form'
            }
        },

        viewModel : {
            stores : {
                compEvents : {
                    type : 'criterion_employer_company_events',
                    proxy : {
                        url : criterion.consts.Api.API.EMPLOYER_COMPANY_EVENT_FOR_EMPLOYEE,
                        extraParams : {
                            employeeId : '{employeeId}'
                        }
                    },
                    filters : [
                        {
                            property : 'canPostEss',
                            value : true
                        }
                    ]
                },
                events : {
                    type : 'criterion_employer_company_event_details',
                    proxy : {
                        url : criterion.consts.Api.API.EMPLOYER_COMPANY_EVENT_DETAIL_FOR_EMPLOYEE,
                        extraParams : {
                            employeeId : '{employeeId}'
                        }
                    },
                    sorters : [
                        {
                            property : 'date',
                            direction : 'ASC'
                        }
                    ]
                }
            }
        },

        title : null,

        bind : {
            store : '{events}'
        },

        tbar : null,

        columns : [
            {
                xtype : 'datecolumn',
                width : 150,
                text : i18n.gettext('Date'),
                dataIndex : 'date'
            },
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Event Calendar'),
                dataIndex : 'companyEventName'
            },
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Description'),
                dataIndex : 'description'
            }
        ]
    };
});
