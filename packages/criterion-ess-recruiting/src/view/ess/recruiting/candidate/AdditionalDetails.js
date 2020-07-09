Ext.define('criterion.view.ess.recruiting.candidate.AdditionalDetails', function() {

    const API = criterion.consts.Api;

    return {
        alias : 'widget.criterion_selfservice_recruiting_candidate_additional_details',

        extend : 'criterion.ux.TabPanel',

        requires : [
            'criterion.controller.ess.recruiting.candidate.AdditionalDetails',
            'criterion.store.candidate.Awards',
            'criterion.store.candidate.Certifications',
            'criterion.store.candidate.Experiences',
            'criterion.store.candidate.Skills',
            'criterion.store.candidate.Educations',
            'criterion.view.ess.recruiting.candidate.Toolbar'
        ],

        viewModel : {
            data : {},
            stores : {
                awards : {
                    type : 'candidate_awards'
                },
                certifications : {
                    type : 'candidate_certifications'
                },
                experiences : {
                    type : 'candidate_experiences'
                },
                educations : {
                    type : 'candidate_educations'
                },
                skills : {
                    type : 'candidate_skills'
                }
            }
        },

        controller : {
            type : 'criterion_selfservice_recruiting_candidate_additional_details'
        },

        listeners : {
            activate : 'handleActivate'
        },

        tabPosition : 'top',

        tabBar : {
            defaults : {
                margin : 0
            }
        },

        cls : 'criterion-tab-bar-top-border',

        frame : true,

        header : {
            title : {
                bind : {
                    text : '{jobPosting.title} &bull; {jobPostingCandidate.candidate.firstName} {jobPostingCandidate.candidate.lastName}'
                }
            }
        },

        bbar : [
            '->',
            {
                xtype : 'criterion_button_back',
                handler : 'handleBack'
            }
        ],

        dockedItems : [
            {
                xtype : 'criterion_selfservice_recruiting_candidate_toolbar'
            }
        ],

        items : [
            {
                xtype : 'criterion_gridview',
                title : i18n.gettext('Education'),
                reference : 'educationsGrid',
                margin : '0 0 5 0',
                preventStoreLoad : true,
                bind : {
                    store : '{educations}'
                },

                tbar : null,

                ui : 'clean',

                columns : {
                    items : [
                        {
                            text : i18n.gettext('School'),
                            flex : 1,
                            renderer : function(value, meta, record) {
                                var location = record.get('location');

                                return record.get('school') + (location ? ', ' + location : '');
                            }
                        },
                        {
                            text : i18n.gettext('Period'),
                            flex : 1,
                            encodeHtml : false,
                            renderer : function(value, meta, record) {
                                return Ext.Date.format(record.get('startDate'), API.SHOW_DATE_FORMAT)
                                    + ' &ndash; '
                                    + (record.get('endDate') ? Ext.Date.format(record.get('endDate'), API.SHOW_DATE_FORMAT) : 'Present')
                            }
                        },
                        {
                            text : i18n.gettext('Grade'),
                            flex : 1,
                            encodeHtml : false,
                            renderer : function(value, meta, record) {
                                var info = [];

                                record.get('gpa') && info.push(record.get('gpa'));
                                record.get('degreeDescription') && info.push(record.get('degreeDescription'));

                                return info.join(' &ndash; ');
                            }
                        },
                        {
                            text : i18n.gettext('Field of Study'),
                            flex : 1,
                            dataIndex : 'fieldOfStudy'
                        }
                    ]
                }
            },
            {
                xtype : 'criterion_gridview',
                title : i18n.gettext('Experience'),
                reference : 'experiencesGrid',
                margin : '0 0 5 0',
                preventStoreLoad : true,

                ui : 'clean',

                bind : {
                    store : '{experiences}'
                },

                tbar : null,

                columns : {
                    items : [
                        {
                            text : i18n.gettext('Company'),
                            flex : 1,
                            renderer : function(value, meta, record) {
                                var location = record.get('location');

                                return record.get('company') + (location ? ', ' + location : '');
                            }
                        },
                        {
                            text : i18n.gettext('Title'),
                            flex : 1,
                            dataIndex : 'title'
                        },
                        {
                            text : i18n.gettext('Period'),
                            flex : 1,
                            encodeHtml : false,
                            renderer : function(value, meta, record) {
                                return Ext.Date.format(record.get('startDate'), API.SHOW_DATE_FORMAT)
                                    + ' &ndash; '
                                    + (record.get('endDate') ? Ext.Date.format(record.get('endDate'), API.SHOW_DATE_FORMAT) : 'Present')
                            }
                        }
                    ]
                }
            },
            {
                xtype : 'criterion_gridview',
                title : i18n.gettext('Skills'),
                preventStoreLoad : true,
                margin : '0 0 5 0',

                ui : 'clean',

                bind : {
                    store : '{skills}'
                },

                tbar : null,

                columns : {
                    items : [
                        {
                            text : i18n.gettext('Skill'),
                            flex : 1,
                            dataIndex : 'skill',
                            editor : {
                                xtype : 'textfield'
                            }
                        }
                    ]
                }
            },
            {
                xtype : 'criterion_gridview',
                title : i18n.gettext('Awards'),
                reference : 'awardsGrid',
                margin : '0 0 5 0',

                ui : 'clean',

                preventStoreLoad : true,

                bind : {
                    store : '{awards}'
                },

                tbar : null,

                columns : {
                    items : [
                        {
                            text : i18n.gettext('Title'),
                            flex : 1,
                            dataIndex : 'title'
                        },
                        {
                            xtype : 'datecolumn',
                            text : i18n.gettext('Date'),
                            flex : 1,
                            dataIndex : 'awardDate'
                        }
                    ]
                }
            },
            {
                xtype : 'criterion_gridview',
                title : i18n.gettext('Certification'),
                reference : 'certificationsGrid',
                margin : '0 0 5 0',

                ui : 'clean',

                preventStoreLoad : true,
                bind : {
                    store : '{certifications}'
                },

                tbar : null,

                columns : {
                    items : [
                        {
                            text : i18n.gettext('Title'),
                            flex : 1,
                            dataIndex : 'title'
                        },
                        {
                            xtype : 'datecolumn',
                            text : i18n.gettext('Issue Date'),
                            flex : 1,
                            dataIndex : 'issueDate'
                        },
                        {
                            xtype : 'datecolumn',
                            text : i18n.gettext('Expiry Date'),
                            flex : 1,
                            dataIndex : 'expiryDate'
                        }
                    ]
                }
            }
        ]
    }
});
