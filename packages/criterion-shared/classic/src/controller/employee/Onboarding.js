Ext.define('criterion.controller.employee.Onboarding', function() {

    return {

        alias : 'controller.criterion_employee_onboarding',

        extend : 'criterion.controller.employee.GridView',

        requires : [
            'criterion.store.employer.Onboardings'
        ],

        mixins : [
            'criterion.controller.mixin.identity.EmployeeContext'
        ],

        getEmptyRecord : function() {
            return {
                employeeId : this.getEmployeeId()
            };
        },

        createEditor : function(editorCfg, record) {
            var editor = this.callParent(arguments);

            editor.getViewModel().set({
                employerId : this.getEmployerId()
            });

            return editor;
        },

        handleAddList : function() {
            var me = this,
                selectPopup;

            selectPopup = Ext.create('criterion.ux.form.Panel', {
                title : i18n.gettext('Select Onboarding List'),
                modal : true,
                draggable : true,
                cls : 'criterion-modal',
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                        height : 'auto',
                        modal : true
                    }
                ],

                viewModel : {
                    stores : {
                        onboardings : {
                            type : 'criterion_employer_onboardings',
                            autoLoad : true,
                            proxy : {
                                extraParams : {
                                    employerId : this.getEmployerId()
                                }
                            }
                        }
                    }
                },

                layout : 'hbox',
                bodyPadding : 20,

                items : [
                    {
                        xtype : 'combo',
                        fieldLabel : i18n.gettext('Onboarding List'),
                        reference : 'onboarding',
                        bind : {
                            store : '{onboardings}'
                        },
                        valueField : 'id',
                        displayField : 'name',
                        queryMode : 'local',
                        editable : false,
                        allowBlank : false
                    }
                ],

                buttons : [
                    '->',
                    {
                        xtype : 'button',
                        cls : 'criterion-btn-light',
                        handler : function() {
                            this.up('criterion_form').fireEvent('cancel');
                        },
                        text : i18n.gettext('Cancel')
                    },
                    {
                        xtype : 'button',
                        cls : 'criterion-btn-primary',
                        handler : function() {
                            var form = this.up('criterion_form');

                            if (form.isValid()) {
                                form.fireEvent('change', form.getViewModel().get('onboarding.selection'));
                            }
                        },
                        text : i18n.gettext('Add')
                    }
                ]
            });

            selectPopup.show();

            selectPopup.on('cancel', function() {
                selectPopup.destroy();
            });
            selectPopup.on('change', function(onboarding) {
                me.addOnboardingListDetails(onboarding.details());

                selectPopup.destroy();
            });
        },

        addOnboardingListDetails : function(details) {
            var newEmployeeOnboarding = [],
                vm = this.getViewModel(),
                store = vm.getStore('employeeOnboardings'),
                employeeId = this.getEmployeeId();

            details.each(function(detail) {
                var data = Ext.clone(detail.getData());

                delete data['id'];
                data['employeeId'] = employeeId;
                data['dueDate'] = data['dueInDays'] === null ? null : (Ext.Date.add(Ext.Date.clearTime(new Date()), Ext.Date.DAY, data['dueInDays']));

                newEmployeeOnboarding.push(data);
            });

            store.add(newEmployeeOnboarding);

            this.afterAddOnboardingListDetails();
        },

        afterAddOnboardingListDetails : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                store = vm.getStore('employeeOnboardings');

            view.setLoading(true);
            store.syncWithPromise().then(function() {
                view.setLoading(false);
            });
        },

        handleNotifyClick : function() {
            let view = this.getView(),
                employeeId = this.getEmployeeId();

            view.setLoading(true);
            criterion.Api.requestWithPromise({
                method : 'POST',
                url : criterion.consts.Api.API.EMPLOYEE_ONBOARDING_NOTIFY,
                jsonData : {
                    employeeId : employeeId
                }
            }).then({
                scope : this,
                success : function(notificationNumber) {
                    if (notificationNumber && notificationNumber > 0) {
                        criterion.Utils.toast(Ext.String.format(i18n.ngettext('{0} new notification sent.', '{0} new notifications sent.', notificationNumber), notificationNumber));
                    } else {
                        criterion.Utils.toast(i18n.gettext('All notifications have already sent'));
                    }
                    this.load();
                }
            }).always(() => {
                view.setLoading(false);
            });
        }
    }
});
