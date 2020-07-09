Ext.define('criterion.view.settings.payroll.schedule.Period', function() {

    return {

        alias : 'widget.criterion_settings_payroll_schedule_period',

        extend : 'criterion.view.FormView',

        title : i18n.gettext('Payroll Period'),

        defaults : {
            labelWidth : 200
        },

        viewModel : {
            formulas : {
                submitBtnText : function(get) {
                    return get('blockedState') ? 'Please wait...' : (get('isPhantom') ? 'Generate' : 'Save')
                }
            }
        },

        controller : {
            type : 'criterion_formview',
            externalUpdate : false
        },

        bodyPadding : 20,

        items : [
            {
                xtype : 'numberfield',
                fieldLabel : i18n.gettext('Year'),
                name : 'year',
                allowBlank : false,
                bind : {
                    hidden : '{!isPhantom}',
                    disabled : '{!isPhantom}',
                    readOnly : '{!record.isFirst}'
                }
            },
            {
                xtype : 'datefield',
                fieldLabel : i18n.gettext('Start Date'),
                name : 'periodStartDate',
                allowBlank : false,
                bind : {
                    hidden : '{!isPhantom}',
                    disabled : '{!isPhantom}',
                    readOnly : '{!record.isFirst}'
                }
            },
            {
                xtype : 'numberfield',
                fieldLabel : i18n.gettext('Number of periods'),
                name : 'number',
                allowBlank : false,
                bind : {
                    hidden : '{!isPhantom}',
                    disabled : '{!isPhantom}'
                }
            },
            {
                xtype : 'datefield',
                fieldLabel : i18n.gettext('Pay Date'),
                name : 'payDate',
                allowBlank : false,
                bind : {
                    hidden : '{isPhantom}',
                    disabled : '{isPhantom}'
                }
            }
        ],

        /**
         * since first field in form can be hidden - switch focus object to the cancel button
         * for proper operation of z-index manager
         */
        focusFirstField : function() {
            var btn = this.down('[reference=cancel]');

            Ext.Function.defer(function() {
                btn && btn.focus && btn.focus();
            }, 100);
        }
    };

});
