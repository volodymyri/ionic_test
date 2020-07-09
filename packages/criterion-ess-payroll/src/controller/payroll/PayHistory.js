Ext.define('criterion.controller.ess.payroll.PayHistory', function() {

    var URL_TOKEN_LAST = 'last',
        recordId;

    return {
        alias : 'controller.criterion_selfservice_payroll_pay_history',

        extend : 'criterion.controller.employee.GridView',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        baseRoute : criterion.consts.Route.SELF_SERVICE.PAYROLL_PAY_HISTORY,

        load : function(_recordId) {
            let me = this,
                vm = this.getViewModel(),
                employeeId = this.getEmployeeId(),
                payDateYears = vm.get('payDateYears');

            recordId = _recordId;

            if (employeeId) {
                payDateYears.removeAll();

                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.PAYROLL_PAY_DATE_YEARS,
                    method : 'GET'
                }).then(function(response) {
                    if (response && Ext.isArray(response) && response.length > 0) {
                        payDateYears.add(Ext.Array.map(Ext.Array.sort(response, (a, b) => {
                            return a > b ? -1 : 1
                        }), payDateYear => {
                            return {
                                text : (new Date).getFullYear() === payDateYear ? i18n.gettext('Current Year') : payDateYear,
                                value : payDateYear
                            }
                        }));

                        me.lookup('payDateYearsCombo').setSelection(payDateYears.getAt(0));
                    }
                });

                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.PAYROLL_NEXT_PAY_DATE,
                    method : 'GET'
                }).then(function(response) {
                    if (response && response['nextPayDate']) {
                        vm.set('nextPayDate', response['nextPayDate'])
                    } else {
                        vm.set('nextPayDate', null);
                    }
                });
            }
        },

        onSelectedYearChange : function(cmp) {
            let vm = this.getViewModel(),
                payrolls = vm.getStore('payrolls'),
                employeeId = this.getEmployeeId(),
                selection = cmp.getSelection();

            selection && payrolls.load({
                params : {
                    employeeId : employeeId,
                    payDateYear : selection.get('value')
                },
                scope : this,
                callback : function(records) {
                    if (!records.length) {
                        return;
                    }

                    if (recordId) {
                        if (recordId === URL_TOKEN_LAST) {
                            this.handleEditAction(this.getLastPayroll());
                        } else {
                            this.handleEditAction(payrolls.getById(recordId));
                        }
                    }
                }
            });
        },

        routeHandler : function(id) {
            var payrolls = this.getViewModel().getStore('payrolls');

            if (id === this.getNewEntityToken()) {
                this.add();
            } else if (id === URL_TOKEN_LAST) {
                this.edit(this.getLastPayroll());
            } else {
                this.edit(payrolls.getById(id));
            }
        },

        getLastPayroll : function() {
            let payrolls = this.getViewModel().getStore('payrolls');

            payrolls.sort('payDate', 'DESC');

            return payrolls.getAt(0);
        },

        onAttachmentView : function(record) {
            var payDate = Ext.Date.format(record.get('payDate'), criterion.consts.Api.DATE_FORMAT);

            window.open(criterion.Api.getSecureResourceUrl(
                Ext.util.Format.format(criterion.consts.Api.API.EMPLOYEE_DOWNLOAD_PAY_CHECK_REPORT, payDate, false, record.getId())
            ));
        },

        onAttachmentDownload : function(cmp) {
            var record = cmp.getWidgetRecord(),
                payDate = Ext.Date.format(record.get('payDate'), criterion.consts.Api.DATE_FORMAT),
                showSSN = this.getViewModel().get('showSSN');

            window.open(criterion.Api.getSecureResourceUrl(
                Ext.util.Format.format(criterion.consts.Api.API.EMPLOYEE_DOWNLOAD_PAY_CHECK_REPORT, payDate, showSSN, record.getId())
            ));
        },

        handleShowOptionsClick : function(cmp) {
            let vm = this.getViewModel(),
                cmpBox = cmp.getBox(),
                menu = new Ext.menu.Menu({
                    cls : 'popup-options',

                    bodyPadding : '5 20 15 10',

                    padding : 0,

                    width : 280,

                    shadow : false,

                    listeners : {
                        hide : function() {
                            cmp._menu.destroy();
                            cmp._menu = null;
                        }
                    },

                    items : [
                        {
                            xtype : 'toggleslidefield',
                            fieldLabel : i18n.gettext('Download report with SSN'),
                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                            margin : '5 0 0 0',
                            value : vm.get('showSSN'),
                            handler : function(toggle, value) {
                                vm.set('showSSN', value);

                                Ext.defer(function() {
                                    menu.getEl().fadeOut({
                                        callback : function() {
                                            menu.hide();
                                        }
                                    });
                                }, 300);
                            }
                        }
                    ]
                });

            cmp._menu = menu;
            menu.showAt([cmpBox.right - 278, cmpBox.bottom + 10], true);
        },

        handleBeforeShowOptionsClick : function(cmp) {
            return !cmp._menu;
        }

    };
});
