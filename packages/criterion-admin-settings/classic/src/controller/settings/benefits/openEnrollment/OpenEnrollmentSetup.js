Ext.define('criterion.controller.settings.benefits.openEnrollment.OpenEnrollmentSetup', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_settings_open_enrollment_setup',

        load(record, employerId) {
            let vm = this.getViewModel(),
                benefitPlans = vm.getStore('benefitPlans'),
                incomeLists = vm.getStore('incomeLists');

            record.set('employerId', employerId);
            vm.set('record', record);

            Ext.promise.Promise.all([
                this.lookupReference('employeeGroupCombo').loadValuesForRecord(record),
                benefitPlans.loadWithPromise({
                    params : {
                        employerId : employerId,
                        isCafe : true
                    }
                }),
                incomeLists.loadWithPromise({
                    params : {
                        employerId : employerId
                    }
                })
            ]);
        },

        handleNextClick() {
            let view = this.getView(),
                vm = this.getViewModel(),
                record = vm.get('record');

            this.lookupReference('employeeGroupCombo').collapse();

            if (view.isValid()) {
                this.getView().fireEvent('save', record);
            }
        },

        saveEnrollment() {
            let me = this,
                dfd = Ext.create('Ext.promise.Deferred'),
                record = this.getViewModel().get('record');

            if (record.phantom || record.dirty) {
                record.saveWithPromise().then(function(rec) {
                    me.lookupReference('employeeGroupCombo').saveValuesForRecord(rec).then(function() {
                        dfd.resolve();
                    });
                });
            } else {
                me.lookupReference('employeeGroupCombo').saveValuesForRecord(record).then(function() {
                    dfd.resolve();
                });
            }

            return dfd.promise;
        },

        handleCancelClick() {
            let record = this.getViewModel().get('record');

            record.reject();
            this.getView().fireEvent('cancel');
        },

        handleDeleteClick() {
            let record = this.getViewModel().get('record'),
                me = this;

            criterion.Msg.confirmDelete({
                    title : i18n.gettext('Delete record'),
                    message : i18n.gettext('Do you want to delete the record?')
                },
                btn => {
                    if (btn === 'yes') {

                        record.erase({
                            success : function() {
                                me.getView().fireEvent('delete');
                            }
                        });
                    }
                }
            );
        },

        isViewActive() {
            let view = this.getView();

            return view.isVisible(true);
        },

        navCancelHandler() {
            if (this.isViewActive()) {
                this.handleCancelClick();
            }
        },

        navDeleteHandler(_, event) {
            let targetEl = Ext.fly(event.target),
                targetCmp = targetEl && targetEl.component;

            if (!targetCmp || !targetCmp.isTextInput) {
                if (!this.getViewModel().get('isPhantom') && this.isViewActive()) {
                    this.handleDeleteClick();
                }
            }
        }
    }

});
