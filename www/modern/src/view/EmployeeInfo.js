Ext.define('ess.view.EmployeeInfo', function() {

    const USER_PHOTO_SIZE = criterion.Consts.USER_PHOTO_SIZE;

    return {
        alias : 'widget.ess_modern_employee_info',

        extend : 'Ext.Container',

        requires : [
            'ess.controller.EmployeeInfo'
        ],

        controller : {
            type : 'ess_modern_employee_info'
        },

        viewModel : {
            data : {
                person : null
            },

            formulas : {
                personName : function(data) {
                    var person = data('_person');

                    if (person) {
                        return person['firstName'] + ' ' + (person['middleName'] ? person['middleName'] + ' ' : '') + person['lastName']
                    } else {
                        return '';
                    }
                },
                positionName : function(data) {
                    var employee = data('_employee'),
                        employer = data('_employer');

                    if (employee && employer) {
                        return (employee.getAssignment() ? Ext.String.htmlEncode(employee.getAssignment().get('title')) : i18n.gettext('Unemployed')) + '<br/><span class="employerName"> ' + Ext.String.htmlEncode(employer.get('legalName')) + '</span>'
                    } else {
                        return '';
                    }
                }
            }
        },

        layout : {
            type : 'hbox',
            align : 'center'
        },

        items : [
            {
                xtype : 'button',
                cls : 'photo',
                reference : 'mainTopPhoto',
                padding : '0',
                margin : '0 10 0 20',
                tpl : new Ext.Template(
                    '<div class="circular" style="background: url({imageUrl}) no-repeat">' +
                    '<img src="{imageUrl}" width="' + USER_PHOTO_SIZE.MIN_WIDTH + '" height="' + USER_PHOTO_SIZE.MIN_HEIGHT + '" alt="" />' +
                    '</div>'
                ),
                data : {
                    imageUrl : criterion.consts.Api.API.EMPLOYEE_NO_PHOTO_90
                },
                listeners : {
                    scope : this,
                    tap : function() {
                        Ext.GlobalEvents.fireEvent('showMyProfile');
                    }
                }
            },
            {
                xtype : 'container',
                layout : {
                    type : 'vbox'
                },
                flex : 1,
                items : [
                    {
                        xtype : 'component',
                        cls : 'ess-main-menu-user-info',
                        bind : {
                            html : '<p class="ess-main-menu-person-name">{personName}</p>' +
                            '<p class="ess-main-menu-position-name">{positionName}</p>'
                        }
                    }
                ]
            },
            {
                xtype : 'button',
                cls : 'ess-main-menu-more',
                iconCls : 'md-icon-more-horiz',
                listeners : {
                    tap : 'onShowAdditionalMenu'
                }
            }
        ]

    };

});
