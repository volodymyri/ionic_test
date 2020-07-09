Ext.define('criterion.view.settings.benefits.benefit.OptionGroup', {

    extend : 'criterion.ux.Panel',

    alias : 'widget.criterion_settings_benefits_benefit_optiongroup',

    optionGroupId : null,

    viewModel : {
        data : {
            enabled : true,
            hasOptions : false,
            blockTypeChange : false
        },
        formulas : {
            canChangeType : function(vmget) {
                return !vmget('hasOptions') && !vmget('blockTypeChange')
            }
        }
    },

    initComponent : function() {
        var me = this,
            vm = this.getViewModel();

        this.items = [
            {
                xtype : 'container',
                cls : 'criterion-plan-form-option-group-header',
                items : [
                    {
                        xtype : 'toggleslidefield',
                        publish : 'value',
                        fieldLabel : i18n.gettext('Option Group') + ' ' + this.optionGroupId,
                        labelWidth : 'auto',
                        onText : i18n.gettext('On'),
                        offText : i18n.gettext('Off'),
                        bind : {
                            value : '{enabled}'
                        }
                    }
                ]
            },
            {
                xtype : 'container',
                bind : {
                    hidden : '{!enabled}'
                },
                items : [
                    {
                        xtype : 'container',
                        layout : 'hbox',
                        padding : '10 25',
                        items : [
                            {
                                xtype : 'textfield',
                                labelWidth : 'auto',
                                bind : {
                                    value : Ext.String.format('{plan.optionGroup{0}}', this.optionGroupId),
                                    disabled : '{!enabled}'
                                },
                                fieldLabel : i18n.gettext('Group Name'),
                                itemId : 'name',
                                allowBlank : false
                            },
                            {
                                xtype : 'toggleslidefield',
                                labelWidth : 'auto',
                                padding : '0 0 0 25',
                                publish : 'value',
                                bind : {
                                    value : Ext.String.format('{plan.optionGroup{0}IsManual}', this.optionGroupId),
                                    disabled : '{!canChangeType}',
                                    hidden : '{!enabled}'
                                },
                                fieldLabel : i18n.gettext('Manual'),
                                itemId : 'manual'
                            }
                        ]
                    },
                    {
                        xtype : 'criterion_settings_benefit_options_grid',
                        padding : 0,
                        reference : Ext.String.format('optionGroup{0}Grid', this.optionGroupId),
                        optionGroupId : this.optionGroupId,
                        bind : {
                            hidden : Ext.String.format('{plan.optionGroup{0}IsManual}', this.optionGroupId)
                        },
                        store : {
                            type : 'employer_benefit_options',
                            listeners : {
                                datachanged : function() {
                                    vm.set('hasOptions', this.getCount());
                                }
                            }
                        }
                    }
                ]
            }
        ];

        this.callParent(arguments);
    },

    prepareForSave : function(defaultOptionId) {
        var vm = this.getViewModel(),
            me = this;

        if (!this.getEnabled()) {
            this.getOptionsStore().removeAll();
        } else {
            this.getOptionsStore().each(function(record) {
                record.set({
                    optionGroup : me.optionGroupId,
                    benefitPlanId : vm.get('plan.id')
                });

                if (Ext.isDefined(defaultOptionId) && record.getId() == defaultOptionId) {
                    record.set('isDefault', true)
                }
            })
        }
    },

    setEnabled : function(value) {
        this.getViewModel().set('enabled', value);
    },

    getEnabled : function() {
        return this.getViewModel().get('enabled');
    },

    getOptionsStore : function() {
        return this.down('grid').getStore();
    },

    getName : function() {
        return this.down('#name').getValue();
    },

    validate : function() {
        var vm = this.getViewModel();

        if (vm.get('enabled')) {
            var nameField = this.down('#name'),
                valid = nameField.validate() && vm.get(Ext.String.format('plan.optionGroup{0}', this.optionGroupId));

            if (!vm.get(Ext.String.format('plan.optionGroup{0}IsManual', this.optionGroupId)) && !this.getOptionsStore().count()) {
                criterion.Msg.warning(i18n.gettext('Option Group should have at least one option!'));
                valid = false;
            }

            return valid;
        } else {
            return true;
        }
    }
});