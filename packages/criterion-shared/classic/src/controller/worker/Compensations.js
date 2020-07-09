Ext.define('criterion.controller.worker.Compensations', function() {

    return {
        alias : 'controller.criterion_worker_compensations',

        extend : 'criterion.controller.employee.GridView',

        requires : [
            'criterion.view.customData.GridView'
        ],

        mixins : [
            'criterion.controller.mixin.identity.EmployeeContext'
        ]
    };

});
