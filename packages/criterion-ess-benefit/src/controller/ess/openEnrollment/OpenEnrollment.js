Ext.define('criterion.controller.ess.openEnrollment.OpenEnrollment', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_selfservice_open_enrollment',

        requires : [
            'criterion.view.ess.openEnrollment.OpenEnrollmentStep',
            'criterion.model.employer.openEnrollment.Step',
            'criterion.model.employee.openEnrollment.Step'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.WorkflowConfirmation'
        ],

        listen : {
            global : {
                employeeChanged : 'onCancelClick'
            }
        },

        init : function() {
            criterion.detectDirtyForms && Ext.GlobalEvents.on('beforeHideForm', this.onBeforeHideForm, this);

            this.callParent(arguments);
        },

        onBeforeHideForm : function() {
            var view = this.getView(),
                vm = this.getViewModel();

            if (view.rendered && view.isVisible(true) && vm.get('employerEnrollment')) {
                this.lookup('openEnrollmentSummary').webformDataStore = null;
                view.close();
            }

            return true;
        },

        loadRecord : function(employerEnrollment) {
            var vm = this.getViewModel(),
                employeeEnrollment = Ext.isFunction(employerEnrollment.getEmployeeOpenEnrollment) && employerEnrollment.getEmployeeOpenEnrollment(),
                employeeId = vm.get('employeeId'),
                person = vm.get('person');

            this.loadWorkflowData(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.EMPLOYEE_OPEN_ENROLLMENT);

            vm.set('employerEnrollment', employerEnrollment);
            vm.set('employeeEnrollment', employeeEnrollment || null);

            if (!person) {
                vm.set('person', criterion.Api.getCurrentPerson());
            }
            this.createSteps();

            this.lookup('openEnrollmentSummary').webformDataStore = null;

            if (!vm.get('editDisabled')) {
                this.recalculate();
            }
        },

        onBackClick : function() {
            let layout = this.getView().getLayout(),
                cards = this.getView().items,
                active = layout.getActiveItem(),
                activeViewIndex = cards.items.indexOf(active),
                prev = cards.items[activeViewIndex - (layout.getPrev().hiddenStep ? 2 : 1)];

            if (active.isEnrollmentSummary) {
                active.saveWebFormsData();
            }

            layout.setActiveItem(prev);
            this.getViewModel().set('activeViewIndex', cards.items.indexOf(prev));
        },

        onNextClick : function() {
            var layout = this.getView().getLayout(),
                cards = this.getView().items;

            if (layout.getActiveItem().isEnrollmentStep) {
                var planValid = layout.getActiveItem().getController().checkPlan();

                if (!planValid) {
                    return;
                }
            }

            var activeViewIndex = cards.items.indexOf(layout.getActiveItem()),
                next = cards.items[activeViewIndex + (layout.getNext().hiddenStep ? 2 : 1)];

            if (next.isEnrollmentSummary) {
                var steps = [],
                    vm = this.getViewModel();

                cards.each(function(card) {
                    if (card.isEnrollmentStep && !card.hiddenStep) {
                        steps.push(card.getController().getStepData());
                    }
                });
                next.getViewModel().set(
                    {
                        steps : steps,
                        cafeCredit : vm.get('cafeCredit'),
                        cafeBenefitPlanName : vm.get('cafeBenefitPlanName')
                    }
                );
            }

            layout.setActiveItem(next);
            this.getViewModel().set('activeViewIndex', cards.items.indexOf(next));
        },

        onFinishClick : function() {
            let vm = this.getViewModel(),
                view = this.getView(),
                me = this,
                employeeId = vm.get('employeeId'),
                layout = this.getView().getLayout(),
                activeItem = layout.getActiveItem(),
                stepData = activeItem.getViewModel().get('steps'),
                steps = Ext.Array.map(stepData, stepData => {
                    return stepData['step'].getData();
                }),
                documents = Ext.Array.map(stepData, stepData => {
                    return stepData['documents'];
                }),
                webforms = Ext.Array.clean(Ext.Array.map(steps, step => {
                    return activeItem.lookup('webform_for_' + step['openEnrollmentStepId']);
                })),
                employeeEnrollment = vm.get('employeeEnrollment'),
                hasEmployeeEnrollment = employeeEnrollment && employeeEnrollment.isModel && !employeeEnrollment.phantom,
                params = {
                    employeeId : employeeId
                },
                isValid = true,
                openEnrollmentId = vm.get('employerEnrollment').getId();

            if (hasEmployeeEnrollment) {
                params['employeeOpenEnrollmentId'] = employeeEnrollment.getId();
            }

            // validation webforms
            Ext.Array.each(webforms, webform => {
                if (!webform.isValid()) {
                    isValid = false;
                }
            });

            if (!isValid) {
                return;
            }

            // delay for correct find the mask element
            Ext.defer(function() {
                me.setCorrectMaskZIndex(true);
            }, 10);

            me.actWorkflowConfirm(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.EMPLOYEE_OPEN_ENROLLMENT).then(function(signature) {
                let sendData = {},
                    sendFields = [],
                    jsonData = {
                        employeeId : employeeId,
                        openEnrollmentId : openEnrollmentId,
                        steps : steps
                    };

                me.setCorrectMaskZIndex(false);
                vm.set('blockedState', true);
                view.setLoading(true);

                if (signature) {
                    jsonData['signature'] = signature;
                }

                sendData['submissionData'] = JSON.stringify(jsonData);

                // docs
                Ext.Array.each(documents, (docObj, i) => {
                    let stepId = steps[i]['openEnrollmentStepId'];

                    if (!Ext.Object.isEmpty(docObj)) {
                        Ext.Object.each(docObj, (key, fields) => {


                            Ext.Array.each(fields, (fieldBlk) => {
                                let nameInd = fieldBlk.name === 'attachment' ? 'attachment' : 'name';

                                sendFields.push({
                                    name : Ext.String.format('openEnrollmentStepDocument-{0}-{1}', nameInd, stepId),
                                    value : fieldBlk.value
                                });
                            });
                        })
                    }
                });

                // webforms
                Ext.Array.each(webforms, webform => {
                    let stepId = webform.openEnrollmentStepId;

                    Ext.Array.each(webform.getFormValues(), (fieldBlk) => {
                        sendFields.push({
                            name : Ext.String.format('openEnrollmentStepWebform-{0}-{1}', stepId, fieldBlk.name),
                            value : fieldBlk.value
                        });
                    });
                });

                criterion.Api.submitFormWithPromise({
                    url : API.EMPLOYEE_OPEN_ENROLLMENT_SUBMIT + '?' + Ext.Object.toQueryString(params),
                    fields : sendFields,
                    extraData : sendData
                }).then(() => {
                    vm.set('blockedState', false);
                    view.setLoading(false);

                    me.reloadOE();
                }, () => {
                    vm.set('blockedState', false);
                    view.setLoading(false);
                });

            });
        },

        cleanStepsPages : function() {
            let view = this.getView();

            Ext.Array.each(view.query('criterion_selfservice_open_enrollment_step'), (stepView) => {
                view.remove(stepView);
            });
        },

        reloadOE : function() {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                activeOpenEnrollments = vm.get('activeOpenEnrollments');

            view.setLoading(true);

            activeOpenEnrollments.loadWithPromise({
                params : {
                    employeeId : vm.get('employeeId'),
                    isActive : true
                }
            }).then(() => {
                me.cleanStepsPages();

                me.loadRecord(activeOpenEnrollments.getById(vm.get('employerEnrollment.id')));

                Ext.defer(() => {
                    me.lookup('openEnrollmentSummary').getController().handleActivate();
                    view.setLoading(false);
                }, 1000);

            });
        },

        onDownloadSummary : function() {
            let vm = this.getViewModel(),
                options = Ext.JSON.encode({
                    "advancedParams" : [],
                    "groupByParams" : [],
                    "filters" : [],
                    "hiddenColumns" : [],
                    "orderBy" : [
                        {
                            "key" : "order_1",
                            "fieldName" : "employee_name",
                            "dir" : "asc",
                            "displayName" : "Employee Name",
                            "selected" : false
                        },
                        {
                            "key" : "order_2",
                            "fieldName" : "first_name",
                            "dir" : "asc",
                            "displayName" : "First Name",
                            "selected" : false
                        },
                        {
                            "key" : "order_3",
                            "fieldName" : "last_name",
                            "dir" : "asc",
                            "displayName" : "Last Name",
                            "selected" : false
                        }
                    ],
                    "groupBy" : [],
                    "parameters" : [
                        {
                            "name" : "employeeOpenEnrollmentId",
                            "label" : null,
                            "mandatory" : false,
                            "valueType" : "integer",
                            "hidden" : false,
                            "isTransferParameter" : false,
                            "value" : vm.get('employerEnrollment.employeeOpenEnrollment.id')
                        }
                    ]
                }
            );

            window.open(criterion.Api.getSecureResourceUrl(
                Ext.util.Format.format(criterion.consts.Api.API.REPORT_DOWNLOAD_BY_NAME, 'open_enrollment_summary', encodeURI(options))
            ));
        },

        handleRecallRequest : function() {
            var me = this,
                vm = this.getViewModel(),
                record = vm.get('employeeEnrollment'),
                employeeId = vm.get('employeeId');

            criterion.Msg.confirm(
                i18n.gettext('Confirm'),
                i18n.gettext('Do you want to cancel changes?'),
                function(btn) {
                    if (btn === 'yes') {
                        criterion.Api.requestWithPromise({
                            url : Ext.util.Format.format(
                                criterion.consts.Api.API.EMPLOYEE_OPEN_ENROLLMENT_RECALL,
                                record.getId()
                            ) + '?employeeId=' + employeeId,
                            method : 'PUT'
                        }).then({
                            success : function(result) {
                                me.fireViewEvent('save');
                                me.onCancelClick();
                            }
                        });
                    }
                }
            );
        },

        onCancelClick : function() {
            this.getView().close();
            this.redirectTo(criterion.consts.Route.SELF_SERVICE.BENEFITS_OPEN_ENROLLMENTS);
        },

        createSteps : function() {
            var vm = this.getViewModel(),
                view = this.getView(),
                employerEnrollment = vm.get('employerEnrollment'),
                employeeEnrollment = vm.get('employeeEnrollment'),
                steps = Ext.isFunction(employerEnrollment.steps) && employerEnrollment.steps(),
                employeeSteps = employeeEnrollment && Ext.isFunction(employeeEnrollment.steps) && employeeEnrollment.steps(),
                stepsItems = [];

            if (steps) {
                steps.each(function(employerStep) {
                    var employeeStep = employeeSteps && employeeSteps.findRecord('openEnrollmentStepId', employerStep.getId(), 0, false, false, true);

                    if (!employeeStep) {
                        employeeStep = Ext.create('criterion.model.employee.openEnrollment.Step', {
                            openEnrollmentStepId : employerStep.getId(),
                            isEnroll : false
                        });
                    }

                    stepsItems.push({
                        xtype : 'criterion_selfservice_open_enrollment_step',
                        title : employerStep.get('name'),
                        viewModel : {
                            data : {
                                employerStep : employerStep,
                                employeeStep : employeeStep,
                                employeeStepPlanId : employeeStep.get('benefitPlanId')
                            }
                        }
                    });
                });
            }
            view.insert(1, stepsItems);

            view.updateLayout();
        },

        recalculate : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                employerEnrollment = this.getViewModel().get('employerEnrollment'),
                states = [],
                steps = [],
                benefitForms = {};

            view.items.each(function(card) {
                if (card.isEnrollmentStep) {
                    var stepData = card.getController().getStepData().step.getData(),
                        benefitForm = card.down('criterion_selfservice_open_enrollment_benefit_form');

                    benefitForms[stepData.openEnrollmentStepId] = benefitForm;

                    if (benefitForm.getViewModel().get('employeeStep.isEnroll') && benefitForm.isValid() && stepData.benefitPlanId) {
                        steps.push(stepData);
                    }
                }
            });

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : Ext.util.Format.format('{0}?openEnrollmentId={1}', criterion.consts.Api.API.EMPLOYEE_OPEN_ENROLLMENT_CALCULATE, employerEnrollment.getId()),
                method : 'POST',
                jsonData : {
                    benefitPlans : steps
                }
            }).then(function(result) {
                if (employerEnrollment.get('cafeBenefitPlanId')) {
                    vm.set(
                        {
                            cafeCredit : result['cafeCredit'],
                            cafeBenefitPlanName : result['cafeBenefitPlanName']
                        }
                    );
                }

                Ext.Array.each(result['benefitPlans'], function(benefitPlan) {
                    var benefitForm = benefitForms[benefitPlan['openEnrollmentStepId']];

                    if (benefitForm) {
                        benefitForm.getViewModel().set('calculated', benefitPlan);
                    }
                });

                Ext.Array.each(result['eligibility'], function(eligibility) {
                    var benefitForm = benefitForms[eligibility['openEnrollmentStepId']],
                        step = benefitForm.up('criterion_selfservice_open_enrollment_step'),
                        planSelect = benefitForm && benefitForm.lookup('planSelect'),
                        planStore = planSelect && planSelect.getStore(),
                        hiddenStep = false;

                    if (planStore) {
                        if (planStore.getRemoteFilter()) {
                            planStore.setRemoteFilter(false);
                        }
                        planStore.clearFilter();

                        if (eligibility['benefits']) {
                            planStore.addFilter({
                                property : 'id',
                                value : eligibility['benefits'],
                                operator : 'in'
                            });
                        }

                        if (!planStore.getCount()) {
                            hiddenStep = true;
                        }

                        step.hiddenStep = hiddenStep;
                    }
                });

                view.items.each(function(item) {
                    states.push(item.hiddenStep ? '' : item.getTitle());
                });

                vm.set('states', states);

                view.setLoading(false);
            }).otherwise(function() {
                view.setLoading(false);
            });
        }
    };
});
