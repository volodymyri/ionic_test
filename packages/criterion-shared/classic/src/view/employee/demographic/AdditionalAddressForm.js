Ext.define('criterion.view.employee.demographic.AdditionalAddressForm', function() {

    return {
        alias : 'widget.criterion_employee_demographic_additional_address_form',

        extend : 'criterion.view.FormView',

        title : i18n.gettext('Additional Address'),

        requires : [
            'criterion.controller.employee.demographic.AdditionalAddressForm'
        ],

        viewModel : {
            data : {
                /**
                 * @type {criterion.model.person.Address}
                 */
                record : null,
                geocode : null,
                mailingReadOnly : null
            },
            formulas : {
                schoolDistrict : function(data) {
                    var schdistName = data('record.schdistName'),
                        schdist = data('record.schdist');

                    if (schdistName) {
                        schdistName += schdist ? Ext.util.Format.format(' ({0})', schdist) : '';
                    } else {
                        schdistName = schdist;
                    }

                    return schdistName;
                },

                hideSave : function(data) {
                    return !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_ADDITIONAL_ADDRESS, criterion.SecurityManager.UPDATE, false, true));
                },

                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_ADDITIONAL_ADDRESS, criterion.SecurityManager.DELETE, false, true));
                }
            }
        },

        controller : {
            type : 'criterion_employee_demographic_additional_address_form',
            externalUpdate : false
        },

        listeners : {
            scope : 'controller',
            changeGeoCode : 'handleChangeGeoCode'
        },

        layout : 'hbox',
        defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,

        items : [
            {
                items : [
                    {
                        xtype : 'criterion_code_detail_field',
                        codeDataId : criterion.consts.Dict.ADDRESS_LOCATION,
                        fieldLabel : i18n.gettext('Location type'),
                        bind : {
                            value : '{record.addressLocationCd}'
                        }
                    },
                    {
                        xtype : 'criterion_code_detail_field',
                        codeDataId : criterion.consts.Dict.COUNTRY,
                        reference : 'countryCDField',
                        fieldLabel : i18n.gettext('Country'),
                        bind : {
                            value : '{record.countryCd}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Address 1'),
                        bind : {
                            value : '{record.address1}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Address 2'),
                        bind : {
                            value : '{record.address2}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        reference : 'cityField',
                        fieldLabel : i18n.gettext('City'),
                        bind : {
                            value : '{record.city}'
                        }
                    },
                    {
                        xtype : 'criterion_code_detail_field',
                        codeDataId : criterion.consts.Dict.STATE,
                        fieldLabel : i18n.gettext('State'),
                        bind : {
                            value : '{record.stateCd}',
                            filterValues : {
                                attribute : 'attribute1',
                                value : '{countryCDField.selection.code}'
                            }
                        }
                    }
                ]
            },
            {
                items : [
                    {
                        xtype : 'toggleslidefield',
                        fieldLabel : i18n.gettext('Mailing Address'),
                        margin : '50 0 20',
                        bind : {
                            value : '{record.isMailingAddress}',
                            readOnly : '{mailingReadOnly}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('County'),
                        bind : {
                            value : '{record.county}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        reference : 'postalCodeField',
                        fieldLabel : i18n.gettext('Zip Code'),
                        bind : {
                            value : '{record.postalCode}'
                        }
                    },
                    {
                        xtype : 'fieldcontainer',
                        fieldLabel : i18n.gettext('Geocode / GNIS'),
                        layout : 'hbox',
                        anchor : '100%',
                        items : [
                            {
                                xtype : 'textfield',
                                reference : 'geocodeField',
                                bind : {
                                    value : '{record.geocode}'
                                },
                                flex : 1,
                                editable : false
                            },
                            {
                                xtype : 'button',
                                cls : 'criterion-btn-primary',
                                margin : '0 0 0 5',
                                text : i18n.gettext('Select'),
                                scale : 'small',
                                action : 'select-employee-geocode-location',
                                listeners : {
                                    click : 'handleSelectGeocode'
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('School District'),
                        readOnly : true,
                        bind : {
                            value : '{schoolDistrict}'
                        }
                    }
                ]
            }
        ]
    }
});
