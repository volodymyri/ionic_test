Ext.define('criterion.view.ess.resources.CompanyDirectory', {

    alias : 'widget.criterion_selfservice_resources_company_directory',

    extend : 'criterion.view.GridView',

    requires : [
        'criterion.store.person.DirectorySearch',
        'criterion.controller.ess.resources.CompanyDirectory',
        'criterion.ux.form.field.Search'
    ],

    controller : {
        type : 'criterion_selfservice_resources_company_directory'
    },

    viewModel : {
        data : {
            searchStr : null
        },
        stores : {
            directorySearch : {
                type : 'criterion_person_directory_search',
                pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                proxy : {
                    extraParams : {
                        searchStr : '{searchStr}'
                    }
                }
            }
        }
    },

    bind : {
        store : '{directorySearch}'
    },

    cls : 'criterion-grid-panel-simple-list',

    header : {

        title : i18n.gettext('Company Directory'),

        items : [
            {
                xtype : 'tbfill'
            },
            {
                xtype : 'criterion_search_field',
                reference : 'searchStr',
                listeners : {
                    change : 'handleChangeSearchStr'
                },
                bind : {
                    value : '{searchStr}'
                },
                emptyText : i18n.gettext('Search for employees')
            }
        ]
    },

    tbar : null,

    dockedItems : [
        {
            xtype : 'criterion_toolbar_paging',
            dock : 'bottom',
            displayInfo : true,
            bind : {
                store : '{directorySearch}'
            }
        }
    ],

    columns : [
        {
            xtype : 'gridcolumn',
            text : i18n.gettext('First Name'),
            dataIndex : 'firstName',
            flex : 2
        },
        {
            xtype : 'gridcolumn',
            text : i18n.gettext('Last Name'),
            dataIndex : 'lastName',
            flex : 2
        },
        {
            xtype : 'gridcolumn',
            text : i18n.gettext('Title'),
            dataIndex : 'title',
            flex : 1
        },
        {
            xtype : 'gridcolumn',
            text : i18n.gettext('Work Location'),
            dataIndex : 'workLocation',
            flex : 1
        },
        {
            xtype : 'gridcolumn',
            text : i18n.gettext('Work Phone'),
            dataIndex : 'workPhoneInternational',
            flex : 1
        },
        {
            xtype : 'gridcolumn',
            text : i18n.gettext('Mobile Phone'),
            dataIndex : 'mobilePhoneInternational',
            flex : 1
        },
        {
            xtype : 'gridcolumn',
            text : i18n.gettext('Email'),
            dataIndex : 'email',
            flex : 1
        }
    ]

});

