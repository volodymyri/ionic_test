Ext.define('criterion.model.employee.timesheet.Income', function() {

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employee.timesheet.income.Date'
        ],

        disableCaching : true,

        idProperty : {
            name : 'id',
            type : 'string'
        },

        fields : [
            {
                name : 'paycode',
                type : 'integer'
            },
            {
                name : 'entityRef',
                type : 'integer'
            },
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'date',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'isDefault',
                type : 'boolean'
            },
            /**
             * @deprecated due to CRITERION-6614
             */
            {
                name : 'isActive',
                type : 'boolean'
            },
            /**
             * @deprecated due to CRITERION-7740
             */
            {
                name : 'isTrackable',
                type : 'boolean'
            },
            {
                name : 'isTrackableIncome',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isTrackableNow',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isUnits',
                type : 'boolean'
            },
            {
                name : 'isCompEarned',
                type : 'boolean'
            },
            {
                name : 'paycodeName',
                type : 'string',
                depends : ['paycode'],
                convert : function(val, rec) {
                    var PAYCODE = criterion.Consts.PAYCODE;

                    switch (rec.get('paycode')) {
                        case PAYCODE.INCOME :
                            return i18n.gettext('Incomes');
                            break;

                        case PAYCODE.TIME_OFF :
                            return i18n.gettext('Time Offs');
                            break;

                        case PAYCODE.HOLIDAY :
                            return i18n.gettext('Holidays');
                            break;

                        case PAYCODE.BREAK :
                            return i18n.gettext('Breaks');
                            break;
                    }
                }
            },
            /**
             * @deprecated due to CRITERION-6614
             */
            {
                name : 'effectiveDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            /**
             * @deprecated due to CRITERION-6614
             */
            {
                name : 'expirationDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'isBreak',
                type : 'boolean',
                persist : false,
                calculate : function(data) {
                    return data['paycode'] === criterion.Consts.PAYCODE.BREAK
                },
                depends : ['paycode']
            },
            {
                name : 'isTimeOff',
                type : 'boolean',
                persist : false,
                calculate : function(data) {
                    return data['paycode'] === criterion.Consts.PAYCODE.TIME_OFF
                },
                depends : ['paycode']
            },
            {
                name : 'isHoliday',
                type : 'boolean',
                persist : false,
                calculate : function(data) {
                    return data['paycode'] === criterion.Consts.PAYCODE.HOLIDAY
                },
                depends : ['paycode']
            },
            {
                name : 'isIncome',
                type : 'boolean',
                persist : false,
                calculate : function(data) {
                    return data['paycode'] === criterion.Consts.PAYCODE.INCOME
                },
                depends : ['paycode']
            },
            {
                name : 'hasAvailableDates',
                type : 'boolean',
                persist : false,
                convert : function(newValue, model) {
                    var availableDates = model.getData({associated : true}).availableDates;

                    return Ext.isArray(availableDates) && !!availableDates.length;
                }
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employee.timesheet.income.Date',
                name : 'availableDates',
                associationKey : 'availableDates'
            }
        ],

        /**
         * @param {Date} date
         */
        isDateAvailable : function(date) {
            var availableDates = this.availableDates();

            return !!availableDates.findRecord('date', date);
        }
    };
});
