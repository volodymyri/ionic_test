Ext.define('criterion.controller.employee.demographic.Basic', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_employee_demographic_basic',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeContext'
        ],

        onBeforeEmployeeChange : function() {
            var niField = this.lookupReference('nationalIdentifier'),
                niFieldRO = this.lookupReference('nationalIdentifierRO'),
                countryCd = criterion.Application.getEmployer().get('countryCd');

            niField.setCountryCd(countryCd);
            niFieldRO.setCountryCd(countryCd);

            return false; // force onEmployeeChange call, to reload custom fields in case panel is not active
        },

        handleAfterLoad : function() {
            var view = this.getView(),
                person = this.getViewModel().get('person'),
                personWorkflowLog = Ext.isFunction(person.getWorkflowLog) && person.getWorkflowLog(),
                customFields = person && person.get('customFields'),
                customfieldsDemographics = this.lookupReference('customfieldsDemographics');

            this.lookupReference('customfieldsDemographics').load(this.getPersonId(), function() {
                if (personWorkflowLog && Ext.Array.contains(['PENDING_APPROVAL', 'VERIFIED'], personWorkflowLog.get('stateCode'))) {
                    var request = personWorkflowLog.get('request');

                    if (request && request['customFields']) {
                        Ext.Array.each(request['customFields'], function(customField) {
                            Ext.Array.each(customfieldsDemographics.query('criterion_customdata_field'), function(cmp) {
                                if (cmp.getRecord().get('id') === customField['id']) {
                                    cmp.addCls('criterion-field-highlighted');
                                    cmp.setValue(cmp['isMemo'] ? customField['memo'] : customField['value']);
                                } else {
                                    cmp.removeCls('criterion-field-highlighted');
                                }
                            });
                        });
                    }
                }

                view.setLoading(false);
            }, customFields);
        }
    };

});
