Ext.define('criterion.controller.person.Courses', function() {

    return {
        alias : 'controller.criterion_person_courses',

        extend : 'criterion.controller.employee.GridView',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeContext'
        ]
    };

});
