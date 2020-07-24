Ext.define('ess.view.communities.Profile', {

    extend : 'Ext.Container',

    requires : [
        'ess.controller.communities.Profile',
        'criterion.store.employer.WorkLocations',
        'criterion.store.Communities',
        'criterion.store.community.BadgesEarned',
        'criterion.model.Employee',
        'criterion.model.Person',
        'criterion.model.Position'
    ],

    alias : 'widget.ess_communities_profile',

    cls : 'ess-communities-profile',

    viewModel : {
        data : {
            title : i18n.gettext('Loading...')
        },
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

    controller : {
        type : 'ess_communities_profile'
    },

    listeners : {
        scope : 'controller',
        activate : 'onActivate'
    },

    scrollable : true,

    items : [
        {
            xtype : 'ess_modern_menubar',
            docked : 'top',
            bind : {
                title : '{title}'
            },
            buttons : [
                {
                    xtype : 'button',
                    itemId : 'backButton',
                    cls : 'criterion-menubar-back-btn',
                    iconCls : 'md-icon-arrow-back',
                    align : 'left',
                    handler : 'handleCancel'
                }
            ]
        },

        {
            xtype : 'component',
            cls : 'photo',
            itemId : 'profile-photo',
            padding : '10 0 10 0',
            tpl : new Ext.Template(
                '<div class="circular" style="background: url({imageUrl}) no-repeat">' +
                '<img src="{imageUrl}" width="' + criterion.Consts.USER_PHOTO_SIZE.MIN_WIDTH + '" height="' + criterion.Consts.USER_PHOTO_SIZE.MIN_HEIGHT + '" alt="" />' +
                '</div>'
            ),
            data : {
                imageUrl : criterion.consts.Api.API.EMPLOYEE_NO_PHOTO_90
            }
        },
        {
            xtype : 'component',
            itemId : 'profile-info',
            cls : 'profile-info',

            tpl : new Ext.Template(
                '<p class="name">{name}</p>' +
                '<p class="positionTitle">{positionTitle}</p>' +
                '<p class="department">{department}</p>' +
                '<p class="employeeWorkLocation">{employeeWorkLocation}</p>' +
                '<p class="phone">{phone}</p>' +
                '<p class="email">{email}</p>'
            ),
            data : {
                name : '',
                positionTitle : '',
                department : '',
                employeeWorkLocation : '',
                phone : '',
                email : ''
            }
        },
        {
            xtype : 'component',
            cls : 'checked-info',
            itemId : 'profile-checked-info',
            tpl : new Ext.Template(
                '<div class="center">{checkedInto}</div>'
            ),
            data : {
                checkedInto : ''
            }
        },
        {
            xtype : 'component',
            cls : 'b-title',
            html : 'Badges Earned',
            margin : '20 0 5 15'
        },
        {
            xtype : 'dataview',
            bind : {
                store : '{badgesEarnedStore}'
            },
            cls : 'itemList',
            itemTpl : new Ext.Template(
                '<div class="badge">' +
                '<div class="badgeEl item-img"><img height="38" src="{imageUrl}" alt="" /></div>' +
                '<div class="badgeEl item-name">{description}</div>' +
                    '<div class="badgeEl item-count">{count}</div>' +
                '</div>'
            ),
            itemSelector : 'div.badge',
            emptyText : 'No badges'
        },
        {
            xtype : 'component',
            cls : 'b-title',
            html : 'My Communities',
            margin : '20 0 5 15',

            bind : {
                hidden : '{!ownProfile}'
            }
        },
        {
            xtype : 'dataview',
            bind : {
                store : '{employeeCommunities}',
                hidden : '{!ownProfile}'
            },
            cls : 'itemList',
            itemTpl : new Ext.Template(
                '<div class="community">' +
                '<div class="communityEl item-img"><img height="25" src="{imageUrl}" alt="" /></div>' +
                '<div class="communityEl item-name">{name}</div>' +
                '</div>'
            ),
            itemSelector : 'div.community',
            emptyText : 'No communities'
        }
    ]
});
