Ext.define('criterion.view.person.PersonPicker', function() {

    return {
        extend : 'criterion.view.RecordPicker',

        requires : [
            'criterion.store.searchEmployee.Employees'
        ],

        searchFields : [
            {
                fieldName : 'firstName', displayName : i18n.gettext('First Name')
            },
            {
                fieldName : 'lastName', displayName : i18n.gettext('Last Name')
            },
            {
                fieldName : 'middleName', displayName : i18n.gettext('Middle Name')
            },
            {
                fieldName : 'email', displayName : i18n.gettext('Email')
            }
        ],

        columns : [
            {
                text : i18n.gettext('First Name'),
                dataIndex : 'firstName',
                flex : 1
            },
            {
                text : i18n.gettext('Last Name'),
                dataIndex : 'lastName',
                flex : 1
            },
            {
                text : i18n.gettext('Middle Name'),
                dataIndex : 'middleName',
                flex : 1
            },
            {
                text : i18n.gettext('Email'),
                dataIndex : 'email',
                flex : 2
            }
        ],

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : '50%',
                width : criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH
            }
        ],

        constructor : function(config) {
            var extraParams = {};

            if (config && config.personId) {
                extraParams['personId'] = config.personId;
            }

            if (config && typeof config.canRehireOnly !== 'undefined') {
                extraParams['canRehireOnly'] = !!config.canRehireOnly;
            }

            if (config && typeof config.short !== 'undefined') {
                extraParams['short'] = !!config.short;
            }

            this.store = (config && config.store) ? config.store : Ext.create('criterion.store.searchEmployee.Employees', {
                pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                remoteSort : true,
                proxy : {
                    extraParams : extraParams
                }
            });

            this.callParent(arguments);
        }
    };

});
