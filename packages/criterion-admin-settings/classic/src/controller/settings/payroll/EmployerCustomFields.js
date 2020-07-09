Ext.define('criterion.controller.settings.payroll.EmployerCustomFields', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_employer_custom_fields',

        employerId : null,

        handleUpdate : function() {
            var me = this,
                view = this.getView();

            view.setLoading(true);
            me.lookupReference('customfields').getController().save(me.employerId)
                .then(function() {
                    criterion.Utils.toast(i18n.gettext('Changes saved.'));
                }).always(function() {
                    view.setLoading(false);
                });
        },

        onEmployerChange : function(employer) {
            var me = this;

            me.employerId = employer ? employer.getId() : null;

            me.loadCurrentEmployer();
        },

        handleActivate : function() {
            var me = this;

            me.employerId = criterion.Api.getEmployerId();

            me.loadCurrentEmployer();
        },

        loadCurrentEmployer : function() {
            var me = this,
                view = me.getView();

            view.setLoading(true);
            me.lookupReference('customfields').getController().load(me.employerId).always(function() {
                view.setLoading(false);
            });
        }

    };
});
