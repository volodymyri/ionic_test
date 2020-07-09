describe("FormField Tests", function(t) {

    var app,
        field, fieldVm, record, WAIT_MS = 10, securityFieldToken = 'table.field',
        ACCESS = {
            VIEW : 'VIEW',
            EDIT : 'EDIT',
            NO : 'NO'
        };

    function makeField(config) {
        var cfg;

        cfg = Ext.Object.merge({
            renderTo : Ext.getBody()
        }, config || {});

        var xtype = cfg.xtype || 'textfield';
        delete cfg.xtype;

        field = Ext.createByAlias('widget.' + xtype, cfg);

        fieldVm = field.getViewModel();
    }

    function makeSecureRecord(access) {
        record = Ext.create('criterion.model.Test');
        typeof access !== 'undefined' && record.setSecurityDescriptor(makeSecurityDescriptor(access));
    }

    function makeFieldWithModelValueBind(fieldCfg) {
        makeField(Ext.apply({
            viewModel : {
                data : {
                    record : record
                }
            },
            bind : {
                value : '{record.value}'
            },
            modelValidation : true,
            securityAccessToken : securityFieldToken
        }, fieldCfg || {}))
    }

    function makeFieldWithModelSecurityBind(fieldCfg) {
        makeField(Ext.apply({
            viewModel : {
                data : {
                    record : record
                },
                formulas : {
                    tableTokenSecurity : criterion.SecurityManager.generateSecurityFormula('record', securityFieldToken)
                }
            },
            bind : {
                securityDescriptor : '{tableTokenSecurity}'
            }
        }, fieldCfg || {}))
    }

    function makeSecurityDescriptor(access) {
        var securityData = {};

        switch (access) {
            case ACCESS.NO :
                securityData[securityFieldToken] = {};
                break;
            case ACCESS.VIEW :
                securityData[securityFieldToken] = {
                    view : true
                };
                break;
            case ACCESS.EDIT :
                securityData[securityFieldToken] = {
                    view : true,
                    edit : true
                };
                break;
        }

        return securityData;
    }

    // setup environment

    // setup / teardown methods

    t.beforeEach(function() {

    });

    t.afterEach(function() {
        //field = Ext.destroy(field);
    });

    // helpers

    Ext.define('criterion.model.Test', {
        extend : 'criterion.data.Model',
        identifier : 'negative',
        fields : [
            {
                name : 'value',
                type : 'string',
                validators : [{type : 'presence'}],
                allowNull : true
            }
        ]
    });

    function mainTest() {

        t.describe('Security with value bind', function(t) {
            var fieldCfg = {};

            t.it('Should not apply security if no descriptor set on model', function(t) {
                makeSecureRecord();
                makeFieldWithModelValueBind(fieldCfg);

                t.chain({waitFor : WAIT_MS},
                    function(next) {
                        t.expect(field.isBlockedBySecurity()).toBe(false);
                        t.expect(field.readOnly).toBe(false);
                        t.expect(field.disabled).toBe(false);
                    }
                );
            });

            t.it('Should initialize normally with EDIT permission', function(t) {
                makeSecureRecord(ACCESS.EDIT);
                makeFieldWithModelValueBind(fieldCfg);

                t.chain({waitFor : WAIT_MS},
                    function(next) {
                        t.expect(field.isBlockedBySecurity()).toBe(false);
                        t.expect(field.readOnly).toBe(false);
                        t.expect(field.disabled).toBe(false);
                    }
                );
            });

            t.it('Should initialize read-only with VIEW permission', function(t) {
                makeSecureRecord(ACCESS.VIEW);
                makeFieldWithModelValueBind(fieldCfg);

                t.chain({waitFor : WAIT_MS},
                    function(next) {
                        t.expect(field.isBlockedBySecurity()).toBe(true);
                        t.expect(field.readOnly).toBe(true);
                        t.expect(field.disabled).toBe(false);
                    }
                );
            });

            t.it('Should initialize blocked with NO permission', function(t) {
                makeSecureRecord(ACCESS.NO);
                makeFieldWithModelValueBind(fieldCfg);

                t.chain({waitFor : WAIT_MS},
                    function(next) {
                        t.expect(field.isBlockedBySecurity()).toBe(true);
                        t.expect(field.disabled).toBe(true);
                    }
                );
            });

            t.it('Model validation with NO permission', function(t) {
                var spyToast = t.spyOn(criterion.Utils, 'toast').and.callThrough();

                makeSecureRecord(ACCESS.NO);
                makeFieldWithModelValueBind(fieldCfg);

                t.chain(
                    {
                        waitFor : WAIT_MS
                    },
                    function(next) {
                        t.expect(field.validate()).toBe(false);
                        t.expect(spyToast).toHaveBeenCalled(1);
                    }
                );
            });

            t.it('Model validation with VIEW permission, field is invalid', function(t) {
                var spyToast = t.spyOn(criterion.Utils, 'toast').and.callThrough();

                makeSecureRecord(ACCESS.VIEW);
                makeFieldWithModelValueBind(fieldCfg);

                t.chain(
                    {
                        waitFor : WAIT_MS
                    },
                    function(next) {
                        t.expect(field.validate()).toBe(false);
                        t.expect(spyToast).toHaveBeenCalled(1);
                    }
                );
            });

            t.it('Model validation with VIEW permission, field is valid', function(t) {
                var spyToast = t.spyOn(criterion.Utils, 'toast').and.callThrough();

                makeSecureRecord(ACCESS.VIEW);
                record.set('value', 'valid');
                makeFieldWithModelValueBind(fieldCfg);

                t.chain(
                    {
                        waitFor : WAIT_MS
                    },
                    function(next) {
                        t.expect(field.validate()).toBe(true);
                        t.expect(spyToast).toHaveBeenCalled(0);
                    }
                );
            });

            t.it('Model validation with EDIT permission', function(t) {
                var spyToast = t.spyOn(criterion.Utils, 'toast').and.callThrough();

                makeSecureRecord(ACCESS.EDIT);
                makeFieldWithModelValueBind(fieldCfg);
                field.setValue('valid');

                t.chain(
                    {
                        waitFor : WAIT_MS
                    },
                    function(next) {
                        t.expect(field.validate()).toBe(true);
                        t.expect(spyToast).toHaveBeenCalled(0);
                    }
                );
            });

            t.it('Restore pre-security state', function(t) {
                makeSecureRecord(ACCESS.NO);
                makeFieldWithModelValueBind();

                t.chain(
                    {
                        waitFor : WAIT_MS
                    },
                    function(next) {
                        t.diag('Initial security levels.');
                        t.expect(field.isBlockedBySecurity()).toBe(true);
                        t.expect(field.disabled).toBe(true);
                        fieldVm.set('record', null);
                        next();
                    },
                    {
                        waitFor : WAIT_MS
                    },
                    function(next) {
                        t.diag('Security after reset.');
                        t.expect(field.isBlockedBySecurity()).toBe(false);
                        t.expect(field.readOnly).toBe(false);
                        t.expect(field.disabled).toBe(false);
                    }
                );
            });

            t.it('Apply new record with different access level', function(t) {
                makeSecureRecord(ACCESS.NO);
                makeFieldWithModelValueBind();

                t.chain(
                    {
                        waitFor : WAIT_MS
                    },
                    function(next) {
                        t.diag('Initial security levels.');
                        t.expect(field.isBlockedBySecurity()).toBe(true);
                        t.expect(field.disabled).toBe(true);
                        t.expect(field.readOnly).toBe(false);

                        fieldVm.set('record', null);
                        makeSecureRecord(ACCESS.VIEW);
                        fieldVm.set('record', record);

                        next();
                    },
                    {
                        waitFor : WAIT_MS
                    },
                    function(next) {
                        t.diag('New security levels.');
                        t.expect(field.isBlockedBySecurity()).toBe(true);
                        t.expect(field.readOnly).toBe(true);
                        t.expect(field.disabled).toBe(false);
                    }
                );
            });

            // not supported now.. may be not necessary
            t.xit('Apply new security to same record', function(t) {
                makeSecureRecord(ACCESS.NO);
                makeFieldWithModelValueBind();

                t.chain(
                    {
                        waitFor : WAIT_MS
                    },
                    function(next) {
                        t.diag('Initial security levels.');
                        t.expect(field.isBlockedBySecurity()).toBe(true);
                        t.expect(field.disabled).toBe(true);
                        t.expect(field.readOnly).toBe(false);

                        record.setSecurityDescriptor(makeSecurityDescriptor(ACCESS.VIEW));

                        next();
                    },
                    {
                        waitFor : WAIT_MS
                    },
                    function(next) {
                        t.diag('New security levels.');
                        t.expect(field.isBlockedBySecurity()).toBe(true);
                        t.expect(field.readOnly).toBe(true);
                        t.expect(field.disabled).toBe(false);
                    }
                );
            });

        });

        t.describe('Security w/o value bind', function(t) {
            t.it('Should not apply security if no descriptor set on model', function(t) {
                makeSecureRecord();
                makeFieldWithModelSecurityBind();

                t.chain({waitFor : WAIT_MS},
                    function(next) {
                        t.expect(field.isBlockedBySecurity()).toBe(false);
                        t.expect(field.readOnly).toBe(false);
                        t.expect(field.disabled).toBe(false);
                    }
                );
            });

            t.it('Should initialize normally with EDIT permission', function(t) {
                makeSecureRecord(ACCESS.EDIT);
                makeFieldWithModelSecurityBind();

                t.chain({waitFor : WAIT_MS},
                    function(next) {
                        t.expect(field.isBlockedBySecurity()).toBe(false);
                        t.expect(field.readOnly).toBe(false);
                        t.expect(field.disabled).toBe(false);
                    }
                );
            });

            t.it('Should initialize read-only with VIEW permission', function(t) {
                makeSecureRecord(ACCESS.VIEW);
                makeFieldWithModelSecurityBind();

                t.chain({waitFor : WAIT_MS},
                    function(next) {
                        t.expect(field.isBlockedBySecurity()).toBe(true);
                        t.expect(field.readOnly).toBe(true);
                        t.expect(field.disabled).toBe(false);
                    }
                );
            });

            t.it('Should initialize blocked with NO permission', function(t) {
                makeSecureRecord(ACCESS.NO);
                makeFieldWithModelSecurityBind();

                t.chain({waitFor : WAIT_MS},
                    function(next) {
                        t.expect(field.isBlockedBySecurity()).toBe(true);
                        t.expect(field.disabled).toBe(true);
                    }
                );
            });

            t.it('Should apply security if descriptor was set after initialization', function(t) {
                record = Ext.create('criterion.model.Test');
                makeFieldWithModelSecurityBind();
                record.setSecurityDescriptor(makeSecurityDescriptor(ACCESS.NO));

                t.chain({waitFor : WAIT_MS},
                    function(next) {
                        t.expect(field.isBlockedBySecurity()).toBe(true);
                        t.expect(field.disabled).toBe(true);
                    }
                );
            });
        });

        t.describe('SSN field security', function(t) {
            t.it('Should initialize blocked with NO permission', function(t) {
                record = Ext.create('criterion.model.Test');
                makeFieldWithModelSecurityBind({
                    xtype : 'criterion_field_ssn',
                    activateHideValue : true
                });
                record.setSecurityDescriptor(makeSecurityDescriptor(ACCESS.NO));

                t.chain({waitFor : WAIT_MS},
                    function(next) {
                        t.expect(field.isBlockedBySecurity()).toBe(true);
                        t.expect(field.disabled).toBe(true);
                    }
                );
            });

        });
    }


    t.wait('require');

    Ext.require(['criterion.view.ux.form.field.SSN', 'criterion.overrides.form.field.Base', 'criterion.ux.form.field.Time', 'criterion.Consts'], function() {

        t.endWait('require');

        // start init
        t.wait('setup');

        criterion.detectDirtyForms = false;

        Ext.Deferred.sequence([
            function() {
                return criterion.Api.isAuthenticated();
            }
        ]).then(function() {
            app = Ext.create('criterion.Application', {name : 'ut'});

            Ext.GlobalEvents.on('baseStoresLoaded', function() {

                t.endWait('setup');

                mainTest()
            });
        });
    });


});
