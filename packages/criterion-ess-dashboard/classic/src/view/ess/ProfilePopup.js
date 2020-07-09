Ext.define('criterion.view.ess.ProfilePopup', function() {

    const USER_PHOTO_SIZE = criterion.Consts.USER_PHOTO_SIZE;

    return {
        extend : 'Ext.Button',

        alias : 'widget.criterion_ess_profile_popup',

        mixins : [
            'criterion.ux.mixin.Component'
        ],

        requires : [
            'criterion.store.employer.WorkLocations',
            'criterion.store.community.BadgesEarned'
        ],

        config : {
            employeeId : null,
            ownProfile : false
        },

        handler : function() {
            this.showPopup();
        },

        showPopup : function() {
            var employee = Ext.create('criterion.model.Employee', {
                    id : this.getEmployeeId()
                }),
                ownProfile = this.getOwnProfile(),
                profilePopup = Ext.create('criterion.ux.Panel', {
                    cls : 'criterion-ess-profile-popup',
                    plugins : [
                        {
                            ptype : 'criterion_sidebar',
                            modal : true,
                            height : 500,
                            width : 600
                        }
                    ],

                    viewModel : {
                        stores : {
                            badgesEarnedStore : {
                                type : 'criterion_community_badges_earned'
                            },
                            employeeCommunities : {
                                type : 'criterion_communities',
                                proxy : {
                                    url : criterion.consts.Api.API.COMMUNITY_FOR_EMPLOYEE,
                                    extraParams : {
                                        isActive : true
                                    }
                                }
                            }
                        }
                    },

                    closable : false,
                    scrollable : false,
                    title : null,

                    bodyPadding : 20,

                    layout : {
                        type : 'vbox',
                        align : 'stretch'
                    },

                    buttons : [
                        '->',
                        {
                            xtype : 'button',
                            text : i18n.gettext('Close'),
                            handler : function() {
                                profilePopup.destroy();
                            }
                        }
                    ],

                    items : [
                        {
                            xtype : 'container',
                            layout : 'hbox',
                            items : [
                                {
                                    xtype : 'component',
                                    cls : 'profile-info',

                                    tpl : new Ext.Template(
                                        '<p class="name">{name}</p>' +
                                        '<p class="positionTitle">{positionTitle}</p>' +
                                        '<p class="department">{department}</p>' +
                                        '<p class="employeeWorkLocation">{employeeWorkLocation}</p>' +
                                        '<p class="email">{email}</p>'
                                    ),
                                    flex : 1,
                                    data : {
                                        name : '',
                                        positionTitle : '',
                                        department : '',
                                        employeeWorkLocation : '',
                                        email : ''
                                    }
                                },
                                !ownProfile ? {
                                    xtype : 'component',
                                    cls : 'photo',
                                    margin : '10 0 0 20',
                                    tpl : new Ext.Template(
                                        '<div class="circular" style="background: url({imageUrl}) no-repeat">' +
                                        '<img src="{imageUrl}" width="' + USER_PHOTO_SIZE.MIN_WIDTH + '" height="' + USER_PHOTO_SIZE.MIN_HEIGHT + '" alt="" />' +
                                        '</div>'
                                    ),
                                    data : {
                                        imageUrl : criterion.consts.Api.API.EMPLOYEE_NO_PHOTO_90
                                    }
                                } : {}
                            ]
                        },
                        {
                            xtype : 'component',
                            cls : 'checked-into',
                            tpl : new Ext.Template(
                                '<div>{checkedInto}</div>'
                            ),
                            data : {
                                checkedInto : ''
                            }
                        },
                        {
                            xtype : 'container',
                            flex : 1,
                            layout : {
                                type : 'vbox',
                                align : 'stretch'
                            },
                            scrollable : 'vertical',

                            items : [
                                {
                                    xtype : 'criterion_gridpanel',
                                    title : i18n.gettext('Badges Earned'),
                                    reference : 'badgesGrid',
                                    bind : {
                                        store : '{badgesEarnedStore}',
                                        hidden : '{!badgesGrid.count}'
                                    },

                                    hideHeaders : true,
                                    columns : [
                                        {
                                            xtype : 'gridcolumn',
                                            dataIndex : 'imageUrl',
                                            width : 60,
                                            encodeHtml : false,
                                            renderer : function(url, metaData) {
                                                metaData.style = 'padding: 3px 10px 0 0;';

                                                return Ext.util.Format.format('<img height="38" src="{0}" alt="" />', url);
                                            }
                                        },
                                        {
                                            xtype : 'gridcolumn',
                                            text : '',
                                            dataIndex : 'description',
                                            width : 300
                                        },
                                        {
                                            xtype : 'templatecolumn',
                                            text : '',
                                            width : 100,
                                            tpl : '<strong>{count}</strong>'
                                        }
                                    ]
                                },
                                ownProfile ?
                                    {
                                        xtype : 'criterion_gridpanel',

                                        title : i18n.gettext('My Communities'),

                                        bind : {
                                            store : '{employeeCommunities}'
                                        },

                                        hideHeaders : true,
                                        columns : [
                                            {
                                                xtype : 'gridcolumn',
                                                dataIndex : 'imageUrl',
                                                width : 60,
                                                encodeHtml : false,
                                                renderer : function(url, metaData) {
                                                    metaData.style = 'padding: 9px 10px 0 0;';

                                                    return Ext.util.Format.format('<img height="25" src="{0}" alt="" />', url);
                                                }
                                            },
                                            {
                                                xtype : 'gridcolumn',
                                                text : '',
                                                dataIndex : 'name',
                                                width : 330
                                            }
                                        ]
                                    } : {}
                            ]
                        }
                    ]
                });

            employee.getProxy().setUrl(criterion.consts.Api.API.COMMUNITY_EMPLOYEE);
            profilePopup.show();
            profilePopup.setLoading(true);

            var person,
                employerWorkLocations,
                badgesEarnedStore = profilePopup.getViewModel().getStore('badgesEarnedStore'),
                employeeCommunities = profilePopup.getViewModel().getStore('employeeCommunities'),
                promises;

            promises = [
                function() {
                    return employee.loadWithPromise().then(function() {
                        employee.getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE);
                    })
                },
                function() {
                    person = Ext.create('criterion.model.Person', {
                        personId : employee.get('personId')
                    });

                    person.getProxy().setUrl(criterion.consts.Api.API.COMMUNITY_PERSON);
                    return person.loadWithPromise()
                },
                function() {
                    employerWorkLocations = Ext.create('criterion.store.employer.WorkLocations');

                    return employerWorkLocations.loadWithPromise({
                        params : {
                            employerId : employee.get('employerId')
                        }
                    })
                },
                function() {
                    badgesEarnedStore.getProxy().setExtraParam('employeeId', employee.getId());
                    return badgesEarnedStore.loadWithPromise()
                }
            ];

            if (ownProfile) {
                promises.push(
                    function() {
                        employeeCommunities.getProxy().setExtraParam('employeeId', employee.getId());
                        return employeeCommunities.loadWithPromise();
                    }
                );
            }

            Ext.Deferred.sequence(promises).then({
                scope : this,
                success : function() {
                    var checkInLocationId = employee.get('checkInLocationId'),
                        employeeWorkLocation = employee.getEmployeeWorkLocation(),
                        assignment = employee.getAssignment();

                    profilePopup.down('component[cls=profile-info]').setData({
                        name : person.get('fullName'),
                        positionTitle : assignment && assignment.get('positionTitle') || '',
                        department : assignment && criterion.CodeDataManager.getCodeDetailRecord('id', assignment.get('departmentCd'), criterion.consts.Dict.DEPARTMENT).get('description') || '',
                        employeeWorkLocation : employeeWorkLocation ? employerWorkLocations.getById(employeeWorkLocation.get('employerWorkLocationId')).get('description') : '',
                        email : person.get('email')
                    });

                    if (!ownProfile) {
                        profilePopup.down('component[cls=photo]').setData({
                            imageUrl : criterion.Utils.makePersonPhotoUrl(person.getId())
                        });
                    }

                    var checkedIntoCmp = profilePopup.down('component[cls=checked-into]'),
                        employer = Ext.StoreManager.lookup('Employers').getById(employee.get('employerId'));

                    checkedIntoCmp.setVisible(employer && employer.get('isCheckin'));

                    if (checkInLocationId) {
                        checkedIntoCmp.setData({
                            checkedInto : Ext.String.format(
                                i18n.gettext('Checked into') + ' <strong>{0}</strong>', employerWorkLocations.getById(checkInLocationId).get('description')
                            )
                        });
                    }

                    profilePopup.setLoading(false);
                }
            });
        }
    }
});
