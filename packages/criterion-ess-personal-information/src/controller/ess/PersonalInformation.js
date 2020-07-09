Ext.define('criterion.controller.ess.PersonalInformation', function() {

    var DICT = criterion.consts.Dict,
        DATA_TYPE = criterion.Consts.DATA_TYPE,
        WORKFLOW_STATUSES = criterion.Consts.WORKFLOW_STATUSES;

    return {

        extend : 'criterion.controller.ess.Base',

        alias : 'controller.criterion_selfservice_personal_information',

        requires : [
            'criterion.model.Person',
            'criterion.model.Employee',
            'criterion.model.WorkflowLog'
        ],

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal',
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.WorkflowConfirmation',
            'criterion.controller.mixin.ReRouting'
        ],

        baseURL : criterion.consts.Route.SELF_SERVICE.PERSONAL_INFORMATION,

        init : function() {
            this.setReRouting();
            this.callParent(arguments);
        },

        handleRoute : function(pageId) {
            this.callParent([pageId || 0]);
        },

        getRoutes : function() {
            var routes = this.callParent(arguments);

            routes[this.baseURL + '/:tab/:id'] = 'handleRoute';

            return routes;
        },

        handleEmployeeChanged : function() {
            var me = this,
                view = this.getView(),
                form, active, formLayout,
                layout;

            if (!this.checkViewIsActive()) {
                return;
            }

            Ext.defer(function() {
                layout = view.getLayout();
                form = layout.getActiveItem && layout.getActiveItem();
                formLayout = form && form.getLayout();
                active = formLayout && formLayout.getActiveItem && formLayout.getActiveItem();

                if (active && !!active.securityAccess && !active.securityAccess()) {
                    me.blockSection();
                }
            }, 100);
        },

        onEmployeeChange : function(employee) {
            var me = this,
                view = this.getView(),
                employer = Ext.getStore('Employers').getById(employee.get('employerId')),
                isMultiPosition = employer.get('isMultiPosition');

            view.items.each(function(form) {
                if (!form.monitorMultiPosition) {
                    return;
                }

                Ext.Array.each(this.query('[isMultiPositionMode=true]'), function(item) {
                    if (!isMultiPosition && form.getLayout().getActiveItem() == item) {
                        me.redirectTo(criterion.consts.Route.SELF_SERVICE.PERSONAL_INFORMATION);
                    }
                });

                Ext.Array.each(this.query('[multiPositionTitle]'), function(item) {
                    if (isMultiPosition) {
                        item._singlePositionTitle = item._singlePositionTitle || item.getTitle();
                        item.setTitle(item.multiPositionTitle);
                    } else {
                        Ext.isDefined(item._singlePositionTitle) && item.setTitle(item._singlePositionTitle);
                    }
                });
            });

            this.load();
        },

        load : function() {
            var me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                addressesStore = vm.getStore('addresses'),
                positionsStore = vm.getStore('positions'),
                assignmentForm = this.lookup('assignment'),
                assignmentHistory = this.lookup('assignmentHistory'),
                employeeId = this.getEmployeeId(),
                basicDemographics = this.lookup('basicDemographics');

            if (!employeeId) {
                return;
            }

            var employee = Ext.getStore('Employees').getById(employeeId),
                employer = Ext.getStore('Employers').getById(employee.get('employerId'));

            view.setLoading(true, null);

            vm.set({
                person : Ext.create('criterion.model.Person', {
                    personId : criterion.Api.getCurrentPersonId()
                }),
                employee : employee,
                address : null,
                position : null,
                employerId : employer.getId()
            });

            Ext.Deferred.all([
                me.loadWorkflowData(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.PERSON_ADDRESS),
                me.loadWorkflowData(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.PERSON),
                vm.get('person').loadWithPromise({
                    params : {
                        joinWorkflowLog : true
                    }
                }),
                addressesStore.loadWithPromise({
                    params : {
                        personId : criterion.Api.getCurrentPersonId(),
                        joinWorkflowLog : true
                    }
                }),
                positionsStore.loadWithPromise({
                    params : {
                        employeeId : employeeId
                    }
                })
            ]).then({
                scope : this,
                success : function() {
                    var person = vm.get('person');

                    person.setId(criterion.Api.getCurrentPersonId());

                    if (addressesStore.count()) {
                        var address = addressesStore.getAt(0),
                            geocode = address.get('geocode');

                        vm.set({
                            address : address,
                            geocode : geocode
                        });
                    }

                    if (positionsStore.count()) {
                        vm.set('position', positionsStore.getAt(0));
                    }

                    if (assignmentForm) { // don't have this in modern, also can be absent because of security
                        assignmentForm.getViewModel().set({
                            positionId : vm.get('position') && vm.get('position').getId(),
                            record : Ext.create('criterion.model.Assignment', {
                                personName : person.get('fullName'),
                                personId : person.getId()
                            }),
                            employerId : employer.getId(),
                            positionRecord : null,
                            assignmentId : null
                        });
                        assignmentForm.load();
                    }

                    if (assignmentHistory) { // don't have this in modern, also can be absent because of security
                        assignmentHistory.getController().load();
                    }

                    me.fireEvent('selectedEmployeeSet', {
                        person : person,
                        personAddress : vm.get('address'),
                        employee : employee,
                        employer : employer,
                        position : vm.get('position')
                    }, view);

                    view.fireEvent('personSet', person);

                    basicDemographics && basicDemographics.fireEvent('afterLoad');

                    vm.notify();
                    me.highlightUpdatedFields();

                    view.setLoading(false, null);
                }
            });

        },

        highlightUpdatedFields : function() {
            var vm = this.getViewModel(),
                personWorkflowLog = Ext.isFunction(vm.get('person').getWorkflowLog) && vm.get('person').getWorkflowLog(),
                addressWorkflowLog = Ext.isFunction(vm.get('address').getWorkflowLog) && vm.get('address').getWorkflowLog();

            this.highlightSection('basicDemographics', personWorkflowLog);
            this.lookupReference('basicDemographics') && this.lookupReference('basicDemographics').getViewModel().set('upts', +new Date());
            this.highlightSection('addressForm', addressWorkflowLog);
        },

        /**
         * @param reference
         * @returns {Ext.util.MixedCollection|Array}
         */
        getSectionFields : function(reference) {
            var container = this.lookupReference(reference);

            return container && container.getForm ? container.getForm().getFields() : new Ext.util.MixedCollection();
        },

        highlightSection : function(section, workflowLog) {
            this.getSectionFields(section).each(function(field) {
                var bind = field.bind || field.getBind && field.getBind(), // bind exposed differently in modern and classic
                    bindValue = bind && (bind.value || bind.rawNumber || bind.checked),
                    fieldName = bindValue && bindValue.stub && bindValue.stub.name;

                if (!fieldName) {
                    return;
                }

                if (workflowLog && [WORKFLOW_STATUSES.PENDING_APPROVAL, WORKFLOW_STATUSES.VERIFIED].indexOf(workflowLog.get('stateCode')) !== -1 && Ext.Object.getAllKeys(workflowLog.data.request).indexOf(fieldName) !== -1) {
                    var value = workflowLog.data.request[fieldName];

                    if (Ext.Array.contains(['datepickerfield', 'datefield'], field.getXType())) {
                        value = Ext.Date.parse(value, criterion.consts.Api.DATE_FORMAT)
                    }

                    if (field.isXType('criterion_person_phone_number')) {
                        field.setDisplayNumber(value);
                    } else {
                        field.setValue(value);
                    }

                    field.addCls('criterion-field-highlighted');
                } else {
                    field.removeCls('criterion-field-highlighted');
                }
            });
        },

        handleActivate : function() {
            this.load();
        },

        onPersonSave : function() {
            var me = this,
                person = this.getViewModel().get('person'),
                employeeId = this.getEmployeeId(),
                basicDemographics = this.lookup('basicDemographics'),
                customFieldsDemographics = basicDemographics.lookup('customfieldsDemographics'),
                changedCustomValues = customFieldsDemographics && customFieldsDemographics.getController().getChanges(person.getId())['modifiedCustomValues'],
                customFieldsContainerModern = this.lookup('customFieldsContainerModern');

            if (!basicDemographics.isValid()) {
                basicDemographics.focusOnInvalidField();
                return;
            }

            if (customFieldsContainerModern) {
                changedCustomValues = [];

                customFieldsContainerModern.items.each(customField => {
                    if (customField.isDirty()) {
                        let value = customField.getValue(),
                            customValue = {
                                id : customField['customFieldId']
                            };

                        if (customField['isMemo']) {
                            customValue['memo'] = value ? value.toString() : null;
                        } else {
                            customValue['value'] = value ? value.toString() : null;
                        }

                        changedCustomValues.push(customValue);
                    }
                });
            }

            if (person.dirty || changedCustomValues && changedCustomValues.length) {
                !Ext.isModern && me.setCorrectMaskZIndex(true);

                this.actWorkflowConfirm(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.PERSON).then(function(signature) {
                    !Ext.isModern && me.setCorrectMaskZIndex(false);

                    if (signature) {
                        person.set('signature', signature);
                    }

                    if (changedCustomValues && changedCustomValues.length) {
                        person.set('customFields', Ext.Array.map(changedCustomValues, function(changedCustomValue) {
                            return changedCustomValue.isModel ? {
                                id : changedCustomValue.get('customFieldId'),
                                value : changedCustomValue.get('value'),
                                memo : changedCustomValue.get('memo')
                            } : changedCustomValue
                        }));
                    }

                    person.saveWithPromise({
                        employeeId : employeeId,
                        isWorkflow : true
                    }).then(function() {
                        criterion.Utils.toast(i18n.gettext('Demographics Update requested.'));
                        basicDemographics.getViewModel().set({
                            editMode : false,
                            readOnly : true
                        });

                        me.load();
                    });
                });
            }
        },

        onAddressSave : function() {
            var me = this,
                address = this.getViewModel().get('address'),
                employeeId = this.getEmployeeId(),
                addressForm = this.lookup('addressForm');

            if (!addressForm.isValid()) {
                addressForm.focusOnInvalidField();
                return;
            }

            if (address.dirty) {

                !Ext.isModern && me.setCorrectMaskZIndex(true);

                this.actWorkflowConfirm(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.PERSON_ADDRESS).then(function(signature) {
                    !Ext.isModern && me.setCorrectMaskZIndex(false);

                    if (signature) {
                        address.set('signature', signature);
                    }

                    address.saveWithPromise({
                        employeeId : employeeId,
                        isWorkflow : true
                    }).then(function() {
                        criterion.Utils.toast(i18n.gettext('Address Update requested.'));
                        addressForm.getViewModel().set({
                            editMode : false,
                            readOnly : true
                        });

                        me.load();
                    });
                });
            }
        },

        handleRecallAddressRequest : function() {
            var me = this,
                vm = this.getViewModel(),
                record = vm.get('address'),
                employeeId = this.getEmployeeId();

            criterion.Msg.confirm(
                i18n.gettext('Confirm'),
                i18n.gettext('Do you want to cancel changes?'),
                function(btn) {
                    if (btn === 'yes') {
                        criterion.Api.requestWithPromise({
                            url : Ext.util.Format.format(
                                criterion.consts.Api.API.PERSON_ADDRESS_RECALL,
                                record.getId()
                            ) + '?employeeId=' + employeeId,
                            method : 'PUT'
                        }).then({
                            success : function(result) {
                                me.load();
                            }
                        });
                    }
                }
            );
        },

        handleRecallDemographicsRequest : function() {
            var me = this,
                vm = this.getViewModel(),
                record = vm.get('person'),
                employeeId = this.getEmployeeId();

            criterion.Msg.confirm(
                i18n.gettext('Confirm'),
                i18n.gettext('Do you want to cancel changes?'),
                function(btn) {
                    if (btn === 'yes') {
                        criterion.Api.requestWithPromise({
                            url : Ext.util.Format.format(
                                criterion.consts.Api.API.PERSON_DEMOGRAPHICS_RECALL,
                                record.getId()
                            ) + '?employeeId=' + employeeId,
                            method : 'PUT'
                        }).then({
                            success : function(result) {
                                me.load();
                            }
                        });
                    }
                }
            );
        },

        onPersonSet : function(person) {
            var customFieldsContainer = this.lookup('customFieldsContainerModern'),
                customFields = person.get('customFields'),
                personWorkflowLog = person.getWorkflowLog && person.getWorkflowLog();

            if (!customFieldsContainer) {
                return;
            }

            customFieldsContainer.removeAll();

            criterion.CodeDataManager.load([DICT.DATA_TYPE]).then(function() {
                Ext.Array.each(customFields, function(customField) {
                    var customFieldId = customField['id'],
                        label = customField['label'],
                        dataType = criterion.CodeDataManager.getCodeDetailRecord('id', customField['dataTypeCd'], DICT.DATA_TYPE).get('code'),
                        codeTableId = customField['codeTableId'],
                        codeTableCode,
                        customValue = customField['customValue'],
                        value = customValue && customValue['value'],
                        field = {
                            label : label + ':&nbsp;',
                            customFieldId : customFieldId,
                            name : 'customField_' + customFieldId,
                            bind : {
                                readOnly : '{readOnly}'
                            }
                        };

                    switch (dataType) {

                        default:
                        case DATA_TYPE.TEXT:
                            field = Ext.apply(field, {
                                xtype : 'textfield',
                                value : value
                            });

                            break;

                        case DATA_TYPE.NUMBER:
                            field = Ext.apply(field, {
                                xtype : 'numberfield',
                                value : value
                            });

                            break;

                        case DATA_TYPE.CURRENCY:
                            field = Ext.apply(field, {
                                xtype : 'criterion_field_currency_field',
                                value : value
                            });

                            break;

                        case DATA_TYPE.DATE:
                            field = Ext.apply(field, {
                                xtype : 'datepickerfield',
                                value : value ? new Date(value) : null
                            });

                            break;

                        case DATA_TYPE.CHECKBOX:
                            field = Ext.apply(field, {
                                xtype : 'togglefield',
                                value : value ? (value === 'true') : null
                            });

                            break;

                        case DATA_TYPE.DROPDOWN:
                            codeTableCode = criterion.CodeDataManager.getCodeTableNameById(codeTableId);

                            field = Ext.apply(field, {
                                xtype : 'criterion_code_detail_select',
                                codeDataId : codeTableCode,
                                value : value ? parseInt(value, 10) : null
                            });

                            break;

                        case criterion.Consts.DATA_TYPE.MEMO:
                            field = Ext.apply(field, {
                                xtype : 'textareafield',
                                maxRows : customField['maximumSize'],
                                isMemo : true
                            });

                            break;
                    }

                    customFieldsContainer.add(field);
                });

                if (personWorkflowLog && Ext.Array.contains([WORKFLOW_STATUSES.PENDING_APPROVAL, WORKFLOW_STATUSES.VERIFIED], personWorkflowLog.get('stateCode'))) {
                    var request = personWorkflowLog.get('request');

                    if (request && request['customFields']) {
                        Ext.Array.each(request['customFields'], function(customField) {
                            customFieldsContainer.items.each(function(field) {
                                if (field['customFieldId'] === customField['id']) {
                                    field.addCls('criterion-field-highlighted');
                                    field.setValue(field.isMemo ? customField['memo'] : customField['value']);
                                } else {
                                    field.removeCls('criterion-field-highlighted');
                                }
                            });
                        });
                    }
                }
            });
        },

        onPersonCancel : function() {
            var basicDemographics = this.lookupReference('basicDemographics'),
                vm = basicDemographics.getViewModel();

            vm.set({
                editMode : false,
                readOnly : true
            });

            this.getViewModel().get('person').reject();

            basicDemographics.rejectInvalidFields();
        },

        onAddressCancel : function() {
            var addressForm = this.lookupReference('addressForm'),
                vm = addressForm.getViewModel();

            vm.set({
                editMode : false,
                readOnly : true
            });

            this.getViewModel().get('address').reject();

            addressForm.rejectInvalidFields();
        }

    };
});
