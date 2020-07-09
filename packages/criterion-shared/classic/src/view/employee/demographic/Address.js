Ext.define('criterion.view.employee.demographic.Address', function() {

    return {
        alias : 'widget.criterion_employee_demographic_address',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.employee.demographic.Address'
        ],

        controller : {
            type : 'criterion_employee_demographic_address'
        },

        title : i18n._('Address'),

        layout : 'hbox',
        defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,
        bodyPadding : 0,

        plugins : [
            'criterion_responsive_column'
        ],

        viewModel : {
            data : {
                readOnly : null
            },
            formulas : {
                mailingReadOnly : function(data) {
                    return data('readOnly') || data('address.isMailingAddress');
                },
                mailingAddress : {
                    get : function(data) {
                        return data('address.isMailingAddress');
                    },
                    set : Ext.emptyFn
                },
                schoolDistrict : function(data) {
                    var schdistName = data('address.schdistName'),
                        schdist = data('address.schdist');

                    if (schdistName) {
                        schdistName += schdist ? Ext.util.Format.format(' ({0})', schdist) : '';
                    } else {
                        schdistName = schdist;
                    }

                    return schdistName;
                },
                blockGeocode : function(data) {
                    return data('readOnly') || !data('address.postalCode') || (data('address.postalCode').length < 5);
                }
            }
        },

        modelValidation : true,

        listeners : {
            scope : 'controller',
            changeGeoCode : 'handleChangeGeoCode'
        },

        initComponent : function() {
            var me = this,
                DICT = criterion.consts.Dict;

            me.items = [
                {
                    xtype : 'container',

                    items : [
                        {
                            xtype : 'criterion_code_detail_field',
                            codeDataId : DICT.ADDRESS_LOCATION,
                            fieldLabel : i18n._('Location type'),
                            bind : {
                                value : '{address.addressLocationCd}',
                                readOnly : '{readOnly}'
                            }
                        },
                        {
                            xtype : 'criterion_code_detail_field',
                            codeDataId : DICT.COUNTRY,
                            reference : 'countryCDField',
                            fieldLabel : i18n._('Country'),
                            bind : {
                                value : '{address.countryCd}',
                                readOnly : '{readOnly}'
                            }
                        },
                        {
                            xtype : 'textfield',
                            fieldLabel : i18n._('Address 1'),
                            bind : {
                                value : '{address.address1}',
                                readOnly : '{readOnly}'
                            }
                        },
                        {
                            xtype : 'textfield',
                            fieldLabel : i18n._('Address 2'),
                            bind : {
                                value : '{address.address2}',
                                readOnly : '{readOnly}'
                            }
                        },
                        {
                            xtype : 'textfield',
                            reference : 'cityField',
                            fieldLabel : i18n._('City'),
                            bind : {
                                value : '{address.city}',
                                readOnly : '{readOnly}'
                            }
                        },
                        {
                            xtype : 'criterion_code_detail_field',
                            reference : 'stateField',
                            codeDataId : DICT.STATE,
                            fieldLabel : i18n._('State'),
                            allowBlank : false,
                            bind : {
                                value : '{address.stateCd}',
                                readOnly : '{readOnly}',
                                filterValues : {
                                    attribute : 'attribute1',
                                    value : '{countryCDField.selection.code}'
                                }
                            }
                        }
                    ]
                },
                {
                    xtype : 'container',

                    items : [
                        {
                            xtype : 'toggleslidefield',
                            fieldLabel : i18n._('Mailing Address'),
                            margin : '50 0 20',
                            name : 'isMailingAddress',
                            bind : {
                                value : '{mailingAddress}',
                                readOnly : '{mailingReadOnly}'
                            }
                        },
                        {
                            xtype : 'textfield',
                            fieldLabel : i18n._('County'),
                            name : 'county',
                            readOnly : true,
                            bind : {
                                value : '{address.county}'
                            }
                        },
                        {
                            xtype : 'textfield',
                            reference : 'postalCodeField',
                            fieldLabel : i18n._('Zip Code'),
                            bind : {
                                value : '{address.postalCode}',
                                readOnly : '{readOnly}'
                            }
                        },
                        {
                            xtype : 'fieldcontainer',
                            fieldLabel : i18n._('Geocode / GNIS'),
                            layout : 'hbox',
                            anchor : '100%',
                            items : [
                                {
                                    xtype : 'textfield',
                                    reference : 'geocodeField',
                                    name : 'geocode',
                                    padding : '0 5 0 0',
                                    flex : 1,
                                    editable : false,
                                    bind : {
                                        value : '{address.geocode}',
                                        readOnly : '{blockGeocode}'
                                    }
                                },
                                {
                                    xtype : 'button',
                                    text : i18n._('Select'),
                                    cls : 'criterion-btn-primary',
                                    scale : 'small',
                                    action : 'select-employee-geocode-location',
                                    listeners : {
                                        click : 'handleSelectGeocode'
                                    },
                                    disabled : true,
                                    bind : {
                                        disabled : '{blockGeocode}',
                                        hidden : '{readOnly}'
                                    }
                                }
                            ]
                        },
                        {
                            xtype : 'textfield',
                            fieldLabel : i18n._('School District'),
                            readOnly : true,
                            bind : {
                                value : '{schoolDistrict}'
                            }
                        }
                    ]
                }
            ];

            me.callParent(arguments);
        },

        clearFilters : function() {
            var stateField = this.lookupReference('stateField'),
                store = stateField.getStore();

            store.clearFilter(true);
        }
    };

});
