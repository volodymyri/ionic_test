Ext.define('criterion.view.person.CoursePicker', function() {

    return {
        extend : 'criterion.view.RecordPicker',

        requires : [
            'criterion.view.RecordPicker',
            'criterion.store.learning.CourseSearch',

            'Ext.grid.filters.Filters',
            'criterion.ux.grid.filters.filter.CodeData'
        ],

        title : i18n.gettext('Search for Course'),

        searchFields : [
            {
                fieldName : 'code', displayName : i18n.gettext('Code')
            },
            {
                fieldName : 'name', displayName : i18n.gettext('Name')
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
                dataIndex : 'name',
                text : i18n.gettext('Name'),
                flex : 1,
                filter : true
            },
            {
                dataIndex : 'employerName',
                text : i18n.gettext('Employer'),
                flex : 1
            },
            {
                xtype : 'criterion_codedatacolumn',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                text : i18n.gettext('Delivery'),
                codeDataId : criterion.consts.Dict.COURSE_DELIVERY,
                dataIndex : 'courseTypeCd'
            }
        ],

        constructor : function(conf) {
            var me = this,
                extraParams = {};

            conf = conf || {};

            if (typeof conf.employerId !== 'undefined') {
                extraParams.employerId = conf.employerId;
            }

            if (typeof conf.isActive !== 'undefined') {
                extraParams.isActive = !!conf.isActive;
            }

            me.store = Ext.create('criterion.store.learning.CourseSearch', {
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
