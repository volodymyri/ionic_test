Ext.define('criterion.controller.settings.system.securityProfile.SecurityProfileRoles', function() {

    function updateRecordsOrder(store, fieldName) {
        Ext.each(store.getRange(), function(record, index) {
            record.set(fieldName, index + 1);
        })
    }

    return {

        extend : 'criterion.controller.employer.GridView',

        alias : 'controller.criterion_settings_security_profile_roles',

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleAddRole : function() {
            var me = this,
                vm = this.getViewModel(),
                roles = vm.get('record.roles'),
                employerIds = [], selectWindow;

            roles.each(function(role) {
                employerIds.push(role.get('employerId'));
            });

            selectWindow = Ext.create('criterion.view.settings.system.securityProfile.EmployerSelector', {
                employers : this.getStore('employers').getRange(),
                employerIds : employerIds
            });

            selectWindow.on({
                close : function() {
                    selectWindow.destroy();
                },
                select : function(newEmployer) {
                    roles.add({
                        securityProfileId : vm.get('record.id'),
                        employerId : newEmployer.getId(),
                        employerName : newEmployer.get('legalName'),
                        roleCd : criterion.CodeDataManager.getCodeDetailRecord(
                            'code', criterion.Consts.SECURITY_ROLES.FULL, criterion.consts.Dict.SECURITY_ROLE
                        ).getId()
                    });
                    selectWindow.destroy();
                },
                scope : this
            });

            selectWindow.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });

            selectWindow.show();

            me.setCorrectMaskZIndex(true);
        },

        handleRemoveRole : function(record) {
            criterion.Msg.confirmDelete({
                    title : i18n.gettext('Delete role'),
                    message : i18n.gettext('Do you want to delete?')
                },
                function(btn) {
                    if (btn === 'yes') {
                        record.store.remove(record);
                    }
                }
            );
        },

        handleSubmitClick : function() {
            this.getView().destroy();
        },

        handleCancelClick : function() {
            var vm = this.getViewModel(),
                record = vm.get('record'),
                roles = record.roles();

            roles.rejectChanges();

            this.getView().destroy();
        }
    }
});
