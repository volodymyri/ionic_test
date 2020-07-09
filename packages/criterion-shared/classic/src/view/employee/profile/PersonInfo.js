Ext.define('criterion.view.employee.profile.PersonInfo', function() {

    const API = criterion.consts.Api.API,
        ROUTE = criterion.consts.Route,
        USER_PHOTO_SIZE = criterion.Consts.USER_PHOTO_SIZE;

    return {
        alias : 'widget.criterion_person_info',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.employee.profile.PersonInfo',
            'criterion.ux.form.field.EmployerCombo'
        ],

        controller : {
            type : 'criterion_employee_profile_person_info'
        },

        listeners : {
            scope : 'controller',
            showPictureUploader : 'handleShowPictureUploader',
            changePhoto : 'handleProfilePictureChange'
        },

        height : 130,

        bodyPadding : 10,

        layout : {
            type : 'hbox'
        },

        config : {
            nextEmployee : null,
            prevEmployee : null
        },

        viewModel : {
            data : {
                hasNextEmployee : false,
                hasPrevEmployee : false,
                disablePrevNext : false
            },

            formulas : {
                orgChartLink : vmget => vmget('employee.assignment.isActive') ? ROUTE.getDirect(ROUTE.HR.ORGANIZATION + '/' + vmget('employee.id')) : null
            }
        },

        initComponent : function() {
            this.items = [
                {
                    xtype : 'button',
                    cls : 'criterion-btn-transparent',
                    enableToggle : true,
                    margin : '-10 0 0 -12',
                    glyph : criterion.consts.Glyph['chevron-left'],
                    pressed : false,

                    bind : {
                        pressed : '{fullPageMode}',
                        glyph : '{getGlyph}',
                        tooltip : '{getTooltip}'
                    },

                    viewModel : {
                        formulas : {
                            getTooltip : get => get('fullPageMode') ? i18n.gettext('Expand navigation bar') : i18n.gettext('Collapse navigation bar'),
                            getGlyph : get => get('fullPageMode') ? criterion.consts.Glyph['chevron-right'] : criterion.consts.Glyph['chevron-left']
                        }
                    }
                },
                {
                    xtype : 'component',
                    reference : 'profilePicture',
                    cls : 'photo',
                    margin : '10 0 0 -10',
                    tpl : new Ext.Template(
                        '<div class="circular" style="background: url({imageUrl}) no-repeat">' +
                        '<img src="{imageUrl}" width="' + USER_PHOTO_SIZE.MIN_WIDTH + '" height="' + USER_PHOTO_SIZE.MIN_HEIGHT + '" alt="" />' +
                        '</div>' +
                        '<span class="upload-btn-wrap"></span>'
                    ),
                    data : {
                        imageUrl : API.EMPLOYEE_NO_PHOTO_90
                    }
                },
                {
                    xtype : 'container',
                    items : [
                        {
                            xtype : 'component',
                            reference : 'profileInfo',
                            cls : 'info',
                            margin : '15 0 0 20',
                            tpl : new Ext.Template(
                                '<div class="name">{name}</div>' +
                                '<div class="positionTitle">{positionTitle:htmlEncode}</div>' +
                                '<div class="employer">{employerName:htmlEncode}</div>' +
                                '<div class="employeeNumber">{employeeNumber}</div>'
                            ),
                            data : {
                                name : '',
                                positionTitle : i18n.gettext('Loading') + ' ...',
                                employerName : '',
                                employeeNumber : ''
                            }
                        }
                    ]
                },
                {
                    flex : 1
                },
                {
                    xtype : 'toolbar',
                    vertical : true,
                    style : {
                        background : 'transparent'
                    },
                    height : '100%',
                    minWidth : 55,
                    items : [
                        {
                            xtype : 'button',
                            glyph : 'xf0e8@\'Font Awesome 5 Free\'',
                            tooltip : i18n.gettext('Show in Org Chart'),
                            cls : 'criterion-btn-transparent',
                            hrefTarget : '_self',
                            hidden : true,
                            bind : {
                                href : '{orgChartLink}',
                                hidden : '{!orgChartLink}'
                            }
                        },
                        '->',
                        {
                            xtype : 'container',
                            layout : 'hbox',
                            items : [
                                {
                                    xtype : 'button',
                                    tooltip : i18n.gettext('Prev'),
                                    scale : 'small',
                                    cls : ['criterion-btn-round-border', 'icon-only'],
                                    glyph : criterion.consts.Glyph['ios7-arrow-left'],
                                    margin : '0 10 0 0',
                                    handler : 'handleGoToPrevEmployee',
                                    bind : {
                                        disabled : '{!hasPrevEmployee || disablePrevNext}'
                                    }
                                },
                                {
                                    xtype : 'button',
                                    tooltip : i18n.gettext('Next'),
                                    scale : 'small',
                                    cls : ['criterion-btn-round-border', 'icon-only'],
                                    glyph : criterion.consts.Glyph['ios7-arrow-right'],
                                    handler : 'handleGoToNextEmployee',
                                    bind : {
                                        disabled : '{!hasNextEmployee || disablePrevNext}'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ];

            this.callParent(arguments);

            this.on('afterrender', function() {
                this.setImageUrl(this.url, true);
            }, this);
        },

        url : null,

        setImageUrl : function(url, isUpdate) {
            this.url = url;

            if (!this.rendered || !url) {
                return;
            }

            let pic = this.down('[reference=profilePicture]');

            pic.data.imageUrl = url;
            pic.update(pic.data);

            isUpdate && pic.getEl().fadeIn({useDisplay : true, duration : 300});

            this.createChangePhotoElement();
        },

        employerCombo : null,

        setPersonInfo : function(info) {
            let profileInfo = this.down('[reference=profileInfo]');

            profileInfo.data = Ext.Object.merge(profileInfo.data, info || {});

            if (profileInfo.data.employerName) {
                profileInfo.data.employerName = i18n.gettext('Employer') + ': ' + profileInfo.data.employerName;
            }

            profileInfo.update(profileInfo.data);
        },

        changePositionName : function(positionName) {
            let profileInfo = this.down('[reference=profileInfo]');

            profileInfo.data = Ext.Object.merge(profileInfo.data, {
                positionTitle : positionName
            });

            profileInfo.update(profileInfo.data);
        },

        createChangePhotoElement : function() {
            let me = this;

            this.uploadForm && this.uploadForm.destroy();
            this.uploadForm = Ext.create('criterion.ux.form.Panel', {
                title : false,
                frame : false,

                margin : 0,
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

                renderTo : this.el.down('.upload-btn-wrap')
            });
        },

        getPhotoUploadForm : function() {
            return this.uploadForm;
        },

        updateNextEmployee : function(newValue) {
            this.getViewModel().set('hasNextEmployee', newValue);
        },
        updatePrevEmployee : function(newValue) {
            this.getViewModel().set('hasPrevEmployee', newValue);
        }
    }
});
