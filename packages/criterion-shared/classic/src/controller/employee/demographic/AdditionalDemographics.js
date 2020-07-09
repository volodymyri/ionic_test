Ext.define('criterion.controller.employee.demographic.AdditionalDemographics', function() {

    return {
        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_employee_demographic_additional_demographics',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeContext'
        ],

        onEmployeeChange : function() {
            this.handleActivate(); // todo refactor, introduce load method
        },

        init : function() {
            // because handleActivate can be double handled (and it's a normal situation)
            this.handleActivate = Ext.Function.createBuffered(this.handleActivate, 100, this);

            this.callParent(arguments);
        },

        handleActivate : function() {
            var view = this.getView(),
                personId = this.getPersonId();

            if (!personId) {
                return;
            }

            if (this.checkViewIsActive()) {
                view.setLoading(true);
                this.lookupReference('customfieldsAddlDemographics').load(personId, function() {
                    view.setLoading(false);
                });
            }
        },

        handleSave : function() {
            var view = this.getView(),
                form = view.getForm(),
                me = this;

            if (form.isValid()) {
                view.setLoading(true);

                Ext.Deferred
                    .all([
                        me.identity.person.saveWithPromise(),
                        me.lookupReference('customfieldsAddlDemographics').save(me.getPersonId())
                    ])
                    .then(function() {
                        criterion.Utils.toast(i18n.gettext('Profile Saved.'));
                    })
                    .always(function() {
                        view.setLoading(false);
                    });
            } else {
                this.focusInvalidField();
            }
        },

        onCancel : function() {
            this.handleActivate();
        }
    };

});
