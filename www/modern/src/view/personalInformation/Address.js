Ext.define('ess.view.personalInformation.Address', function() {

    return {
        alias : 'widget.ess_modern_personal_information_address',

        extend : 'Ext.form.Panel',

        title : 'Address',

        viewModel : {
            data : {
                readOnly : true,
                editMode : false
            },
            formulas : {
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
                isPendingWorkflow : function(vmget) {
                    var address = vmget('address'),
                        workflowLog;

                    if (address && Ext.isFunction(address.getWorkflowLog)) {
                        workflowLog = address.getWorkflowLog();

                        if (workflowLog && ['PENDING_APPROVAL', 'VERIFIED'].indexOf(workflowLog.get('stateCode')) != -1) {
                            return true;
                        }
                    }

                    return false;
                },
                updateIconCls : function(vmget) {
                    return vmget('isPendingWorkflow') ? 'md-icon-block' : 'md-icon-mode-edit';
                }
            }
        },

        defaults : {
            labelWidth : 150
        },

        items : [
            {
                xtype : 'ess_modern_menubar',
                docked: 'top',
                title : 'Address',

                buttons : [
                    {
                        type : 'back',
                        handler : function() {
                            this.up('ess_modern_personal_information_address').fireEvent('pageBack');
                        },
                        bind : {
                            hidden : '{editMode}'
                        }
                    },
                    {
                        xtype : 'button',
                        iconCls : 'md-icon-clear',
                        bind : {
                            hidden : '{!editMode}'
                        },
                        listeners : {
                            tap : function() {
                                this.up('ess_modern_personal_information_address').fireEvent('addressCancel');
                            }
                        }
                    }
                ],
                actions : [
                    {
                        xtype : 'button',
                        iconCls : 'md-icon-done',
                        bind : {
                            hidden : '{!editMode}'
                        },
                        listeners : {
                            tap : function() {
                                this.up('ess_modern_personal_information_address').fireEvent('addressSave');
                            }
                        }
                    },
                    {
                        xtype : 'button',
                        bind : {
                            hidden : '{editMode}',
                            iconCls : '{updateIconCls}'
                        },
                        listeners : {
                            tap : function() {
                                var view = this.up('ess_modern_personal_information_address'),
                                    vm = view.getViewModel();

                                if (!vm.get('isPendingWorkflow')) {
                                    vm.set({
                                        editMode : true,
                                        readOnly : false
                                    });
                                }
                            }
                        }
                    }
                ]
            },
            {
                xtype : 'criterion_code_detail_select',
                codeDataId : criterion.consts.Dict.ADDRESS_LOCATION,
                label : i18n.gettext('Location type'),
                required : true,
                bind : {
                    value : '{address.addressLocationCd}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'criterion_code_detail_select',
                codeDataId : criterion.consts.Dict.COUNTRY,
                label : i18n.gettext('Country'),
                required : true,
                bind : {
                    value : '{address.countryCd}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Address 1'),
                required : true,
                bind : {
                    value : '{address.address1}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Address 2'),
                bind : {
                    value : '{address.address2}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('City'),
                required : true,
                bind : {
                    value : '{address.city}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'criterion_code_detail_select',
                codeDataId : criterion.consts.Dict.STATE,
                label : i18n.gettext('State'),
                required : true,
                bind : {
                    value : '{address.stateCd}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'togglefield',
                label : i18n.gettext('Mailing Address'),
                name : 'isMailingAddress',
                bind : {
                    value : '{address.isMailingAddress}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Zip Code'),
                required : true,
                bind : {
                    value : '{address.postalCode}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('County'),
                name : 'county',
                readOnly : true,
                disabled : true,
                bind : {
                    value : '{address.county}'
                }
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Geocode / GNIS'),
                reference : 'geocodeField',
                name : 'geocode',
                readOnly : true,
                disabled : true,
                bind : {
                    value : '{geocode}'
                }
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('School District'),
                readOnly : true,
                disabled : true,
                bind : {
                    value : '{schoolDistrict}',
                    hidden : '{!schoolDistrict}'
                }
            },
            {
                xtype : 'container',
                cls : 'criterion-pending-changes-info',
                docked: 'bottom',
                bind : {
                    hidden : '{navMode}'
                },
                items : [
                    {
                        xtype : 'component',
                        margin : '10 20',
                        html : '<span>Highlighted</span> fields were recently changed and being reviewed.',
                        bind : {
                            hidden : '{!isPendingWorkflow}'
                        }
                    }
                ]
            }
        ]
    };

});
