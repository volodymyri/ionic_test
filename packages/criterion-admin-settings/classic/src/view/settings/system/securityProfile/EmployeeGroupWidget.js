Ext.define('criterion.view.settings.system.securityProfile.EmployeeGroupWidget', function() {

    return {

        alias : 'widget.criterion_settings_security_profile_employee_group_widget',

        extend : 'Ext.form.field.Tag',

        requires : [
            'criterion.store.EmployeeGroups'
        ],

        config : {
            roleCode : null,
            employerId : null
        },

        fieldLabel : null,
        displayField : 'name',
        valueField : 'id',
        editable : false,
        emptyText : i18n.gettext('Not selected'),
        queryMode : 'local',
        minHeight : 36,
        allowBlank : true,

        setRoleCode : function(roleCode) {
            if (roleCode === criterion.Consts.SECURITY_ROLES.EMPLOYEE_GROUP) {
                this.removeCls('x-hidden');
            } else {
                this.setValue(null);
                this.addCls('x-hidden');
            }

            this.callParent(arguments);
        },

        setEmployerId : function(employerId) {
            this.employerId = employerId;
            this.applyFilters(employerId);
        },

        setStore : function(store) {
            var clonedStore = Ext.create('criterion.store.EmployeeGroups'),
                employerId = this.getEmployerId();

            if (store && store.isStore) {
                store.cloneToStore(clonedStore);
            }

            this.clonedStore = clonedStore;

            this.applyFilters(employerId);

            this.callParent([clonedStore]);
        },

        applyFilters : function(employerId) {
            var clonedStore = this.clonedStore;

            if (clonedStore && employerId) {
                clonedStore.clearFilter();
                clonedStore.addFilter([{
                    property : 'employerId',
                    value : employerId
                }]);
            }
        }
    }
});
