Ext.define('criterion.controller.settings.payroll.GLAccountMaps', function() {

    const GL_ACCOUNT_TYPE = criterion.Consts.GL_ACCOUNT_TYPE;

    return {

        extend : 'criterion.controller.employer.GridView',

        alias : 'controller.criterion_payroll_settings_gl_account_maps',

        load : function() {
            let me = this,
                view = this.getView(),
                employerId = this.getEmployerId();

            if (!employerId || Ext.isFunction(view.getPreventStoreLoad) && view.getPreventStoreLoad()) {
                return;
            }

            let loadParams = {
                params : {
                    employerId : employerId
                }
            };

            view.setLoading(true);

            Ext.promise.Promise.all([
                this.loadingStore('employerIncomeLists', loadParams),
                this.loadingStore('employerDeductions', loadParams),
                this.loadingStore('employerTimeOffPlans', loadParams),
                this.loadingStore('employerGLAccounts', loadParams),
                this.loadingStore('employerWorkLocations', loadParams),
                this.loadingStore('employerProjects', loadParams),
                this.loadingStore('employerTasks', loadParams)
            ]).then(function() {
                let store = view.getStore();

                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.EMPLOYER_GL_ACCOUNT_MAP,
                    method : 'GET',
                    params : {
                        employerId : employerId
                    }
                }).then(res => {
                    Ext.each(res, data => {
                        data['glAccountMapName'] = me.getGlAccountMapName(data);
                    });

                    store.loadData(res);
                });
            }).always(function() {
                view.setLoading(false);
            });
        },

        storeParams : {},

        loadingStore : function(storeIdent, loadParams) {
            let dfd = Ext.create('Ext.Deferred'),
                vm = this.getViewModel(),
                store = vm.getStore(storeIdent);

            if (!Ext.Object.equals(loadParams.params, this.storeParams[storeIdent])) {
                this.storeParams[storeIdent] = Ext.clone(loadParams.params);
                return store.loadWithPromise(loadParams);
            } else {
                dfd.resolve();
            }

            return dfd.promise;
        },

        getGlAccountMapName : function(data) {
            let vm = this.getViewModel(),
                glAccountTypeCode = criterion.CodeDataManager.getCodeDetailRecord('id', data['glAccountTypeCd'], criterion.consts.Dict.GL_ACCOUNT_TYPE).get('code'),
                employerIncomeLists = vm.getStore('employerIncomeLists'),
                employerDeductions = vm.getStore('employerDeductions'),
                employerTimeOffPlans = vm.getStore('employerTimeOffPlans'),
                name;

            switch (glAccountTypeCode) {
                case GL_ACCOUNT_TYPE.INCOME:
                    let income = employerIncomeLists.getById(data['incomeListId']);

                    name = income && income.get('description');
                    break;

                case GL_ACCOUNT_TYPE.DEDUCTION_EE:
                case GL_ACCOUNT_TYPE.DEDUCTION_ER:
                    let deduction = employerDeductions.getById(data['deductionId']);

                    name = deduction && deduction.get('description');
                    break;

                case GL_ACCOUNT_TYPE.TIME_OFF:
                    let plan = employerTimeOffPlans.getById(data['timeOffPlanId']);

                    name = plan && plan.get('name');
                    break;

                case GL_ACCOUNT_TYPE.TAX_EE:
                case GL_ACCOUNT_TYPE.TAX_ER:
                    name = data['taxName'];
                    break;

                case GL_ACCOUNT_TYPE.NET_PAY:
                    name = i18n.gettext('Net Pay');
                    break;
            }

            return name || i18n.gettext('All');
        },

        accountRenderer : function(value) {
            let vm = this.getViewModel(),
                employerGLAccounts = vm.getStore('employerGLAccounts'),
                account = value && employerGLAccounts.getById(value),
                name = account && Ext.util.Format.format('{0} / {1}', account.get('accountNumber'), account.get('accountName'));

            return name || '—';
        },

        locationRenderer : function(value) {
            let vm = this.getViewModel(),
                employerWorkLocations = vm.getStore('employerWorkLocations'),
                location = value && employerWorkLocations.getById(value);

            return location && location.get('description') || '—';
        },

        taskRenderer : function(value) {
            let vm = this.getViewModel(),
                employerTasks = vm.getStore('employerTasks'),
                task = value && employerTasks.getById(value);

            return task ? task.get('name') : '—';
        },

        handleValidate : function() {
            let me = this;

            criterion.Msg.confirm(
                i18n.gettext('Validate'),
                i18n.gettext('Do you want to validate GL account map?'),
                function(btn) {
                    if (btn === 'yes') {
                        criterion.Api.requestWithPromise({
                            url : criterion.consts.Api.API.EMPLOYER_GL_ACCOUNT_MAP_VALIDATE,
                            params : {
                                employerId : me.getEmployerId()
                            },
                            method : 'GET'
                        }).then(function(result) {
                            if (result.hasErrors) {
                                criterion.Msg.confirm(
                                    i18n.gettext('Validate result'),
                                    i18n.gettext('GL account map has been validated and errors were found. Would you like to look through them?'),
                                    function(btn) {
                                        if (btn === 'yes') {
                                            window.open(
                                                criterion.Api.getSecureResourceUrl(
                                                    Ext.String.format(
                                                        criterion.consts.Api.API.EMPLOYER_GL_ACCOUNT_MAP_ERRORS_DOWNLOAD,
                                                        result.fileId
                                                    )
                                                ), '_blank'
                                            );
                                        } else {
                                            me.deleteValidationFile(result.fileId);
                                        }
                                    }
                                );
                            } else {
                                criterion.Msg.info(
                                    i18n.gettext('GL account map has been validated. Errors were not found.')
                                );
                            }
                        });
                    }
                }
            );
        },

        deleteValidationFile : function(fileId) {
            criterion.Api.request({
                url : Ext.String.format(criterion.consts.Api.API.EMPLOYER_GL_ACCOUNT_MAP_ERRORS, fileId),
                method : 'DELETE',
                scope : this
            });
        }
    };

});
