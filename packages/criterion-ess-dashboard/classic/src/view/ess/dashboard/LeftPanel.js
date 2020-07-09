Ext.define('criterion.view.ess.dashboard.LeftPanel', function() {

    const USER_PHOTO_SIZE = criterion.Consts.USER_PHOTO_SIZE;

    return {

        extend : 'Ext.container.Container',

        alias : 'widget.criterion_selfservice_dashboard_left_panel',

        requires : [
            'Ext.Progress',
            'criterion.controller.ess.dashboard.LeftPanel',
            'criterion.view.ess.dashboard.InfoActionPanel',
            'criterion.store.employer.WorkLocations'
        ],

        cls : 'criterion-selfservice-dashboard-left-panel',

        layout : {
            type : 'vbox',
            align : 'center'
        },

        scrollable : false,

        viewModel : {},

        controller : {
            type : 'criterion_selfservice_dashboard_left_panel'
        },

        listeners : {
            scope : 'controller',

            beforehide : 'handleHide',
            showPictureUploader : 'handleShowPictureUploader'
        },

        items : [
            {
                xtype : 'component',
                reference : 'profilePicture',
                cls : 'photo',
                margin : '3 0 0 25',
                alwaysOnTop : true,

                tpl : new Ext.Template(
                    '<div class="outerCircular">' +
                    '<div class="circular" style="background: url({imageUrl}) 0 0 no-repeat">' +
                    '<img src="{imageUrl}" width="' + USER_PHOTO_SIZE.MIN_WIDTH + '" height="' + USER_PHOTO_SIZE.MIN_HEIGHT + '" alt="" />' +
                    '</div>',
                    '</div>',
                    '<span class="upload-btn-wrap"></span>'
                ),
                data : {
                    imageUrl : criterion.consts.Api.API.EMPLOYEE_NO_PHOTO_90
                },
                listeners : {
                    scope : 'this',
                    afterrender : function(cmp) {
                        let vm = cmp.up('criterion_selfservice_dashboard_left_panel').getViewModel();

                        cmp.getEl().on({
                            click : function(event, target) {
                                let employeeId = vm.get('employee.id');

                                if (target.classList.contains('x-btn-glyph') || target.nodeName.toLowerCase() !== 'img' || !employeeId) {
                                    return;
                                }

                                let profilePopup = Ext.create('criterion.view.ess.ProfilePopup', {
                                    employeeId : employeeId,
                                    ownProfile : true
                                });

                                profilePopup.showPopup();
                            }
                        });
                    }
                }
            },
            {
                xtype : 'container',
                margin : '-55 0 0 0',
                width : '100%',

                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },

                cls : 'info-panel-element',
                items : [
                    {
                        xtype : 'container',
                        cls : 'name-position',
                        width : '100%',

                        layout : {
                            type : 'vbox',
                            align : 'stretch'
                        },

                        padding : '50 0 0 0',
                        items : [
                            {
                                xtype : 'component',
                                reference : 'profileInfo',
                                cls : 'info',
                                tpl : new Ext.Template(
                                    '<div class="name">{name}</div>' +
                                    '<div class="positionTitle">{positionTitle:htmlEncode}</div>' +
                                    '<div class="employerName">{employerName:htmlEncode}</div>'
                                ),
                                data : {
                                    name : '',
                                    positionTitle : '',
                                    employerName : ''
                                }
                            },
                            {
                                xtype : 'combo',
                                reference : 'employeeWorkLocation',
                                cls : [
                                    'simple-text-combo',
                                    'profile-grey-text'
                                ],
                                labelWidth : 90,
                                matchFieldWidth : false,
                                listConfig : {
                                    minWidth : 200
                                },
                                fieldLabel : i18n.gettext('Checked into'),
                                valueField : 'id',
                                displayField : 'description',
                                queryMode : 'local',
                                hidden : true,
                                bind : {
                                    store : '{employerWorkLocations}',
                                    value : '{employee.checkInLocationId}',
                                    hidden : '{!showCheckin}'
                                },
                                editable : false,
                                listeners : {
                                    change : 'handleCheckInLocation'
                                }
                            }
                        ]
                    },

                    {
                        xtype : 'container',
                        cls : 'profile-completion',
                        width : '100%',
                        layout : {
                            type : 'vbox',
                            align : 'stretch'
                        },
                        hidden : true,
                        bind : {
                            hidden : '{profileCompleted}',
                            userCls : '{(!profileCompleted && !showCheckin) ? "hasNoProfileLocation" : ""}'
                        },
                        items : [
                            {
                                xtype : 'component',
                                html : i18n.gettext('Profile Completion'),
                                cls : 'name'
                            },
                            {
                                xtype : 'container',
                                layout : 'hbox',
                                cls : 'progress-container',
                                items : [
                                    {
                                        xtype : 'component',
                                        html : '',
                                        width : 35
                                    },
                                    {
                                        xtype : 'progress',
                                        cls : 'progress-bar',
                                        height : 10,
                                        bind : {
                                            value : '{completion / 100}'
                                        },
                                        flex : 1
                                    },
                                    {
                                        xtype : 'component',
                                        bind : {
                                            html : '{completion}%'
                                        },
                                        cls : 'value',
                                        margin : '0 0 0 10',
                                        width : 35
                                    }
                                ]
                            }
                        ]
                    }
                ]

            },

            {
                xtype : 'criterion_selfservice_dashboard_info_action_panel',
                flex : 1,
                width : '100%',
                bind : {
                    cls : '{((!profileCompleted && showCheckin) || (profileCompleted && !showCheckin)) ? "hasProfileCompletion" : (!profileCompleted && !showCheckin) ? "hasProfileCompletionOnly" : ""}'
                }
            }
        ],

        initComponent : function() {
            let vm = this.getViewModel();

            vm.setStores({
                employerWorkLocations : Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.ESS_USER_WIDGET_EMPLOYER_LOCATIONS.storeId)
            });

            this.callParent(arguments);
        },

        createChangePhotoElement : function() {
            let me = this,
                uploadBtnWrap = me.el && me.el.down('.upload-btn-wrap');

            if (!uploadBtnWrap) {
                return
            }

            this.uploadForm = Ext.create('Ext.container.Container', {
                padding : 0,
                bodyPadding : 0,

                width : 30,
                height : 30,
                items : [
                    {
                        xtype : 'button',
                        buttonOnly : true,
                        buttonText : '',
                        glyph : criterion.consts.Glyph['ios7-plus'],
                        cls : 'criterion-btn-transparent',

                        listeners : {
                            click : function() {
                                me.fireEvent('showPictureUploader')
                            }
                        }
                    }
                ],

                renderTo : uploadBtnWrap
            });
        },

        getPhotoUploadForm : function() {
            return this.uploadForm;
        },

        setImageUrl : function(url, isUpdate) {
            this.url = url;

            if (!this.rendered || !url) {
                return;
            }

            let profilePictures = Ext.ComponentQuery.query('[reference=profilePicture]');

            Ext.Array.each(profilePictures, profilePicture => {
                profilePicture.setData({
                    imageUrl : url
                });

                profilePicture.el && isUpdate && profilePicture.el.fadeIn({useDisplay : true, duration : 300});
            });

            this.createChangePhotoElement();
        }
    }

});
