Ext.define('criterion.view.common.GeocodeValidationWizard', function() {

    return {

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.common.GeocodeValidationWizard',
            'criterion.view.common.geocode.ValidationEmployee',
            'criterion.view.common.geocode.ValidationEmployer'
        ],

        viewModel : {
            data : {
                activeViewIdx : 0,
                isInLoading : true
            },

            formulas : {
                isEmployeeFixes : data => data('activeViewIdx') === 0,
                title : data => data('activeViewIdx') === 0 ? i18n.gettext('Geocode Validation (Employees)') : i18n.gettext('Geocode Validation (Employers)')
            }
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : '90%',
                width : '90%'
            }
        ],

        controller : {
            type : 'criterion_common_geocode_validation_wizard'
        },

        listeners : {
            show : 'handleShow'
        },

        layout : 'card',

        title : i18n.gettext('Geocode Validation'),

        bind : {
            activeItem : '{activeViewIdx}',
            title : '{title}'
        },

        buttons : [
            {
                xtype : 'component',
                html : '<span class="blink-text">' + i18n.gettext('Loading...') + '</span>',
                hidden : true,
                bind : {
                    hidden : '{!isInLoading}'
                },
                margin : '0 0 0 20'
            },
            '->',
            {
                xtype : 'button',
                cls : 'criterion-btn-light',
                scale : 'small',
                text : i18n.gettext('Cancel'),
                handler : 'handleCancel'
            },
            {
                xtype : 'button',
                scale : 'small',
                cls : 'criterion-btn-primary',
                text : i18n.gettext('Next'),
                handler : 'handleNext',
                hidden : true,
                bind : {
                    hidden : '{!isEmployeeFixes}'
                }
            },
            {
                xtype : 'button',
                scale : 'small',
                cls : 'criterion-btn-primary',
                text : i18n.gettext('Prev'),
                handler : 'handlePrev',
                hidden : true,
                bind : {
                    hidden : '{isEmployeeFixes}'
                }
            },
            {
                xtype : 'button',
                scale : 'small',
                cls : 'criterion-btn-primary',
                text : i18n.gettext('Update'),
                handler : 'handleUpdate',
                hidden : true,
                bind : {
                    hidden : '{isEmployeeFixes}'
                }
            }
        ],

        items : [
            {
                xtype : 'criterion_common_geocode_validation_employee',
                reference : 'validationEmployee'
            },
            {
                xtype : 'criterion_common_geocode_validation_employer',
                reference : 'validationEmployer'
            }
        ]
    };

});
