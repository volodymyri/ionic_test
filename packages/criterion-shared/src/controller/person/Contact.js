Ext.define('criterion.controller.person.Contact', function() {

    return {
        alias : 'controller.criterion_person_contact',

        extend : 'criterion.controller.FormView',

        handleChangeContactType : function(cmp, val) {
            var vm = this.getViewModel(),
                emergency = this.lookup('emergency'),
                rec = cmp.getSelection();

            if (vm.get('readOnly')) {
                return;
            }

            if (rec && rec.get('code') === criterion.Consts.PERSON_CONTACT_TYPE_EMERGENCY_CONTACT_CODE) {
                emergency.setValue(true);
                emergency.setReadOnly(true);
            } else {
                emergency.setReadOnly(false);
            }
        },

        handleChangeEmergency : function() {
            // used in childs
        },

        isEmergencyPhoneRequired : function() {
            let record = this.getRecord();

            return record && record.get('isEmergency') && !(record.get('workPhone') || record.get('homePhone') || record.get('mobilePhone'));
        },

        checkDependentAndEmergency : function() {
            let record = this.getRecord();

            return record && (record.get('isEmergency') || record.get('isDependent'));
        },

        handleSubmitClick : function() {
            var me = this,
                form = me.getView(),
                record = this.getRecord(),
                workPhone = me.lookup('workPhone'),
                homePhone = me.lookup('homePhone'),
                mobilePhone = me.lookup('mobilePhone');

            this.isNewRecord = record.phantom;

            if (!me.checkDependentAndEmergency()) {
                criterion.Msg.warning(i18n.gettext('Contact should be Dependent, Emergency or both of them'));

                return;
            }

            if (me.isEmergencyPhoneRequired()) {
                criterion.Msg.warning(i18n.gettext('Emergency contact should has at least one phone number'));
                workPhone.focus();

                return;
            }

            Ext.Deferred.all([
                workPhone.validateNumber(),
                homePhone.validateNumber(),
                mobilePhone.validateNumber()
            ]).then({
                success : function() {
                    if (form.isValid()) {
                        me.updateRecord(record, me.handleRecordUpdate);
                    } else {
                        me.focusInvalidField();
                    }
                },
                failure : function() {
                    me.focusInvalidField();
                }
            });
        },

        handleRecordLoad : function(record) {
            let me = this,
                view = this.getView(),
                niField = me.lookup('nationalIdentifier');

            me.lookup('customfieldsDependents').getController().load(
                !record.phantom ? record.getId() : null
            ).then(function() {
                me.afterCustomFieldsLoaded();
            });

            niField.setCountryCd(criterion.Application.getEmployer().get('countryCd'));

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.PERSON_ADDRESS,
                method : 'GET',
                params : {
                    personId : record.get('personId')
                }
            }).then(function(addresses) {
                let address = addresses && addresses[0];

                if (address) {
                    let countryCd = address.countryCd,
                        stateCd = address.stateCd;

                    if (stateCd) {
                        countryCd && record.set('countryCd', countryCd); // because state requires country selection
                        record.set('stateCd', stateCd);
                    } else {
                        let noneSpecifiedStateCd = criterion.CodeDataManager.getCodeDetailRecord('code', 'NONE', criterion.consts.Dict.STATE),
                            noneSpecifiedStateId = noneSpecifiedStateCd && noneSpecifiedStateCd.getId();

                        noneSpecifiedStateId && record.set('stateCd', noneSpecifiedStateId);
                    }
                }
            }).always(function() {
                view.setLoading(false);
            });

            me.callParent(arguments);
        },

        afterCustomFieldsLoaded : function() {

        },

        onAfterSave : function(view, record) {
            var me = this;

            this.lookup('customfieldsDependents').getController().save(record.getId()).then(function() {
                me.superclass.onAfterSave.call(me, view, record);
            });
        }
    };

});
