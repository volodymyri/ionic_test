Ext.define('criterion.view.moduleToolbar.Employment', function () {

    return {
        alias: 'widget.criterion_moduletoolbar_employment',

        extend: 'criterion.view.moduleToolbar.MenuOwner',

        requires: [
            'criterion.controller.moduleToolbar.Employment'
        ],

        controller: {
            type: 'criterion_moduletoolbar_employment'
        },

        viewModel: {
            data: {
                selected: null,
                menuItems: null
            },
            formulas: {
                oneEmployer: function(vmget) {
                    var menuItems = vmget('menuItems');

                    return !menuItems || menuItems.length == 1;
                }
            },
            stores: {
                employments : {
                    fields : ['employeeId', 'positionTitle', 'employerId', 'employerTitle']
                }
            }
        },

        cls: 'criterion-moduletoolbar-btn-primary',

        bind: {
            text: '{selected.positionTitle}',
            menuItems: '{menuItems}',
            hidden: '{oneEmployer}'
        },

        menu: {
            cls: 'criterion-moduletoolbar-menu',
            shadow: 'drop'
        }
    };

});
