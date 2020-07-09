Ext.define('criterion.view.ess.time.AvailabilityForm', function() {

    return {

        alias : 'widget.criterion_selfservice_time_availability_form',

        extend : 'criterion.view.WeekFormView',

        viewModel : {

            data : {
                /**
                 * @type criterion.model.employee.UnavailableBlock
                 */
                record : null
            },

            formulas : {
                readOnly : function(data) {
                    return data('record.isTimeOff');
                },
                hideSave : function(data) {
                    return data('record.isTimeOff');
                },
                hideDelete : function(data) {
                    return data('hideDeleteInt') || data('record.isTimeOff');
                }
            }
        },

        requires : [
            'criterion.controller.ess.time.AvailabilityForm'
        ],

        controller : {
            type : 'criterion_selfservice_time_availability_form',
            externalUpdate : false
        },

        bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.SIMPLE_FORM,

        getRecurrenceEndDateField : function() {
            var today = Ext.Date.clearTime(new Date());

            return {
                xtype : 'datefield',
                fieldLabel : i18n.gettext('End Date'),
                allowBlank : false,
                maxValue : Ext.Date.add(today, Ext.Date.YEAR, 1),
                minValue : Ext.Date.add(today, Ext.Date.DAY, 1),
                bind : {
                    value : '{record.recurringEndDate}',
                    disabled : '{!record.recurring}',
                    hidden : '{!record.recurring}',
                    readOnly : '{readOnly}'
                }
            }
        },

        getBaseFields : function() {
            return [
                this.getNameField(),
                Ext.apply(this.getStartField(), {
                    margin : '0 0 15 0'
                }),
                Ext.apply(this.getEndField(), {
                    margin : '0 0 15 0'
                }),
                {
                    xtype : 'displayfield',
                    fieldLabel : i18n.gettext('Timezone'),
                    name : 'timezone',
                    bind : '{timezone}'
                },
                this.getFullDayField(),
                this.getRecurrenceField(),
                this.getRecurrenceEndDateField(),
                {
                    xtype : 'toggleslidefield',
                    fieldLabel : i18n.gettext('Time Off'),
                    labelAlign : 'left',
                    name : 'isTimeOff',
                    inputValue : true,
                    disabled : true,
                    bind : {
                        value : '{record.isTimeOff}'
                    }
                }
            ];
        }
    }
});
