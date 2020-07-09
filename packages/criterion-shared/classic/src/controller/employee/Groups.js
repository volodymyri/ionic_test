Ext.define('criterion.controller.employee.Groups', function() {

    return {
        alias : 'controller.criterion_employee_groups',

        extend : 'criterion.controller.employee.GridView',

        requires : [
            'criterion.model.employeeGroup.Member',
            'criterion.store.EmployeeGroups'
        ],

        mixins : [
            'criterion.controller.mixin.identity.EmployeeContext'
        ],

        load : function(opts = {}) {
            let employeeGroups = this.getViewModel().getStore('employeeGroups'),
                dfd = Ext.create('Ext.Deferred');

            if (!employeeGroups) {
                dfd.resolve();

                return dfd.promise;
            }

            return Ext.promise.Promise.all([
                employeeGroups.loadWithPromise(),
                this.callParent(arguments)
            ]);
        },

        handleEditAction : function(record) {
            // blocked
        },

        addRecord : function(record) {
            return new criterion.model.employeeGroup.Member(record);
        },

        createEditor : function(editor, record) {
            var employeeGroups,
                store = this.getView().getStore(),
                selected = [];


            store.each(function(group) {
                selected.push(group.get('employeeGroupId'));
            });

            employeeGroups = Ext.create('criterion.store.EmployeeGroups', {
                filters : [
                    {
                        property : 'isDynamic',
                        value : false
                    },
                    {
                        property : 'id',
                        value : selected,
                        operator : 'notin'
                    }
                ]
            });

            this.getViewModel().getStore('employeeGroups').cloneToStore(employeeGroups);

            editor['viewModel'] = {
                data : {
                    employeeGroupsFiltered : employeeGroups
                }
            };
            return this.callParent([editor, record]);
        },

        customDeleteMsg : i18n.gettext('Do you want to delete from this group?'),

        remove : function(record) {
            var me = this;

            record.getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE_GROUP_MEMBER);

            record.erase({
                success : function() {
                    me.load();
                }
            });
        }
    };

});
