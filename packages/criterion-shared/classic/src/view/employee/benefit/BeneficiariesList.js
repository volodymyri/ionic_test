Ext.define('criterion.view.employee.benefit.BeneficiariesList', function() {

    return {
        alias : 'widget.criterion_employee_benefit_beneficiaries_list',

        extend : 'Ext.form.FieldContainer',

        mixins : [
            'Ext.util.StoreHolder'
        ],

        layout : 'vbox',

        viewModel : {
            data : {
                checkedPerson : {},
                checkedPersonPercent : {},
                totalSum : 0,
                hasSelected : false,
                hasWrongNumber : false,
                validation : '',
                readOnlyMode : false
            },

            formulas : {
                total : function(data) {
                    return data('hasWrongNumber') ? '<span class="criterion-red">Please check input!</span>' : (
                        Ext.util.Format.percentNumber(data('totalSum')) + data('validation')
                    );
                }
            }
        },

        bodyPadding : '0 0 5 5',

        /**
         * @required
         */
        store : null,

        initComponent : function() {
            this.bindStore(Ext.StoreManager.lookup(this.store));
            this.items = this.createItems();
            this.callParent(arguments);

            var me = this,
                vm = this.getViewModel(),
                fn = function() {
                    var sum = 0,
                        hasSelected = false,
                        hasWrongNumber = false,
                        checkedPersonPercent = this.get('checkedPersonPercent'),
                        checkedPerson = this.get('checkedPerson'),
                        checkedPersonEffectiveDate = this.get('checkedPersonEffectiveDate'),
                        checkedPersonExpirationDate = this.get('checkedPersonExpirationDate'),
                        checkedPersonIds = [];

                    Ext.Object.each(checkedPerson, function(key, val) {
                        if (val) {
                            var perc = Ext.Number.parseFloat(checkedPersonPercent[key] || 0),
                                effectiveDate = Ext.Number.parseFloat(checkedPersonEffectiveDate[key] || 0),
                                expirationDate = Ext.Number.parseFloat(checkedPersonExpirationDate[key] || 0);

                            if (perc < 0 || perc > 100) {
                                hasWrongNumber = true;
                            }

                            hasSelected = true;
                            sum += perc;

                            checkedPersonIds.push(parseInt(key, 10));
                        }
                    });

                    sum = Math.round(sum * 100) / 100;

                    this.set({
                        totalSum : sum,
                        hasSelected : hasSelected,
                        hasWrongNumber : hasWrongNumber,
                        validation : (sum !== 100) ? ' <span class="criterion-red">&larr; must be 100%</span>' : ''
                    });

                    me.fireEvent('changeSelectedPersons', checkedPersonIds);
                };

            vm.bind(
                {
                    bindTo : '{checkedPersonPercent}',
                    deep : true
                },
                fn
            );
            vm.bind(
                {
                    bindTo : '{checkedPerson}',
                    deep : true
                },
                fn
            );

            vm.bind(
                {
                    bindTo : '{checkedPersonEffectiveDate}',
                    deep : true
                },
                fn
            );

            vm.bind(
                {
                    bindTo : '{checkedPersonExpirationDate}',
                    deep : true
                },
                fn
            );

            vm.bind(
                {
                    bindTo : '{totalSum}',
                    deep : true
                },
                function(value) {
                    me.fireEvent('changeTotal', value);
                }
            );
        },

        getStoreListeners : function() {
            return {
                load : this.reconstruct,
                filterchange : this.reconstruct
            }
        },

        reconstruct : function() {
            this.removeAll();
            this.add(this.createItems());
            this.add({
                xtype : 'container',
                layout : {
                    type : 'hbox',
                    align : 'stretch'
                },
                style : {
                    borderColor : '#EEE',
                    borderStyle : 'solid'
                },
                margin : '5 0 5 5',
                border : '1 0 0 0',
                bind : {
                    hidden : '{!hasSelected}'
                },
                items : [
                    {
                        xtype : 'component',
                        html : i18n.gettext('Total :'),
                        width : 200
                    },
                    {
                        xtype : 'component',
                        bind : {
                            html : '{total}'
                        }
                    }
                ]
            });
        },

        createItems : function() {
            var result = [],
                vm = this.getViewModel(),
                store = this.getStore();

            // reset
            vm.set({
                checkedPerson : {},
                checkedPersonPercent : {},
                checkedPersonEffectiveDate : {},
                checkedPersonExpirationDate : {},
                totalSum : 0,
                hasSelected : false,
                hasWrongNumber : false,
                validation : ''
            });

            store && store.getData().each(function(record) {
                var recId = record.getId();

                vm.set('checkedPerson.' + recId, false);

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
                                        xtype : 'checkbox',
                                        disableDirtyCheck : true,
                                        boxLabel : record.get('firstName') + ' ' + record.get('lastName'),
                                        width : 201,
                                        bind : {
                                            value : '{checkedPerson.' + recId + '}',
                                            readOnly : '{readOnlyMode}'
                                        }
                                    },
                                    {
                                        xtype : 'numberfield',
                                        disableDirtyCheck : true,
                                        bind : {
                                            hidden : '{!checkedPerson.' + recId + '}',
                                            value : '{checkedPersonPercent.' + recId + '}',
                                            readOnly : '{readOnlyMode}'
                                        },
                                        hidden : true,
                                        width : 80,
                                        margin : '0 0 5 0'
                                    },
                                    {
                                        xtype : 'component',
                                        html : '%',
                                        bind : {
                                            hidden : '{!checkedPerson.' + recId + '}'
                                        },
                                        hidden : true,
                                        margin : '10 0 0 5'
                                    }
                                ]
                            },
                            {
                                xtype : 'container',
                                layout : 'hbox',
                                margin : '10 0',
                                hidden : true,
                                bind : {
                                    hidden : '{!checkedPerson.' + recId + '}'
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
                                            value : '{checkedPersonEffectiveDate.' + recId + '}',
                                            maxValue : '{checkedPersonExpirationDate.' + recId + '}',
                                            allowBlank : '{!checkedPerson.' + recId + '}'
                                        }
                                    },
                                    {
                                        xtype : 'datefield',
                                        fieldLabel : i18n.gettext('Expiration Date'),
                                        bind : {
                                            readOnly : '{readOnlyMode}',
                                            value : '{checkedPersonExpirationDate.' + recId + '}',
                                            minValue : '{checkedPersonEffectiveDate.' + recId + '}'
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

        isValid : function() {
            var vm = this.getViewModel();

            return !vm.get('hasSelected') || (vm.get('validation') === '' && !vm.get('hasWrongNumber'));
        },

        getValue : function() {
            var vm = this.getViewModel(),
                checkedPersonPercent = vm.get('checkedPersonPercent'),
                checkedPersonEffectiveDate = vm.get('checkedPersonEffectiveDate'),
                checkedPersonExpirationDate = vm.get('checkedPersonExpirationDate'),
                res = {},
                checkedPerson = vm.get('checkedPerson');

            Ext.Object.each(checkedPerson, function(key, val) {
                if (val) {
                    res[key] = {
                        percent : checkedPersonPercent[key],
                        effectiveDate : checkedPersonEffectiveDate[key],
                        expirationDate : checkedPersonExpirationDate[key]
                    };
                }
            });

            return res;
        },

        setReadOnly : function(value) {
            this.getViewModel().set('readOnlyMode', value);
        }

    };
});

