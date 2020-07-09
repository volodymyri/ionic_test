Ext.define('criterion.view.PositionPicker', function() {

    return {
        extend : 'criterion.view.RecordPicker',

        requires : [
            'criterion.view.RecordPicker',
            'criterion.store.position.Search',

            'Ext.grid.filters.Filters',
            'criterion.ux.grid.filters.filter.CodeData'
        ],

        title : i18n.gettext('Search for Position'),

        searchFields : [
            {
                fieldName : 'code', displayName : i18n.gettext('Code')
            },
            {
                fieldName : 'title', displayName : i18n.gettext('Title')
            }
        ],

        gridPlugins : 'gridfilters',

        columns : [
            {
                dataIndex : 'code',
                text : i18n.gettext('Code'),
                flex : 1,
                filter : true
            },
            {
                dataIndex : 'title',
                text : i18n.gettext('Title'),
                flex : 1,
                filter : true
            },
            {
                dataIndex : 'locationDescription',
                text : i18n.gettext('Location'),
                flex : 1,
                filter : true
            },
            {
                xtype : 'criterion_codedatacolumn',
                codeDataId : criterion.consts.Dict.DEPARTMENT,
                text : i18n.gettext('Department'),
                dataIndex : 'departmentCd',
                flex : 1,
                filter : {
                    type : 'codedata'
                }
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Employer'),
                flex : 1,
                dataIndex : 'employerLegalName',
                filter : {
                    type : 'employer'
                }
            }
        ],

        constructor : function(conf) {
            var me = this,
                extraParams = {};

            conf = conf || {};

            if (typeof conf.employerId !== 'undefined') {
                extraParams.employerId = conf.employerId;
            }

            if (typeof conf.isUnassigned !== 'undefined') {
                extraParams.isUnassigned = !!conf.isUnassigned;
            }

            if (typeof conf.isActive !== 'undefined') {
                extraParams.isActive = !!conf.isActive;
            }

            if (Ext.isDefined(conf.isApproved)) {
                extraParams.isApproved = !!conf.isApproved;
            }

            me.store = Ext.create('criterion.store.position.Search', {
                pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                proxy : {
                    extraParams : extraParams
                },
                remoteSort : true,
                remoteFilter : true
            });

            me.callParent(arguments);
        }
    };

});
