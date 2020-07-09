Ext.define('criterion.controller.settings.payroll.PaySettings', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_payroll_settings_pay_settings',

        employerId : null,

        handleActivate : function() {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel();

            view.setLoading(true, null);

            Ext.promise.Promise.all([
                vm.getStore('settings').loadWithPromise(),
                vm.getStore('payrollTimesheetImportApps').loadWithPromise()
            ]).then(function() {
                view.setLoading(false);

                me._setPayrollSettingRecord();
            }).otherwise(function() {
                view.setLoading(false);
            });
        },

        _setPayrollSettingRecord : function() {
            let me = this,
                vm = this.getViewModel(),
                settingsStore = vm.getStore('settings'),
                recIndx;

            if (!this.employerId) {
                return;
            }

            vm.getStore('employerBankAccounts').loadWithPromise({
                params : {
                    employerId : this.employerId
                }
            }).then(function() {
                recIndx = settingsStore.findExact('employerId', me.employerId);
                if (recIndx !== -1) {
                    vm.set('payrollSettingRecord', settingsStore.getAt(recIndx));
                }
            });

        },

        handleUpdate : function() {
            let importLayoutField = this.lookup('importLayout'),
                importLayout = importLayoutField.getValue(),
                parser = window.DOMParser ? new window.DOMParser() : null,
                parserErrorNS = null,
                xmlDoc;

            if (parser) {
                try {
                    parserErrorNS = parser.parseFromString("INVALID", "text/xml").getElementsByTagName("parsererror")[0].namespaceURI;
                } catch (err) {
                    parserErrorNS = null;
                }

                xmlDoc = parser.parseFromString(importLayout, "text/xml");
                if (parserErrorNS != null && xmlDoc.getElementsByTagNameNS(parserErrorNS, "parsererror").length > 0) {
                    importLayoutField.markInvalid(i18n.gettext('Invalid XML!'));
                    return;
                }
            }

            if (!this.getView().getForm().isValid()) {
                this.focusInvalidField();
                return;
            }

            this.getViewModel().getStore('settings').sync({
                callback : function() {
                    criterion.Utils.toast(i18n.gettext('Payroll settings saved.'));
                }
            });
        },

        onBeforeEmployerChange : function(employer) {
            this.employerId = employer ? employer.getId() : null;
        },

        onEmployerChange : function() {
            this._setPayrollSettingRecord();
        },

        init : function() {
            this.handleActivate = Ext.Function.createBuffered(this.handleActivate, 100, this);

            this.callParent(arguments);
        }
    };
});
