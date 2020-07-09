Ext.require('criterion.consts.Route', function () {

    var Route = criterion.consts.Route;

    Ext.define('criterion.consts.Module', function () {

        return {
            singleton : true,

            getModules : function() {
                return {
                    HR : {
                        text : i18n.gettext('HR'),
                        href : Route.getDirect(Route.HR.MAIN),
                        hrefTarget : '_self',
                        reference : 'HR'
                    },
                    Payroll : {
                        text : i18n.gettext('Payroll'),
                        href : Route.getDirect(Route.PAYROLL.MAIN),
                        hrefTarget : '_self',
                        reference : 'Payroll'
                    },
                    Recruiting : {
                        text : i18n.gettext('Recruiting'),
                        href : Route.getDirect(Route.RECRUITING.MAIN),
                        hrefTarget : '_self',
                        reference : 'Recruiting'
                    },
                    Scheduling : {
                        text : i18n.gettext('Scheduling'),
                        href : Route.getDirect(Route.SCHEDULING.MAIN),
                        hrefTarget : '_self',
                        reference : 'Scheduling'
                    },
                    SelfService : {
                        text : i18n.gettext('Self Service'),
                        href : Route.getDirect(Route.SELF_SERVICE.MAIN),
                        hrefTarget : '_self',
                        reference : 'SelfService'
                    }
                }
            }
        };
    });
});