Ext.define('criterion.view.settings.benefits.benefit.Enroll', {

    extend : 'criterion.ux.grid.Panel',

    requires : [
        'criterion.controller.settings.benefits.benefit.Enroll',
        'criterion.store.employer.benefitPlan.EligibleEmployees'
    ],

    alias : 'widget.criterion_settings_benefits_benefit_enroll',

    viewModel : {
        data : {
            /**
             * @type {criterion.model.employer.BenefitPlan}
             */
            planRecord : null,
            selected : 0
        },
        formulas : {
            selectionText : {
                bind : {
                    selected : '{selected}',
                    employees : '{employees}'
                },
                get : function(data) {
                    return Ext.String.format(i18n.gettext('{0} of {1} eligible employees selected'), data.selected, data.employees.getTotalCount())
                }
            }
        },
        stores : {
            employees : {
                type : 'criterion_employer_benefitplan_eligible_employees',
                remoteSort : true,
                session: true // save state while paginating
            }
        }
    },

    controller : {
        type : 'criterion_settings_benefits_benefit_enroll'
    },

    listeners : {
        show : 'onShow',
        deselect : 'onDeselect',
        select : 'onSelect'
    },

    viewConfig : {
        listeners : {
            refresh : 'onRefresh'
        }
    },

    session: true,

    plugins : [
        {
            ptype : 'criterion_sidebar',
            modal : true,
            width : '100%',
            height : '100%'
        }
    ],

    title : i18n.gettext('Enroll Plan'),

    dockedItems : [
        {
            xtype : 'panel',
            dock : 'top',
            title : i18n.gettext('Default Options'),
            reference : 'optionGroups',
            layout : 'hbox',
            defaults : {
                padding : '10 25',
                flex : 1,
                maxWidth : criterion.Consts.UI_DEFAULTS.FORM_ITEM_WIDTH
            },
            items : [
                // dynamic
            ]
        },
        {
            xtype : 'toolbar',
            dock : 'bottom',
            items : [
                {
                    xtype : 'criterion_toolbar_paging',
                    dock : 'bottom',
                    displayInfo : true,
                    pageSizeOptions : [25],
                    bind : {
                        store : '{employees}'
                    }
                },
                {
                    xtype : 'component',
                    bind : {
                        html : '{selectionText}'
                    }
                },
                '->',
                {
                    text : i18n.gettext('Cancel'),
                    cls : 'criterion-btn-light',
                    listeners : {
                        click : 'onCancel'
                    }
                },
                {
                    text : i18n.gettext('Enroll'),
                    cls : 'criterion-btn-primary',
                    listeners : {
                        click : 'onEnroll'
                    }
                }
            ]
        }
    ],

    bind : {
        store : '{employees}'
    },

    selModel : {
        selType : 'checkboxmodel',
        mode : 'MULTI',
        pruneRemoved : false,
        checkOnly : true,
        showHeaderCheckbox : true
    },

    columns : [
        // dynamic
    ],

    initComponent : function() {
        var vm = this.getViewModel(),
            planRecord = vm.get('planRecord'),
            me = this;

        if (!planRecord) {
            throw ('No planRecord passed.');
        }

        var groups = [];

        Ext.Array.each(planRecord.getGroupFields(), function(fieldName, idx) {
            if (planRecord.get(fieldName)) {
                var ogIdx = idx + 1;

                if (planRecord.get(Ext.String.format('optionGroup{0}IsManual', ogIdx))) {
                    groups.push({
                        xtype : 'numberfield',
                        fieldLabel : planRecord.get(fieldName),
                        optionGroup : ogIdx,
                        labelAlign : 'top',
                        allowBlank : false
                    });
                } else {
                    var store = Ext.create('criterion.store.employer.benefit.Options'),
                        hasBeneficiaries = false,
                        hasDependents = false;

                    planRecord.options().each(function(option) {
                        if (option.get('isActive') && option.get('optionGroup') == ogIdx) {
                            store.add(option);
                            if (option.get('isAllowBeneficiary')) {
                                hasBeneficiaries = true;
                            }
                            if (option.get('isAllowDependent')) {
                                hasDependents = true;
                            }
                        }
                    });

                    groups.push({
                        xtype : 'combobox',
                        fieldLabel : planRecord.get(fieldName),
                        store : store,
                        queryMode : 'local',
                        displayField : 'code',
                        valueField : 'id',
                        labelAlign : 'top',
                        value : store.count() ? store.getAt(0).getId() : null,
                        optionGroup : ogIdx,
                        allowBlank : false,
                        listeners : {
                            change : function(cmp) {
                                var employees = me.getStore(),
                                    selection = this.getSelection(),
                                    isAllowBeneficiaryFieldName = 'isAllowBeneficiary_' + cmp.optionGroup,
                                    isAllowDependentFieldName = 'isAllowDependent_' + cmp.optionGroup;

                                employees.each(function(record) {
                                    if (!record.get('optionGroup' + cmp.optionGroup)) {
                                        var allowValue = {};
                                        allowValue[isAllowBeneficiaryFieldName] = selection && selection.get('isAllowBeneficiary') || false;
                                        allowValue[isAllowDependentFieldName] = selection && selection.get('isAllowDependent') || false;

                                        record.set(allowValue);
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });

        this.callParent(arguments);

        if (groups.length) {
            this.lookupReference('optionGroups').add(groups);
        } else {
            this.lookupReference('optionGroups').hide();
        }
    },

    isValid : function() {
        var isValid = true;

        this.lookupReference('optionGroups').items.each(function(field) {
            isValid = isValid && field.isValid()
        });

        return isValid;
    }
});