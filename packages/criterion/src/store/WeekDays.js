Ext.define('criterion.store.WeekDays', function() {

    return {

        alias : 'store.criterion_weekdays',

        extend : 'Ext.data.Store',

        fields : ['value', 'name'],
        sorters : [
            {
                property : 'value',
                direction : 'ASC'
            }
        ],
        data : [
            {
                name : i18n.gettext('Sunday'),
                shortName : i18n.gettext('Sun'),
                firstLetter : 'U',
                value : parseInt('0000001', 2)
            },
            {
                name : i18n.gettext('Monday'),
                shortName : i18n.gettext('Mon'),
                firstLetter : 'M',
                value : parseInt('0000010', 2)
            },
            {
                name : i18n.gettext('Tuesday'),
                shortName : i18n.gettext('Tue'),
                firstLetter : 'T',
                value : parseInt('0000100', 2)
            },
            {
                name : i18n.gettext('Wednesday'),
                shortName : i18n.gettext('Wed'),
                firstLetter : 'W',
                value : parseInt('0001000', 2)
            },
            {
                name : i18n.gettext('Thursday'),
                shortName : i18n.gettext('Thu'),
                firstLetter : 'R',
                value : parseInt('0010000', 2)
            },
            {
                name : i18n.gettext('Friday'),
                shortName : i18n.gettext('Fri'),
                firstLetter : 'F',
                value : parseInt('0100000', 2)
            },
            {
                name : i18n.gettext('Saturday'),
                shortName : i18n.gettext('Sat'),
                firstLetter : 'S',
                value : parseInt('1000000', 2)
            }
        ]
    }

});
