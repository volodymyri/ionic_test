Ext.define('criterion.controller.employer.CompanyForm', function() {

    return {
        alias : 'controller.criterion_employer_company_form',

        extend : 'criterion.controller.FormView',

        requires : [
            'criterion.view.WorkLocationsSelector',
            'criterion.view.employer.MassCreateEmployeeLogin'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        terminationDate : null,
        employerLegalName : null,
        terminationReasonCd : null,

        handleAfterRecordLoad : function(employerRecord) {
            let vm = this.getViewModel(),
                employerId;

            vm.set('editMode', !employerRecord.phantom);

            if (!employerRecord.phantom) {
                employerId = employerRecord.get('id');
                this.lookupReference('customfieldsEmployer').getController().load(employerId);
                this.lookupReference('companyLogo').setEmployerId(employerId);
            } else {
                this.lookupReference('customfieldsEmployer').getController().load(null);
                this.lookupReference('companyLogo').setNoLogo();
            }

            this.callParent(arguments);
        },

        handleRecordUpdate : function(record) {
            let me = this,
                view = this.getView(),
                params = {};

            view.fireEvent('save', record);

            if (this.terminationDate && this.employerLegalName && this.terminationReasonCd) {
                params = {
                    terminationDate : Ext.Date.format(this.terminationDate, 'Y.m.d'),
                    employerLegalName : this.employerLegalName,
                    terminationReasonCd : this.terminationReasonCd
                }
            }

            record.save({
                params : params,
                success : employerRecord => {
                    let employerId = employerRecord.getId();

                    me.terminationDate = null;
                    me.employerLegalName = null;
                    me.terminationReasonCd = null;

                    me.lookupReference('customfieldsEmployer').getController().save(employerId).then(() => {
                        criterion.Utils.toast(i18n.gettext('Company saved.'));
                        me.fireEvent('employerChanged', employerRecord, {});

                        me.onAfterSave.call(me, view, record);
                    });
                },
                failure : () => {
                    record.reject();
                }
            });
        },

        handleLogoUploadSuccess : function() {
            let record = this.getRecord();

            record.set('modified', new Date());
            record.save();
        },

        handleDateFormatChange : function(cmp, value) {
            Ext.query('small.dateFormatDemo', false)[0].setHtml(Ext.util.Format.date(new Date(), value || 'g:i A'));
        },

        handleTimeFormatChange : function(cmp, value) {
            Ext.query('small.timeFormatDemo', false)[0].setHtml(Ext.util.Format.date(new Date(), value || 'g:i A'));
        },

        handleSelectAction : function(combo, value) {
            combo.reset();

            switch (value) {
                case 'create_employee_login':
                    this.createMassEmployeeLogin();
                    break;

            }
        },

        createMassEmployeeLogin : function() {
            let selectWindow,
                employerId = this.getRecord().getId();

            selectWindow = Ext.create('criterion.view.employer.MassCreateEmployeeLogin', {
                viewModel : {
                    data : {
                        employerId : employerId,
                        storeParams : {
                            employerId : employerId
                        }
                    }
                }
            });
            selectWindow.on('destroy', function() {
                this.setCorrectMaskZIndex(true);
            }, this);

            selectWindow.show();
            this.setCorrectMaskZIndex(true);
        },

        handleSelectWorkLocation : function() {
            let employer = this.getRecord(),
                employerId = this.getRecord().getId(),
                employerWorkLocations = employer.employerWorkLocations(),
                selectWorkLocationWindow;

            selectWorkLocationWindow = Ext.create('criterion.view.WorkLocationsSelector', {
                viewModel : {
                    data : {
                        selectedRecords : employerWorkLocations
                    }
                }
            });

            selectWorkLocationWindow.on('select', function(newEmployerWorkLocations, primaryEmployerWorkLocationId) {
                employerWorkLocations.rejectChanges();

                if (!newEmployerWorkLocations.length) {
                    employerWorkLocations.removeAll();
                    return
                }

                Ext.Array.each(newEmployerWorkLocations, function(newEmployerWorkLocation) {
                    let workLocationId = newEmployerWorkLocation.getId(),
                        existingRecord = employerWorkLocations.findRecord('workLocationId', workLocationId, 0, false, false, true),
                        newRecord = !existingRecord && employerWorkLocations.add({
                            employerId : employerId,
                            workLocationId : workLocationId,
                            isPrimary : workLocationId === primaryEmployerWorkLocationId
                        })[0];

                    if (existingRecord) {
                        if (existingRecord.get('workLocationId') === primaryEmployerWorkLocationId) {
                            existingRecord.set('isPrimary', true);
                        } else {
                            existingRecord.set('isPrimary', false);
                        }
                    }

                    if (newRecord) {
                        newRecord.setWorkLocation(newEmployerWorkLocation);
                        newRecord.set('description', newEmployerWorkLocation.get('description'));
                    }

                    employerWorkLocations.each(function(employerWorkLocation) {
                        if (Ext.Array.pluck(newEmployerWorkLocations, 'id').indexOf(employerWorkLocation.get('workLocationId')) === -1) {
                            employerWorkLocation.drop();
                        }
                    });
                });

            }, this);

            selectWorkLocationWindow.on('destroy', function() {
                this.setCorrectMaskZIndex(true);
            }, this);

            selectWorkLocationWindow.show();
            this.setCorrectMaskZIndex(true);
        },

        handleActiveChange : function(cmp, newVal, oldVal) {
            let me = this,
                record = this.getRecord(),
                legalName = record.get('legalName');

            if (!newVal && oldVal && record.get('isActive')) {
                criterion.Api.requestWithPromise({
                    url : Ext.String.format(criterion.consts.Api.API.ACTIVE_EMPLOYEES_COUNT, record.getId()),
                    method : 'GET'
                }).then(function(result) {
                    let wnd = Ext.create('criterion.ux.form.Panel', {
                        title : i18n.gettext('Warning'),

                        resizable : false,

                        bodyPadding : 10,

                        modal : true,
                        alwaysOnTop : true,

                        plugins : {
                            ptype : 'criterion_sidebar',
                            width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                            height : 'auto',
                            modal : true
                        },
                        viewModel : {
                            data : {
                                terminationDate : null,
                                employerLegalName : null,
                                terminationReasonCd : null
                            },
                            formulas : {
                                disableSave : function(get) {
                                    return !get('terminationDate') || get('employerLegalName') !== legalName || !get('terminationReasonCd');
                                }
                            }
                        },

                        cls : 'criterion-modal',

                        items : [
                            {
                                html : Ext.String.format(i18n.gettext('There are {0} active employee(s) with employer {1}. All the employees will be terminated on the following date'),
                                    result.activeEmployeesCount, legalName),
                                margin : '0 0 20 0'
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Termination Reason'),
                                codeDataId : criterion.consts.Dict.TERMINATION,
                                allowBlank : false,
                                bind : '{terminationReasonCd}'
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Termination Date'),
                                bind : '{terminationDate}'
                            },
                            {
                                html : i18n.gettext('This action cannot be undone. Please type in the full name of the employer'),
                                margin : '0 0 20 0'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Employer Name'),
                                bind : '{employerLegalName}'
                            }
                        ],

                        bbar : [
                            '->',
                            {
                                xtype : 'button',
                                text : i18n.gettext('Cancel'),
                                cls : 'criterion-btn-light',
                                listeners : {
                                    click : function() {
                                        cmp.setValue(oldVal);
                                        wnd.destroy();
                                    }
                                }
                            },
                            {
                                xtype : 'button',
                                cls : 'criterion-btn-primary',
                                text : i18n.gettext('OK'),
                                disabled : true,
                                bind : {
                                    disabled : '{disableSave}'
                                },
                                listeners : {
                                    click : function() {
                                        let vm = wnd.getViewModel();

                                        me.terminationDate = vm.get('terminationDate');
                                        me.employerLegalName = vm.get('employerLegalName');
                                        me.terminationReasonCd = vm.get('terminationReasonCd');

                                        wnd.destroy();
                                    }
                                }
                            }
                        ]
                    });

                    wnd.show();
                })
            }
        }
    };

});
