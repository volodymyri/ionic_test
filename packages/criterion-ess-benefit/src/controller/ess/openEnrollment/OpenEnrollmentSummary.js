Ext.define('criterion.controller.ess.openEnrollment.OpenEnrollmentSummary', function() {

    const API = criterion.consts.Api.API;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_selfservice_open_enrollment_summary',

        handleActivate() {
            let me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                steps = vm.get('steps');

            this.getView().createItems();

            Ext.Array.each(steps, stepData => {
                let step = stepData.step,
                    plan = stepData.plan,
                    webform,
                    webformId,
                    openEnrollmentStepId = step.get('openEnrollmentStepId'),
                    employeeOpenEnrollmentStepId = step.getId();

                if (plan && (webformId = plan.get('webformId'))) {
                    webform = me.lookup('webform_for_' + openEnrollmentStepId);

                    if (webform) {
                        if (!vm.get('editDisabled') && !vm.get('isRejected')) {
                            webform.setMainUrl(API.WEBFORM + '/' + webformId);
                            webform.loadForm().then(() => {
                                let values;

                                if (view.webformDataStore && (values = view.webformDataStore[openEnrollmentStepId + '_' + webformId])) {
                                    webform.setFormValues(values);
                                }
                            });
                        } else if (employeeOpenEnrollmentStepId > 0) {
                            // read only view
                            webform.setMainUrl(Ext.String.format(API.EMPLOYEE_OPEN_ENROLLMENT_STEP_WEBFORM_FIELDS, employeeOpenEnrollmentStepId));
                            webform.loadForm().then(() => {
                                let values;

                                if (view.webformDataStore && (values = view.webformDataStore[openEnrollmentStepId + '_' + webformId])) {
                                    webform.setFormValues(values);
                                }
                            });
                        }
                    }
                }
            });
        },

        saveWebFormsData() {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                steps = vm.get('steps');

            view.webformDataStore = {};

            Ext.Array.each(steps, stepData => {
                let step = stepData.step,
                    plan = stepData.plan,
                    webform,
                    webformId,
                    openEnrollmentStepId = step.get('openEnrollmentStepId');

                if (plan && (webformId = plan.get('webformId'))) {
                    webform = me.lookup('webform_for_' + openEnrollmentStepId);

                    if (webform) {
                        view.webformDataStore[openEnrollmentStepId + '_' + webformId] = webform.getFormValues();
                    }
                }
            });
        },

        handleDownloadFormClick(cmp) {
            window.open(criterion.Api.getSecureResourceUrl(Ext.String.format(criterion.consts.Api.API.EMPLOYEE_OPEN_ENROLLMENT_STEP_WEBFORM_DOWNLOAD, cmp.stepId)));
        }
    }
});
