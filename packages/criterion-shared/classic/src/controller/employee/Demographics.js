Ext.define('criterion.controller.employee.Demographics', function() {

    function showLoginConfirm(record, callback) {
        Ext.create('criterion.view.person.LoginConfirm', {
            person : record,
            listeners : {
                destroy : callback
            }
        }).show();
    }

    function validateEmail(email) {
        return criterion.Api.requestWithPromise({
            url : criterion.consts.Api.API.PERSON_VALIDATE_EMAIL,
            params : {
                email : email
            },
            method : 'GET'
        });
    }

    function validateEmailUpdate(email, personId) {
        return criterion.Api.requestWithPromise({
            url : criterion.consts.Api.API.PERSON_VALIDATE_EMAIL_UPDATE,
            params : {
                id : personId,
                email : email
            },
            method : 'GET'
        });
    }

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_employee_demographics',

        //If controller has redirectTo execution in handleCancelClick set preventReRoute=true to prevent re-routing in the method.
        preventReRoute : false,

        onProfileSave : function() {
            var view = this.getView(),
                me = this,
                formBasic = view.lookup('basicDemographics'),
                ssnField = formBasic.lookup('nationalIdentifier'),
                workPhone = formBasic.lookup('workPhone'),
                homePhone = formBasic.lookup('homePhone'),
                mobilePhone = formBasic.lookup('mobilePhone');

            // fix edge bug, when clicking save without removing the focus
            if (Ext.isEdge) {
                ssnField.fireEvent('blur', ssnField);
            }

            Ext.Deferred.all([
                workPhone.validateNumber(),
                homePhone.validateNumber(),
                mobilePhone.validateNumber()
            ]).then({
                success : function() {
                    me.saveProfile();
                },
                failure : function() {
                    view.setActiveItem(formBasic);
                    formBasic.focusOnInvalidField();
                }
            });
        },

        saveProfile : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                employeePanel = view.up('criterion_employee'),
                me = this,
                person = vm.get('person'),
                address = vm.get('address'),
                isNewPerson = person.phantom,
                formBasic = view.down('criterion_employee_demographic_basic'),
                formAddress = view.down('criterion_employee_demographic_address'),
                isMailingAddress = formAddress.down('checkboxfield[name=isMailingAddress]'),
                customFields = formBasic.down('[reference=customfieldsDemographics]');

            if (!formBasic.isValid()) {
                view.setActiveItem(formBasic);
                formBasic.focusOnInvalidField();
                return;
            } else if (!formAddress.isValid()) {
                view.setActiveItem(formAddress);
                formAddress.focusOnInvalidField();
                return;
            }

            view.setLoading(true);

            Ext.Deferred.sequence([
                function() {
                    return isNewPerson ? validateEmail(person.get('email')) : validateEmailUpdate(person.get('email'), person.get('id'));
                },
                function() {
                    return person.saveWithPromise()
                },
                function() {
                    if (isNewPerson) {
                        address.set({
                            personId : person.getId(),
                            isMailingAddress : true,
                            isPrimary : true
                        });
                    } else {
                        address.set('isMailingAddress', isMailingAddress.getValue());
                    }

                    return address.saveWithPromise();
                },
                function() {
                    return customFields.save(person.getId())
                }
            ], this)
                .then({
                    scope : this,
                    success : function() {
                        if (isNewPerson) {
                            showLoginConfirm.call(me, person, function() {
                                employeePanel.getController().redirectToPerson(person.get('id'));
                            })
                        } else {
                            me.fireEvent('changePersonInfo', {
                                person : person,
                                employee : vm.get('employee'),
                                employer : vm.get('employer')
                            });
                            criterion.Utils.toast(i18n.gettext('Profile Saved.'));
                        }
                    },
                    failure : this.handleValidationError
                }).always(function() {
                view.setLoading(false);
            });
        },

        handleValidationError : function(response) {
            var view = this.getView(),
                formBasic = view.items.getAt(0);

            if (response.isModel) {
                return;
            }

            response = Ext.decode(response.responseText);

            if (response.code == criterion.consts.Error.RESULT_CODES.VALIDATION_PERSON_EMAIL_EXISTS) {
                view.setActiveItem(formBasic);
                formBasic.lookupReference('email').focus();
            }
        },

        handleCancelClick : function() {
            var activeURL = Ext.util.History.getToken(),
                returnTo = criterion.consts.Route.getPrevRoute(),
                prevURL = criterion.consts.Route.HR.EMPLOYEES,
                vm = this.getViewModel(),
                view = this.getView(),
                addressForm = view.down('criterion_employee_demographic_address'),
                person = vm.get('person');

            if (activeURL.indexOf(criterion.consts.Route.PAYROLL.MAIN) >= 0) {
                prevURL = criterion.consts.Route.PAYROLL.EMPLOYEES;
            }

            if (returnTo) {
                criterion.consts.Route.setPrevRoute();
                prevURL = returnTo;
            } else {
                criterion.consts.Route.setPrevRoute(Ext.History.getToken());
            }

            person && person.reject();
            vm.get('address').reject();
            view.rejectInvalidFields();

            addressForm.clearFilters();

            !this.preventReRoute && this.redirectTo(prevURL);
        }

    };

});
