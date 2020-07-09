Ext.define('criterion.view.employee.EmployeePicker', function() {

    return {
        extend : 'criterion.view.RecordPicker',

        requires : [
            'criterion.view.RecordPicker',
            'criterion.store.search.Employees',
            'Ext.grid.filters.Filters'
        ],

        title : i18n.gettext('Search for Employee'),

        searchFields : [
            {
                fieldName : 'lastName', displayName : i18n.gettext('Last Name')
            },
            {
                fieldName : 'firstName', displayName : i18n.gettext('First Name')
            },
            {
                fieldName : 'middleName', displayName : i18n.gettext('Middle Name')
            },
            {
                fieldName : 'employeeNumber', displayName : i18n.gettext('Employee Number')
            },
            {
                fieldName : 'positionTitle', displayName : i18n.gettext('Title')
            }
        ],

        gridPlugins : 'gridfilters',

        columns : [
            {
                text : i18n.gettext('Last Name'),
                dataIndex : 'lastName',
                flex : 1,
                filter : true
            },
            {
                text : i18n.gettext('First Name'),
                dataIndex : 'firstName',
                flex : 1,
                filter : true
            },
            {
                text : i18n.gettext('Middle Name'),
                dataIndex : 'middleName',
                flex : 1
            },
            {
                text : i18n.gettext('Employer'),
                dataIndex : 'employerName',
                flex : 1
            },
            {
                text : i18n.gettext('Employee Number'),
                dataIndex : 'employeeNumber',
                flex : 1
            },
            {
                text : i18n.gettext('Hire Date'),
                dataIndex : 'hireDate',
                renderer : Ext.util.Format.dateRenderer(criterion.consts.Api.DATE_FORMAT),
                flex : 1
            },
            {
                text : i18n.gettext('Title'),
                dataIndex : 'positionTitle',
                flex : 1,
                filter : true
            }
        ],

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                width : criterion.Consts.UI_DEFAULTS.MODAL_NORMAL_WIDTH,
                height : criterion.Consts.UI_DEFAULTS.MODAL_NORMAL_HEIGHT
            }
        ],

        constructor : function(conf) {
            var extraParams = {};

            if (conf && conf.extraParams && Ext.isObject(conf.extraParams)) {
                extraParams = Ext.Object.merge(extraParams, conf.extraParams);
            }

            if (conf && conf.employerId) {
                extraParams['employerId'] = conf.employerId;
            }
            if (conf && typeof conf.isUnassigned !== 'undefined') {
                extraParams['isUnassigned'] = !!conf.isUnassigned;
            }
            if (conf && typeof conf.isActive !== 'undefined') {
                extraParams['isActive'] = !!conf.isActive;
            }
            if (conf && typeof conf.canRehireOnly !== 'undefined') {
                extraParams['canRehireOnly'] = !!conf.canRehireOnly;
            }
            if (conf && typeof conf.eligibleForTransfer !== 'undefined') {
                extraParams['eligibleForTransfer'] = !!conf.eligibleForTransfer;
            }

            this.store = Ext.create(conf && Ext.isString(conf.storeClass) ? conf.storeClass : 'criterion.store.search.Employees', {
                pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                remoteSort : true,
                remoteFilter : true,
                proxy : {
                    extraParams : extraParams
                }
            });

            this.callParent(arguments);
        }
    };

});
