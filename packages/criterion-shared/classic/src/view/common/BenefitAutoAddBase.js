Ext.define('criterion.view.common.BenefitAutoAddBase', function() {

    return {
        alias : 'widget.criterion_common_benefit_autoadd_base',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.common.BenefitAutoAddBase',
            'Ext.form.FieldSet'
        ],

        controller : {
            type : 'criterion_common_benefit_autoadd_base'
        },

        listeners : {
            scope : 'controller',
            afterrender : 'handleActivate'
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : 'auto'
            }
        ],

        viewModel : {
            data : {
                options : null,
                message : null,
                baseUrl : null,
                planRecord : null
            }
        },

        config : {
            planId : null
        },

        title : i18n.gettext('Plan Choice and Options'),

        layout : 'anchor',
        autoScroll : true,

        bodyPadding : 10,

        buttons : [
            {
                xtype : 'button',
                cls : 'criterion-btn-light',
                scale : 'small',
                text : i18n.gettext('Cancel'),
                handler : 'handleCancel'
            },
            {
                xtype : 'button',
                reference : 'saveButton',
                cls : 'criterion-btn-primary',
                scale : 'small',
                text : i18n.gettext('Save'),
                handler : 'handleSave'
            }
        ],

        items : [],

        createItems : function() {
            var me = this,
                vm = this.getViewModel(),
                planRecord = vm.get('planRecord'),
                planId = planRecord.getId(),
                planChoices = [],
                optionChoices = vm.get('options');

            this.removeAll();

            vm.get('message') && this.add(
                {
                    xtype : 'label',
                    bind : {
                        text : '{message}'
                    }
                }
            );

            for (var i = 1; i <= 4; i++) {
                var groupName = planRecord.get('optionGroup' + i),
                    isManual = planRecord.get('optionGroup' + i + 'IsManual'),
                    choices = [];

                if (isManual) {
                    choices = {
                        xtype : 'numberfield',
                        fieldLabel : groupName,
                        allowBlank : false,
                        isManual : isManual,
                        groupId : i,
                        padding : 10
                    }
                } else {
                    Ext.Array.each(optionChoices, function(choice) {
                        if (choice.optionGroup == i && choice.isActive) {
                            choices.push(
                                {
                                    boxLabel : choice.name,
                                    benefitPlanOptionId : choice.id,
                                    inputValue : choice.id,
                                    name : 'group_' + choice.optionGroup,
                                    isManual : isManual
                                }
                            );

                        }
                    });
                }

                if (groupName && choices) {
                    if (isManual) {
                        planChoices.push(choices);
                    } else {
                        choices.length && planChoices.push({
                            xtype : 'radiogroup',
                            items : choices,
                            title : groupName,
                            vertical : true,
                            columns : 1,
                            fieldLabel : groupName,
                            isManual : false,
                            groupId : i,
                            planId : planId,
                            allowBlank : false,
                            padding : 10
                        });
                    }
                }
            }

            me.add(
                {
                    xtype : 'fieldset',
                    reference : 'planOptions',
                    height : '200',
                    margin : '10 0 0 0',
                    cls : 'criterion-fieldsetHeader',
                    layout : 'fit',
                    title : planRecord.get('name'),
                    collapsible : false,
                    items : planChoices
                }
            );
            me.setPlanId(planId);
        }

    };

});
