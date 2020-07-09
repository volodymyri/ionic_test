Ext.define('criterion.app.ViewController', function() {

    var i = 0;

    return {
        extend : 'Ext.app.ViewController',

        alias : 'controller.criterion_controller',

        listen : {
            global : {
                employerChanged : 'handleEmployerChanged'
            }
        },

        /**
         * Identity is a context of the page. It may be set by various mixins, {@see criterion.controller.mixin.identity.EmployeeContext}
         *
         * @protected
         */
        identity : {
            /**
             * @type {criterion.model.Employee || null}
             */
            employee : null,
            /**
             * @type {criterion.model.Employer || null}
             */
            employer : null,
            /**
             * @type {criterion.model.Person || null}
             */
            person : null
        },

        /**
         * If some Class has ability to retrieve identities from different mixins, use this instance variable to suppress
         * unneeded mixins. Expect list of mixin ids.
         *
         */
        suppressIdentity : [],

        setIdentity : function(value, initiator) {
            var oldValue = this.identity;

            if (!Ext.isArray(this.suppressIdentity) || !Ext.Array.contains(this.suppressIdentity, initiator)) {
                this.identity = Ext.apply(oldValue, value);
                //console && console.trace('Identity set for ' + this.$className, initiator, this.getEmployeeId());
                return true;
            } else {
                return false;
            }
        },

        getPersonId : function() {
            return this.identity.person ? this.identity.person.id : null // todo change person to model instance
        },

        getEmployeeId : function() {
            return this.identity.employee ? this.identity.employee.getId() : null
        },

        getEmployerId : function() {
            return this.identity.employer ? this.identity.employer.getId() : null
        },

        constructor : function(config) {
            this.callParent(arguments);

            this.identity = Ext.clone(this.identity);

            if (!this.getId()) {
                this.setId(Ext.getClassName(this) + '-' + (++i));
            }
        },

        init : function() {
            this.callParent(arguments);

            if (criterion.Application.getEmployer()) {
                this.handleEmployerChanged(criterion.Application.getEmployer(), null);
            }
        },

        checkViewIsActive : function() {
            var view = this.getView();

            return view && view.rendered && view.isVisible(true);
        },

        isInContext : function(context) {
            if (Ext.isString(context)) {
                return !!this.getView().up(context);
            } else {
                return !!this.getView().up('#' + context.getItemId());
            }
        },

        handleEmployerChanged : function(employer, oldEmployer, context) {
            if (context && !this.isInContext(context)) {
                return;
            }

            this.onBeforeEmployerChange(employer, oldEmployer);

            if (this.checkViewIsActive()) {
                this.onEmployerChange(employer, oldEmployer)
            }
        },

        showError : function(props) {

        },

        remove : Ext.emptyFn,

        onBeforeEmployerChange : Ext.emptyFn,

        onEmployerChange : Ext.emptyFn
    };

});
