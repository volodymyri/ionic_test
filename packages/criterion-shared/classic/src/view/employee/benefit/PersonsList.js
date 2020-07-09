Ext.define('criterion.view.employee.benefit.PersonsList', function() {

    return {
        alias : 'widget.criterion_employee_benefit_persons_list',

        extend : 'Ext.form.FieldContainer',

        mixins : [
            'Ext.util.StoreHolder'
        ],

        layout : 'vbox',

        viewModel : {
            data : {
                readOnlyMode : false,
                checkedPerson : {},
                checkedPersonEffectiveDate : {},
                checkedPersonExpirationDate : {}
            }
        },

        bodyPadding : '0 0 5 5',

        initComponent : function() {
            this.items = this.createItems();
            this.callParent(arguments);
        },

        getStoreListeners : function() {
            return {
                load : function() {
                    this.reconstruct();
                }
            }
        },

        reconstruct : function() {
            this.removeAll();
            this.add(this.createItems());
        },

        setReadOnly : function(value) {
            this.getViewModel().set('readOnlyMode', value);
        },

        createItems : function() {
            var me = this,
                result = [],
                store = this.getStore();

            this.getViewModel().set({
                checkedPerson : {},
                checkedPersonEffectiveDate : {},
                checkedPersonExpirationDate : {}
            });

            store && store.each(function(record) {
                var personId = record.get('id');

                result.push(
                    {
                        xtype : 'container',
                        layout : 'vbox',
                        margin : '0 0 10 0',
                        items : [
                            {
                                xtype : 'container',
                                layout : {
                                    type : 'hbox',
                                    align : 'stretch'
                                },
                                items : [
                                    {
                                        xtype : 'checkboxfield',
                                        boxLabel : record.get('firstName') + ' ' + record.get('lastName'),
                                        name : me.nameField,
                                        bind : {
                                            readOnly : '{readOnlyMode}',
                                            value : '{checkedPerson.' + personId + '}'
                                        }
                                    }
                                ]
                            },
                            {
                                xtype : 'container',
                                layout : 'hbox',
                                margin : '10 0',
                                hidden : true,
                                bind : {
                                    hidden : '{!checkedPerson.' + personId + '}'
                                },
                                defaults : {
                                    labelAlign : 'top',
                                    width : 136
                                },
                                items : [
                                    {
                                        xtype : 'datefield',
                                        fieldLabel : i18n.gettext('Effective Date'),

                                        margin : '0 10 0 0',
                                        bind : {
                                            readOnly : '{readOnlyMode}',
                                            value : '{checkedPersonEffectiveDate.' + personId + '}',
                                            maxValue : '{checkedPersonExpirationDate.' + personId + '}',
                                            allowBlank : '{!checkedPerson.' + personId + '}'
                                        }
                                    },
                                    {
                                        xtype : 'datefield',
                                        margin : '5 0 0 0',
                                        fieldLabel : i18n.gettext('Expiration Date'),
                                        bind : {
                                            readOnly : '{readOnlyMode}',
                                            value : '{checkedPersonExpirationDate.' + personId + '}',
                                            minValue : '{checkedPersonEffectiveDate.' + personId + '}'
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                );
            });

            return result;
        },

        setValueWithOriginalValueReset : function(value) {
            var vm = this.getViewModel(),
                personContactIds = {},
                personContactEffectiveDate = {},
                personContactExpirationDate = {};

            Ext.Array.each(value.dependents, function(dependent) {
                var personContactId = dependent.personContactId;

                personContactIds[personContactId] = true;
                personContactEffectiveDate[personContactId] = dependent.effectiveDate;
                personContactExpirationDate[personContactId] = dependent.expirationDate;
                vm.set({
                    checkedPerson : personContactIds,
                    checkedPersonEffectiveDate : personContactEffectiveDate,
                    checkedPersonExpirationDate : personContactExpirationDate
                });
            });
        },

        getValue : function() {
            var vm = this.getViewModel(),
                checkedPerson = vm.get('checkedPerson'),
                checkedPersonEffectiveDate = vm.get('checkedPersonEffectiveDate'),
                checkedPersonExpirationDate = vm.get('checkedPersonExpirationDate'),
                res = {};

            Ext.Object.each(checkedPerson, function(key, val) {
                if (val) {
                    res[key] = {
                        effectiveDate : checkedPersonEffectiveDate[key],
                        expirationDate : checkedPersonExpirationDate[key]
                    };
                }
            });

            return res;
        }

    };
});
