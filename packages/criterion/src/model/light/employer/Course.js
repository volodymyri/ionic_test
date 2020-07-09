Ext.define('criterion.model.light.employer.Course', function() {

    return {
        extend : 'criterion.model.employer.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_COURSE_NAMES
        },

        fields : [
            {
                name : 'code',
                type : 'string',
                fieldLabel : i18n.gettext('Course Code')
            },
            {
                name : 'name',
                type : 'string',
                fieldLabel : i18n.gettext('Course Name')
            },
            {
                name : 'employerName',
                type : 'string',
                fieldLabel : i18n.gettext('Employer')
            },
            {
                name : 'className',
                type : 'string',
                fieldLabel : i18n.gettext('Class Name')
            },
            {
                name : 'courseDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'courseTime',
                type : 'date',
                dateFormat : criterion.consts.Api.RAW_DATE_TIME_FORMAT
            },
            {
                name : 'courseDateTime',
                type : 'date',
                calculate : data => {
                    if (!data) {
                        return;
                    }

                    return Ext.String.format('{0} {1}', Ext.Date.format(data.courseDate, criterion.consts.Api.SHOW_DATE_FORMAT), Ext.Date.format(data.courseTime, criterion.consts.Api.SHOW_TIME_FORMAT));
                },
                fieldLabel : i18n.gettext('Date')
            }
        ]
    };
});
