Ext.define('ess.controller.personalInformation.DependentsAndContacts', function() {

    var DICT = criterion.consts.Dict;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_modern_personal_information_dependents_and_contacts',

        handleActivate : function() {
            var view = this.getView();

            view.setActiveItem(this.lookup('contactsGridWrapper'));

            view.setLoading(true);
            this.getViewModel().getStore('customFields').loadWithPromise({
                params : {
                    entityTypeCd : criterion.CodeDataManager.getCodeDetailRecord('code', criterion.Consts.getCustomizableEntities().CUSTOMIZABLE_ENTITY_DEPENDENTS.code, DICT.ENTITY_TYPE).getId()
                }
            }).then(function() {
                view.setLoading(false);
            });
        },

        handleBack : function() {
            this.getView().fireEvent('pageBack');
        },

        handleAdd : function() {
            var vm = this.getViewModel(),
                personId = vm.get('employee.personId'),
                record = vm.getStore('contacts').add({
                    personId : personId
                })[0];

            this.handleEdit(record);
        },

        handleEdit : function(record) {
            var me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                dependentAndContactForm = this.lookup('dependentAndContactForm'),
                customFields = vm.getStore('customFields'),
                customFieldValues = vm.getStore('customFieldValues'),
                dfd = Ext.create('Ext.promise.Deferred');

            view.setLoading(true);
            dfd.promise.then(function() {
                view.getLayout().setAnimation({
                        type : 'slide',
                        direction : 'right'
                    }
                );

                dependentAndContactForm.getViewModel().set('record', record);
                dependentAndContactForm.setCustomFields(
                    customFields,
                    customFieldValues
                );
                view.setLoading(false);
                view.setActiveItem(me.lookup('dependentAndContactForm'));
            });

            if (record.phantom) {
                customFieldValues.setData([]);
                dfd.resolve();
            } else {

                customFieldValues.loadWithPromise({
                    params : {
                        entityTypeCd : criterion.CodeDataManager.getCodeDetailRecord('code', criterion.Consts.getCustomizableEntities().CUSTOMIZABLE_ENTITY_DEPENDENTS.code, DICT.ENTITY_TYPE).getId(),
                        entityId : record.getId()
                    }
                }).then(function() {
                    dfd.resolve();
                });
            }
        },

        handleEditFinish : function() {
            var view = this.getView();

            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'right'
                }
            );

            view.setActiveItem(this.lookup('contactsGridWrapper'));
        }
    }
});
