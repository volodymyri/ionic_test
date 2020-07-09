Ext.define('criterion.vm.ess.PersonalInformation', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.criterion_ess_personal_information',

    requires : [
        'criterion.store.person.Addresses',
        'criterion.store.Positions'
    ],

    data : {
        person : null,
        employee : null,
        address : null,
        position : null,
        employerId : null
    },

    stores : {
        positions : {
            type : 'positions'
        },
        addresses : {
            type : 'criterion_person_addresses',
            proxy : {
                extraParams : {
                    isPrimary : 1
                }
            }
        }
    }

});