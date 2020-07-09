Ext.define('criterion.view.ess.dashboard.workflow.EmployeeBenefitBase', function() {

    return {
        alias : 'widget.criterion_selfservice_workflow_employee_benefit_base',

        extend : 'Ext.Container',

        viewModel : {
            data : {
                hasChangedOptions : false,
                hasChangedDependents : false,
                hasChangedBeneficiaries : false,
                hasChangedContingentBeneficiaries : false
            },

            stores : {
                options : {
                    proxy : {
                        type : 'memory'
                    },
                    fields : [
                        {
                            name : 'id',
                            type : 'int'
                        },
                        {
                            name : 'text',
                            type : 'string'
                        }
                    ]
                },

                dependents : {
                    proxy : {
                        type : 'memory'
                    },
                    fields : [
                        {
                            name : 'id',
                            type : 'int'
                        },
                        {
                            name : 'text',
                            type : 'string'
                        }
                    ]
                },

                beneficiaries : {
                    proxy : {
                        type : 'memory'
                    },
                    fields : [
                        {
                            name : 'id',
                            type : 'int'
                        },
                        {
                            name : 'text',
                            type : 'string'
                        }
                    ]
                },

                contingentBeneficiaries : {
                    proxy : {
                        type : 'memory'
                    },
                    fields : [
                        {
                            name : 'id',
                            type : 'int'
                        },
                        {
                            name : 'text',
                            type : 'string'
                        }
                    ]
                }
            }
        },

        items : [],

        load : function(requestData, actualData, workflowRequestType) {
            var me = this,
                vm = this.getViewModel(),
                newOptions = requestData['options'],
                oldOptions = actualData['options'],
                benefitPlan = actualData['benefitPlan'],
                optionVals = benefitPlan['options'],
                personContacts = actualData['personContacts'],
                changedOptions = [],
                changedDependents = [],
                changedBeneficiaries = [],
                changedContingentBeneficiaries = [];

            if (newOptions && Ext.isArray(newOptions)) {
                vm.set('hasChangedOptions', true);

                Ext.Array.each(newOptions, function(newOption) {
                    var id = newOption.id,
                        manualValue = newOption['manualValue'],
                        benefitPlanOptionId = newOption['benefitPlanOptionId'],
                        oldOption,
                        oVal;

                    oldOption = Ext.Array.findBy(oldOptions, function(val) {
                        return val['id'] === id;
                    });

                    if (!Ext.isEmpty(manualValue)) {
                        oVal = manualValue;
                    } else {
                        oVal = Ext.Array.findBy(optionVals, function(val) {
                            return val['id'] === benefitPlanOptionId;
                        })['name'];
                    }

                    changedOptions.push({
                        id : id,
                        text : benefitPlan['optionGroup' + oldOption['optionGroup']] + ': ' + oVal
                    });
                });

                vm.getStore('options').setData(changedOptions);
            } else {
                vm.set('hasChangedOptions', false);
            }

            criterion.CodeDataManager.loadIfEmpty(criterion.consts.Dict.RELATIONSHIP_TYPE).then(function() {
                // dependents
                if (requestData['createdDependents'].length || requestData['removedDependents'].length || requestData['editedDependents'].length) {
                    vm.set('hasChangedDependents', true);

                    Ext.Array.each(requestData['createdDependents'] || [], function(created) {
                        changedDependents.push(me.personOperation(personContacts, created, i18n.gettext('Added'), false));
                    });

                    Ext.Array.each(requestData['removedDependents'] || [], function(removed) {
                        changedDependents.push(me.personOperation(personContacts, removed, i18n.gettext('Removed'), false));
                    });

                    Ext.Array.each(requestData['editedDependents'] || [], function(edited) {
                        changedDependents.push(me.personOperation(personContacts, edited, i18n.gettext('Changed'), false));
                    });

                    vm.getStore('dependents').setData(changedDependents);
                } else {
                    vm.set('hasChangedDependents', false);
                }

                // beneficiaries
                if (requestData['createdBeneficiaries'].length || requestData['removedBeneficiaries'].length || requestData['editedBeneficiaries'].length) {
                    vm.set('hasChangedBeneficiaries', true);

                    Ext.Array.each(requestData['createdBeneficiaries'] || [], function(created) {
                        changedBeneficiaries.push(me.personOperation(personContacts, created, i18n.gettext('Added'), true));
                    });

                    Ext.Array.each(requestData['removedBeneficiaries'] || [], function(removed) {
                        changedBeneficiaries.push(me.personOperation(personContacts, removed, i18n.gettext('Removed'), false));
                    });

                    Ext.Array.each(requestData['editedBeneficiaries'] || [], function(edited) {
                        changedBeneficiaries.push(me.personOperation(personContacts, edited, i18n.gettext('Changed'), true));
                    });

                    vm.getStore('beneficiaries').setData(changedBeneficiaries);
                } else {
                    vm.set('hasChangedBeneficiaries', false);
                }

                // contingent beneficiaries
                if (requestData['createdContingentBeneficiaries'].length || requestData['removedContingentBeneficiaries'].length || requestData['editedContingentBeneficiaries'].length) {
                    vm.set('hasChangedContingentBeneficiaries', true);

                    Ext.Array.each(requestData['createdContingentBeneficiaries'] || [], function(created) {
                        changedContingentBeneficiaries.push(me.personOperation(personContacts, created, i18n.gettext('Added'), true));
                    });

                    Ext.Array.each(requestData['removedContingentBeneficiaries'] || [], function(removed) {
                        changedContingentBeneficiaries.push(me.personOperation(personContacts, removed, i18n.gettext('Removed'), false));
                    });

                    Ext.Array.each(requestData['editedContingentBeneficiaries'] || [], function(edited) {
                        changedContingentBeneficiaries.push(me.personOperation(personContacts, edited, i18n.gettext('Changed'), true));
                    });

                    vm.getStore('contingentBeneficiaries').setData(changedContingentBeneficiaries);
                } else {
                    vm.set('hasChangedContingentBeneficiaries', false);
                }
            });

        },

        personOperation : function(personContacts, changedData, operationName, isChangedBeneficiaries) {
            var me = this,
                personContactId = changedData['personContactId'],
                personContact;

            personContact = Ext.Array.findBy(personContacts, function(val) {
                return val['id'] === personContactId;
            });
            if (!personContact) {
                console.error('Check person contacts!');
                return;
            }

            return {
                id : changedData['id'],
                text : operationName + ': ' +
                personContact['firstName'] + ' ' + personContact['lastName'] +
                ' (' + me.getRelationshipTypeName(personContact['relationshipTypeCd']) + ')' +
                (isChangedBeneficiaries ? ' - ' + changedData['beneficiaryPercent'] + '%' : '') +
                (changedData['effectiveDate'] ? (i18n.gettext('</BR>Effective Date: ') + changedData['effectiveDate']) : '') +
                (changedData['expirationDate'] ? (i18n.gettext('</BR>Expiration Date: ') + changedData['expirationDate']) : '') +
                '</BR></BR>'
            }
        },

        getRelationshipTypeName : function(relationshipTypeCd) {
            return criterion.CodeDataManager.getCodeDetailRecord('id', relationshipTypeCd, criterion.consts.Dict.RELATIONSHIP_TYPE).get('description');
        }
    };
});
