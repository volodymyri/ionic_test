/**
 * Implements tracking of identity based on global {@see employeeChanged} event.
 *
 * This mixin requires controller to implement onBeforeEmployeeChange and onEmployeeChange methods.
 */
Ext.define('criterion.controller.mixin.identity.EmployeeGlobal', function() {

    var MIXIN_ID = 'employeeGlobal';

    function handleEmployeeChanged(employee) {

        var success = this.setIdentity({
            employee : employee,
            person : criterion.Api.getCurrentPerson(),
            employer : criterion.Application.getEmployer()
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

            listenTo.global = {
                employeeChanged : handleEmployeeChanged
            };

            this.listen(listenTo);

            this.onEmployeeChange = Ext.Function.createBuffered(this.onEmployeeChange, 100, this);

            if (criterion.Application.getEmployee()) {
                Ext.defer(handleEmployeeChanged, 100, this, [criterion.Application.getEmployee()]);
            }
        }
    }

});
