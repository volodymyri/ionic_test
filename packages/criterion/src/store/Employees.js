Ext.define('criterion.store.Employees', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',
        alias : 'store.criterion_employees',

        model : 'criterion.model.Employee',
        autoLoad : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE
        },

        findEmployee : function(personId, employerId) {
            var recIndex = this.findBy(function(record) {
                return employerId == record.get('employerId') && personId == record.get('personId');
            }, this);

            return this.getAt(recIndex);
        }
    };

});
