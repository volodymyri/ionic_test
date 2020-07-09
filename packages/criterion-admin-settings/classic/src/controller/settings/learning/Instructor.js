Ext.define('criterion.controller.settings.learning.Instructor', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_learning_instructor',

        requires : [
            'criterion.view.person.PersonPicker',
            'criterion.store.person.EssUsers'
        ],

        onPersonSearch : function() {
            var wnd = Ext.create('criterion.view.person.PersonPicker', {
                    store : Ext.create('criterion.store.person.EssUsers')
                });

            wnd.show();
            wnd.on('select', this.selectPerson, this);
        },

        onPersonClear : function() {
            var vm = this.getViewModel(),
                record = vm.get('record');

            record.set({
                personId : null,
                personName : null
            });
        },

        selectPerson : function(person) {
            var vm = this.getViewModel(),
                record = vm.get('record');

            record.set({
                personId : person.get('id'),
                personName : person.get('fullName')
            });
        },

        handleChangePassword : function() {
            var me = this,
                vm = me.getViewModel(),
                view = me.getView(),
                passwordField = me.lookup('password');

            if (!vm.get('passwordReadOnly')) {
                view.setLoading(true);
                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.PERSON_GENERATE_PASSWORD,
                    method : 'GET'
                }).then(function(result) {
                    vm.set('record.password', result.password);
                    passwordField.setHideText(false);
                }, function() {
                    criterion.Utils.toast(i18n.gettext('Password generation failed'));
                }).always(function() {
                    view.setLoading(false);
                });
            }

            vm.set('passwordReadOnly', !vm.get('passwordReadOnly'));
        },

        handleRecordLoad : function(record) {
            var me = this,
                vm = me.getViewModel(),
                instructorTypeId = record.get('personId') ? criterion.Consts.INSTRUCTOR.TYPE.INTERNAL.ID : criterion.Consts.INSTRUCTOR.TYPE.EXTERNAL.ID;

            vm.set({
                instructorTypeId : instructorTypeId,
                initialInstructorTypeId : instructorTypeId
            });

            me.callParent(arguments);
        },

        handleRecordUpdate : function(record) {
            var me = this,
                vm = me.getViewModel(),
                password = me.lookup('password');

            if (!vm.get('isInternal')) {
                if (record.get('personId')) {
                    record.set('personId', null);
                }
                if (vm.get('initialInstructorTypeId') !== criterion.Consts.INSTRUCTOR.TYPE.EXTERNAL.ID) {
                    Ext.apply(record.modified, {
                        name: null,
                        emailAddress : null,
                        company : null,
                        phoneNumber : null
                    });
                }
            }

            if (!password.getValue() && password.allowBlank) {
                record.set('password', null);
            }

            me.callParent(arguments);
        },

        handleInstructorTypeChange : function(combo, value) {
            var me = this,
                personName = me.lookup('personName'),
                name = me.lookup('name'),
                company = me.lookup('company'),
                email = me.lookup('email');

            personName.allowBlank = value === criterion.Consts.INSTRUCTOR.TYPE.EXTERNAL.ID;

            name.allowBlank = value === criterion.Consts.INSTRUCTOR.TYPE.INTERNAL.ID;
            company.allowBlank = value === criterion.Consts.INSTRUCTOR.TYPE.INTERNAL.ID;
            email.allowBlank = value === criterion.Consts.INSTRUCTOR.TYPE.INTERNAL.ID;
         }
    };
});
