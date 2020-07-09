Ext.define('criterion.controller.settings.benefits.openEnrollment.OpenEnrollment', function() {

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_settings_open_enrollment',

        requires : [
            'criterion.ux.form.CloneForm'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.ControlDeferredProcess'
        ],

        employerId : null,

        getEmployerId() {
            return this.employerId;
        },

        onBeforeEmployerChange(employer) {
            this.employerId = employer ? employer.getId() : null;
        },

        load(openEnrollment) {
            let viewModel = this.getViewModel();

            viewModel.set('activeViewIndex', 0);
            viewModel.set('openEnrollment', openEnrollment);

            this.lookup('setup').getController().load(openEnrollment, this.getEmployerId());
        },

        onAnnouncementsPrev() {
            this.getViewModel().set('activeViewIndex', 0);
        },

        onStepsPrev() {
            this.getViewModel().set('activeViewIndex', 1);
        },

        onAutoRolloverPrev() {
            this.getViewModel().set('activeViewIndex', 2);
        },

        onSetupSave() {
            let vm = this.getViewModel();

            vm.set('activeViewIndex', 1);
            this.lookup('announcements').getController().load(vm.get('openEnrollment'));
        },

        onAnnouncementsSave() {
            let vm = this.getViewModel();

            vm.set('activeViewIndex', 2);
            this.lookup('steps').getController().load(vm.get('openEnrollment'));
        },

        onStepSave() {
            let vm = this.getViewModel();

            if (vm.get('openEnrollment.phantom')) {
                this.onSave();

                return;
            }

            vm.set('activeViewIndex', 3);
            this.lookup('autoRollover').getController().load(
                this.lookup('steps').getController().getAllBenefitsFromSteps()
            );
        },

        onSave() {
            let view = this.getView(),
                vm = this.getViewModel();

            this.lookup('setup').getController().saveEnrollment().then({
                scope : this,
                success : function() {
                    Ext.promise.Promise.all([
                        this.lookup('announcements').getController().syncAnnouncements(),
                        this.lookup('steps').getController().syncSteps()
                    ]).then({
                        scope : this,
                        success : function() {
                            view.fireEvent('afterSave', vm.get('openEnrollment'));
                            view.destroy();
                            criterion.Utils.toast(i18n.gettext('Successfully saved.'));
                        }
                    })
                }
            })

        },

        onCancel() {
            let view = this.getView(),
                vm = this.getViewModel();

            view.fireEvent('cancel', view, vm.get('openEnrollment'));
            view.destroy();
        },

        onDelete() {
            let view = this.getView(),
                vm = this.getViewModel();

            view.fireEvent('delete', this.getView(), vm.get('openEnrollment'));
            view.fireEvent('afterDelete');
            view.destroy();
        },

        handleClone() {
            let picker,
                vm = this.getViewModel(),
                employerId = this.getEmployerId(),
                me = this;

            picker = Ext.create('criterion.ux.form.CloneForm', {
                title : i18n.gettext('Clone Benefit Plan'),

                viewModel : {
                    data : {
                        openEnrollmentId : vm.get('openEnrollment.id'),
                        name : vm.get('openEnrollment.name') + criterion.Consts.CLONE_PREFIX
                    }
                },

                items : [
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Open Enrollment Name'),
                        allowBlank : false,
                        name : 'name',
                        bind : '{name}'
                    }
                ]
            });

            picker.show();
            picker.focusFirstField();
            picker.on({
                cancel : () => {
                    me.setCorrectMaskZIndex(false);
                    picker.destroy();
                },
                clone : data => {
                    me.setCorrectMaskZIndex(false);
                    picker.destroy();
                    me.cloneOpenEnrollment(data, employerId);
                }
            });

            this.setCorrectMaskZIndex(true);
        },

        cloneOpenEnrollment(data, employerId) {
            let view = this.getView(),
                vm = this.getViewModel();

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : Ext.util.Format.format(
                    criterion.consts.Api.API.EMPLOYER_OPEN_ENROLLMENT_CLONE,
                    data.openEnrollmentId,
                    employerId
                ),
                jsonData : {
                    name : data.name
                },
                method : 'POST',
                silent : true
            }).then(() => {
                view.setLoading(false);

                view.fireEvent('afterSave', vm.get('openEnrollment'));
                view.destroy();
            });
        }
    }

});
