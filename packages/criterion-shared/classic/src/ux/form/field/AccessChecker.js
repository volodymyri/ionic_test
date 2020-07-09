Ext.define('criterion.ux.form.field.AccessChecker', function() {

    return {
        alternateClassName : [
            'criterion.form.field.AccessChecker'
        ],

        alias : [
            'widget.criterion_access_checker_field'
        ],

        extend : 'Ext.container.Container',
        
        mixins: {
            field: 'Ext.form.field.Field'
        },

        layout : {
            type : 'hbox',
            align : 'stretch'
        },
        defaults : {
            flex : 1,
            style : {
                textAlign : 'center'
            },
            padding : '0 0 5 0'
        },

        viewModel : {
            data : {
                sets : {
                    4 : ['1000', '0100', '0010', '0001'],
                    names : ['rule_1', 'rule_2', 'rule_3', 'rule_4']
                },

                rule_1 : false,
                rule_2 : false,
                rule_3 : false,
                rule_4 : false
            },

            formulas : {
                rule : {
                    get : function(get) {
                        var res = 0,
                            vaLs = {},
                            bits = this.get('sets')[4],
                            names = get('sets')['names'];

                        vaLs['rule_1'] = get('rule_1');
                        vaLs['rule_2'] = get('rule_2');
                        vaLs['rule_3'] = get('rule_3');
                        vaLs['rule_4'] = get('rule_4');

                        Ext.each(names, function(name, index) {
                            var val = vaLs[name];
                            if (val) {
                                res += parseInt(bits[index], 2);
                            }
                        });
                        return res;
                    },

                    set : function(value) {
                        var names = this.get('sets')['names'],
                            bits = this.get('sets')[4],
                            newCheck = {};

                        Ext.each(names, function(name, index) {
                            var bit = bits[index];

                            newCheck[name] = value & parseInt(bit, 2) ? true : false;
                        });

                        this.set(newCheck);
                    }
                }
            }
        },

        items : [
            {
                xtype : 'hiddenfield',
                valueField : true,
                bind : {
                    value : '{rule}'
                }
            },
            {
                xtype : 'checkbox',
                bind : {
                    value : '{rule_1}'
                },
                inputValue : '1000'
            },
            {
                xtype : 'checkbox',
                bind : {
                    value : '{rule_2}'
                },
                inputValue : '0100'
            },
            {
                xtype : 'checkbox',
                bind : {
                    value : '{rule_3}'
                },
                inputValue : '0010'
            },
            {
                xtype : 'checkbox',
                bind : {
                    value : '{rule_4}'
                },
                inputValue : '0001'
            }
        ],

        reset : function() {
            this.setValue(0);
        },

        getValue : function() {
            return this.down('[valueField]').getValue();
        },

        setValue : function(value) {
            this.down('[valueField]').setValue(value);
        },

        initComponent : function() {
            var me = this;

            this.callParent(arguments);
            this.getViewModel().bind(
                '{rule}',
                function(newVal, oldVal) {
                    me.fireEvent('change', me, newVal, oldVal);
                    me.publishState('value', newVal);
                },
                this
            );
        }

    };

});
