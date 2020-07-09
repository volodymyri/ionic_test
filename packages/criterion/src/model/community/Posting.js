Ext.define('criterion.model.community.Posting', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.community.posting.Reaction',
            'criterion.model.community.posting.Attachment',
            'criterion.model.community.Badge'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.COMMUNITY_POSTING
        },

        fields : [
            {
                name : 'communityId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'communityImageUrl',
                type : 'string',
                mapping : function(data) {
                    var iconId = data.community && data.community['iconId'];

                    return iconId ? criterion.Api.getSecureResourceUrl(API.COMMUNITY_ICON_IMAGE + '/' + iconId) : null
                },
                persist : false
            },
            {
                name : 'employeeId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'personId',
                type : 'integer',
                persist : false
            },
            {
                name : 'authorPhotoUrl',
                convert : function(value, record) {
                    return record.phantom ? null : criterion.Api.getSecureResourceUrl(API.PERSON_PHOTO_THUMB + '/' + record.get('personId'))
                },
                persist : false
            },
            {
                name : 'message',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'badgeId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'badgeImageUrl',
                depends : ['badgeId'],
                convert : function(value, record) {
                    var badgeId = record.get('badgeId');

                    return badgeId ? criterion.Api.getSecureResourceUrl(API.COMMUNITY_BADGE_IMAGE + '/' + badgeId) : null;
                },
                persist : false
            },
            {
                name : 'badgeRecipientId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'creationDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT,
                persist : false
            },
            {
                name : 'lastEditDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT,
                persist : false
            },
            {
                name : 'badgeRecipientName',
                type : 'string',
                persist : false
            },
            {
                name : 'authorName',
                type : 'string',
                persist : false
            },
            {
                name : 'authorInactive',
                type : 'boolean',
                persist : false,
                defaultValue : false
            },

            {
                name : 'likesCount',
                type : 'integer',
                persist : false
            },
            {
                name : 'communityId',
                type : 'integer',
                defaultValue : null
            },
            {
                name : 'repliesCount',
                type : 'integer',
                persist : false
            },
            {
                name : 'creationDateOrDiff',
                calculate : function(data) {
                    if (!data) {
                        return;
                    }

                    var now = new Date(),
                        minutesDiff = Ext.Date.diff(data.creationDate, now, Ext.Date.MINUTE);

                    if (minutesDiff < 3) {
                        return i18n.gettext('Just now');
                    }

                    return (minutesDiff > 59) ? Ext.Date.format(data.creationDate, 'm/d/Y - h:i a') :
                        Ext.String.format('{0} {1}', Ext.util.Format.plural(minutesDiff, i18n.gettext('minute ago'), i18n.gettext('minutes ago')));
                }
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.community.Badge',
                name : 'badge',
                associationKey : 'badge'
            },
            {
                model : 'criterion.model.Community',
                name : 'community',
                associationKey : 'community'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.community.posting.Reaction',
                name : 'reactions',
                associationKey : 'reactions'
            },
            {
                model : 'criterion.model.community.posting.Attachment',
                name : 'attachments',
                associationKey : 'attachments'
            }
        ]
    };
});
