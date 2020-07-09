Ext.define('criterion.controller.settings.benefits.openEnrollment.Steps', function() {

    return {

        extend : 'criterion.controller.employer.GridView',

        alias : 'controller.criterion_settings_open_enrollment_steps',

        handleActivate : Ext.emptyFn, // delegate to parent controller

        getEmptyRecord() {
            let vm = this.getViewModel(),
                store = vm.getStore('stepsStore'),
                maxSeq = store.max('sequenceNumber') || 0;

            return {
                openEnrollmentId : vm.get('openEnrollment').getId(),
                sequenceNumber : maxSeq + 1
            };
        },

        load(openEnrollment) {
            let view = this.getView(),
                vm = this.getViewModel(),
                store = this.getStore('stepsStore');

            vm.set('openEnrollment', openEnrollment);

            if (!openEnrollment.phantom) {
                view.setLoading(true);

                store.loadWithPromise({
                    params : {
                        openEnrollmentId : openEnrollment.getId()
                    }
                }).always(() => {
                    view.setLoading(false);
                });
            } else {
                store.removeAll()
            }
        },

        createEditor(editorCfg, record) {
            let editor = Ext.create(editorCfg),
                editorController = editor.getController(),
                openEnrollment = this.getViewModel().get('openEnrollment');

            if (this.getConnectParentView()) {
                editor._connectedView = this.getView();
                editor.setTitle(null);
                editor.shadow = false;
            } else {
                editor.setTitle((record.phantom ? 'Add' : 'Edit') + ' ' + editor.getTitle());
            }

            editor.show();

            if (!openEnrollment.phantom) {
                editor.getViewModel().set('employer', Ext.StoreManager.lookup('Employers').getById(openEnrollment.get('employerId')));
            } else {
                editor.getViewModel().set('employer', Ext.StoreManager.lookup('Employers').getById(this.getEmployerId()));
            }

            editor.getViewModel().set('openEnrollment', openEnrollment);

            if (Ext.isFunction(editorController.handleRecordLoad)) {
                editor.getController().handleRecordLoad.call(editorController, record);
            }

            return editor;
        },

        syncSteps() {
            let steps = this.getStore('stepsStore'),
                dfd = Ext.create('Ext.promise.Deferred'),
                openEnrollment = this.getViewModel().get('openEnrollment');

            if (steps.getModifiedRecords().length || steps.getRemovedRecords().length) {
                steps.each(function(step) {
                    step.set('openEnrollmentId', openEnrollment.getId());
                });

                steps.syncWithPromise().then({
                    scope : this,
                    success : function() {
                        this.syncStepBenefits().then(function() {
                            dfd.resolve();
                        });
                    }
                });
            } else {
                this.syncStepBenefits().then(function() {
                    dfd.resolve();
                });
            }

            return dfd.promise;
        },

        syncStepBenefits() {
            let steps = this.getStore('stepsStore'),
                promises = [];

            steps.each(function(step) {
                let stepBenefits = step.stepBenefits;

                if (stepBenefits && (stepBenefits.getModifiedRecords().length || stepBenefits.getRemovedRecords().length)) {
                    stepBenefits.each(function(stepBenefit) {
                        stepBenefit.set({
                            openEnrollmentStepId : step.getId()
                        })
                    });

                    promises.push(stepBenefits.syncWithPromise());
                }
            });

            return Ext.promise.Promise.all(promises);
        },

        getAllBenefitsFromSteps() {
            let steps = this.getStore('stepsStore'),
                benefitPlanIds = [];

            steps.each(step => {
                let stepBenefits = step.stepBenefits;

                if (stepBenefits) {
                    stepBenefits.each(stepBenefit => {
                        benefitPlanIds.push(stepBenefit.get('benefitPlanId'));
                    });
                } else {
                    step.benefits().each(benefit => {
                        benefitPlanIds.push(benefit.getId());
                    });
                }
            });

            return benefitPlanIds;
        },

        handleNextClick() {
            this.getView().fireEvent('save');
        },

        handlePrevClick() {
            this.getView().fireEvent('prev');
        },

        handleCancelClick() {
            this.getView().fireEvent('cancel');
        },

        handleMoveUpAction(record, grid) {
            let store = record.store,
                sequenceNumber = record.get('sequenceNumber');

            store.getAt(store.indexOf(record) - 1).set('sequenceNumber', sequenceNumber);
            record.set('sequenceNumber', sequenceNumber - 1);
        },

        handleMoveDownAction(record, grid) {
            let store = record.store,
                sequenceNumber = record.get('sequenceNumber');

            store.getAt(store.indexOf(record) + 1).set('sequenceNumber', sequenceNumber);
            record.set('sequenceNumber', sequenceNumber + 1);
        }
    }

});
