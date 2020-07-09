/**
 * Implements tracking of identity based on controller {@see selectedEmployeeSet} events.
 *
 * This mixin requires controller to implement onBeforeEmployeeChange and onEmployeeChange methods.
 */
Ext.define('criterion.controller.mixin.identity.EmployeeContext', function() {

    var MIXIN_ID = 'employeeContext';

    function handleEmployeeChanged (data, contextView) {
        if (!this.isInContext(contextView)) {
            return;
        }

        if (data.employee === this.identity.employee) {
            return;
        }

        var success = this.setIdentity({
            employee : data.employee,
            person : data.person,
            employer : data.employer
        }, MIXIN_ID);

        if (!success) {
            return;
        }

        var beforeResult = this.onBeforeEmployeeChange && this.onBeforeEmployeeChange.apply(this, arguments);

        if (beforeResult === undefined ? this.checkViewIsActive() : beforeResult) {
            this.onEmployeeChange.apply(this, arguments);
        }
    }

    return {

        extend : 'Ext.Mixin',

        mixinConfig: {
            id : MIXIN_ID,

            after: {
                constructor: 'initMixin'
            }
        },

        initMixin : function() {
            var listenTo = {};

            listenTo.controller = {
                '*' : {
                    selectedEmployeeSet : handleEmployeeChanged
                }
            };

            this.listen(listenTo);
        }

    }

});
