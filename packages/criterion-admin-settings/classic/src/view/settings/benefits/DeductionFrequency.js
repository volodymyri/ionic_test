Ext.define('criterion.view.settings.benefits.DeductionFrequency', function() {

    return {
        alias : 'widget.criterion_settings_deduction_frequency',

        extend : 'criterion.view.FormView',

        requires : [],

        bodyPadding : 0,

        title : i18n.gettext('Deduction Frequency Details'),

        viewModel : {
            data : {},

            formulas : {
                payrollNumber : {
                    get : function(data) {
                        var vals = {},
                            res = [];

                        vals[1] = data('cb1');
                        vals[2] = data('cb2');
                        vals[3] = data('cb3');
                        vals[4] = data('cb4');
                        vals[5] = data('cb5');
                        vals[6] = data('cb6');

                        Ext.Object.each(vals, function(key, val) {
                            if (val) {
                                res.push(key);
                            }
                        });

                        return res;
                    },
                    set : function(value) {
                        var setVals = {};

                        Ext.each([1, 2, 3, 4, 5, 6], function(indx) {
                            setVals['cb' + indx] = false;
                        });

                        Ext.each(value, function(indx) {
                            setVals['cb' + indx] = true;
                        });

                        this.set(setVals);
                    }
                }
            }
        },

        items : [
            {

                bodyPadding : '0 10',

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                layout : 'hbox',

                plugins : [
                    'criterion_responsive_column'
                ],

                items : [
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                name : 'code',
                                fieldLabel : i18n.gettext('Code'),
                                allowBlank : false,
                                width : '100%'
                            },
                            {
                                xtype : 'textfield',
                                name : 'description',
                                fieldLabel : i18n.gettext('Description'),
                                width : '100%'
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Rate Unit'),
                                name : 'rateUnitCd',
                                allowBlank : false,
                                codeDataId : criterion.consts.Dict.RATE_UNIT
                            }
                        ]
                    },
                    // ===
                    {
                        items : [
                            {
                                xtype : 'toggleslidefield',
                                name : 'isActive',
                                fieldLabel : i18n.gettext('Active')
                            },
                            {
                                xtype : 'tagfield',
                                fieldLabel : i18n.gettext('Payroll Number / Month'),
                                bind : '{payrollNumber}',
                                valueField : 'id',
                                name : 'payrollNumber',
                                store : new Ext.data.Store({
                                    proxy : {
                                        type : 'memory'
                                    },
                                    data : [
                                        {id : 1, text : i18n.gettext('First')},
                                        {id : 2, text : i18n.gettext('Second')},
                                        {id : 3, text : i18n.gettext('Third')},
                                        {id : 4, text : i18n.gettext('Fourth')},
                                        {id : 5, text : i18n.gettext('Fifth')},
                                        {id : 6, text : i18n.gettext('Last')}
                                    ],
                                    sorters : [{
                                        property : 'id',
                                        direction : 'ASC'
                                    }]
                                })
                            },

                            {
                                xtype : 'hiddenfield',
                                name : 'first',
                                disableDirtyCheck : true,
                                bind : '{cb1}'
                            },
                            {
                                xtype : 'hiddenfield',
                                name : 'second',
                                disableDirtyCheck : true,
                                bind : '{cb2}'
                            },
                            {
                                xtype : 'hiddenfield',
                                name : 'third',
                                disableDirtyCheck : true,
                                bind : '{cb3}'
                            },
                            {
                                xtype : 'hiddenfield',
                                name : 'fourth',
                                disableDirtyCheck : true,
                                bind : '{cb4}'
                            },
                            {
                                xtype : 'hiddenfield',
                                name : 'fifth',
                                disableDirtyCheck : true,
                                bind : '{cb5}'
                            },
                            {
                                xtype : 'hiddenfield',
                                name : 'last',
                                disableDirtyCheck : true,
                                bind : '{cb6}'
                            }
                        ]
                    }
                ]
            }
        ],

        loadRecord : function(record) {
            var me = this,
                vm = this.getViewModel();

            this.callParent(arguments);

            vm.bind({
                bindTo : '{payrollNumber}',
                single : true
            }, function() {
                me.down('[name=payrollNumber]').resetOriginalValue();
            });

            vm.set({
                cb1 : record.get('first'),
                cb2 : record.get('second'),
                cb3 : record.get('third'),
                cb4 : record.get('fourth'),
                cb5 : record.get('fifth'),
                cb6 : record.get('last')
            });
        }
    };

});

