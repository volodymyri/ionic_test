Ext.define('ess.view.recruiting.jobPosting.candidate.Details', function() {

    const API = criterion.consts.Api;
    
    return {
        alias : 'widget.ess_modern_recruiting_job_postings_candidate_details',

        extend : 'Ext.Container',

        requires : [
            'ess.controller.recruiting.jobPosting.candidate.Details',
            'criterion.store.candidate.Awards',
            'criterion.store.candidate.Certifications',
            'criterion.store.candidate.Experiences',
            'criterion.store.candidate.Skills',
            'criterion.store.candidate.Educations'
        ],

        controller : {
            type : 'ess_modern_recruiting_job_postings_candidate_details'
        },

        listeners : {
            painted : 'handleActivate'
        },

        viewModel : {
            stores : {
                awards : {
                    type : 'candidate_awards',
                    proxy : {
                        extraParams : {
                            candidateId : '{jobPostingCandidate.candidate.id}'
                        }
                    }
                },
                certifications : {
                    type : 'candidate_certifications',
                    proxy : {
                        extraParams : {
                            candidateId : '{jobPostingCandidate.candidate.id}'
                        }
                    }
                },
                experiences : {
                    type : 'candidate_experiences',
                    proxy : {
                        extraParams : {
                            candidateId : '{jobPostingCandidate.candidate.id}'
                        }
                    }
                },
                educations : {
                    type : 'candidate_educations',
                    proxy : {
                        extraParams : {
                            candidateId : '{jobPostingCandidate.candidate.id}'
                        }
                    }
                },
                skills : {
                    type : 'candidate_skills',
                    proxy : {
                        extraParams : {
                            candidateId : '{jobPostingCandidate.candidate.id}'
                        }
                    }
                }
            }
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        items : [
            {
                xtype : 'container',
                docked : 'top',
                padding : 5,
                items : [
                    {
                        xtype : 'criterion_combobox',
                        cls : 'cb_left_filter',
                        margin : '0 0 0 10',
                        label : i18n.gettext('Show'),
                        store : Ext.create('Ext.data.Store', {
                            fields : ['text', 'value'],
                            data : [
                                {
                                    text : i18n.gettext('Education'), value : 0
                                },
                                {
                                    text : i18n.gettext('Experience'), value : 1
                                },
                                {
                                    text : i18n.gettext('Skills'), value : 2
                                },
                                {
                                    text : i18n.gettext('Awards'), value : 3
                                },
                                {
                                    text : i18n.gettext('Certification'), value : 4
                                }
                            ]
                        }),
                        clearable : false,
                        value : 0,
                        displayField : 'text',
                        valueField : 'value',
                        labelAlign : 'left',
                        listeners : {
                            change : 'handleChangeShowedData'
                        }
                    }
                ]
            },
            {
                xtype : 'panel',
                flex : 1,
                layout : 'card',
                reference : 'dataPanel',

                items : [
                    // Education
                    {
                        xtype : 'criterion_gridview',
                        bind : {
                            store : '{educations}'
                        },

                        preventStoreLoad : true,

                        flex : 1,

                        columns : [
                            {
                                text : i18n.gettext('School'),
                                flex : 1,
                                minWidth : 180,
                                renderer : function(value, record) {
                                    return record.get('school') + ', ' + record.get('location')
                                }
                            },
                            {
                                text : i18n.gettext('Period'),
                                minWidth : 180,
                                renderer : function(value, record) {
                                    return Ext.Date.format(record.get('startDate'), API.SHOW_DATE_FORMAT)
                                        + ' - '
                                        + (record.get('endDate') ? Ext.Date.format(record.get('endDate'), API.SHOW_DATE_FORMAT) : 'Present')
                                }
                            },
                            {
                                text : i18n.gettext('Grade'),
                                minWidth : 180,
                                renderer : function(value, record) {
                                    let info = [],
                                    gpa = record.get('gpa');

                                    gpa && info.push(gpa);
                                    record.get('degreeDescription') && info.push(record.get('degreeDescription'));

                                    return info.join(' - ');
                                }
                            },
                            {
                                text : i18n.gettext('Field of Study'),
                                dataIndex : 'fieldOfStudy',
                                minWidth : 180,
                                flex : 1
                            }
                        ]
                    },
                    // Experience
                    {
                        xtype : 'criterion_gridview',
                        bind : {
                            store : '{experiences}'
                        },

                        preventStoreLoad : true,

                        flex : 1,

                        columns : [
                            {
                                text : i18n.gettext('Company'),
                                flex : 1,
                                minWidth : 180,
                                renderer : function(value, record) {
                                    return record.get('company') + ', ' + record.get('location')
                                }
                            },
                            {
                                text : i18n.gettext('Title'),
                                flex : 1,
                                minWidth : 180,
                                dataIndex : 'title'
                            },
                            {
                                text : i18n.gettext('Period'),
                                flex : 1,
                                minWidth : 180,
                                renderer : function(value, record) {
                                    return Ext.Date.format(record.get('startDate'), API.SHOW_DATE_FORMAT)
                                        + ' - '
                                        + (record.get('endDate') ? Ext.Date.format(record.get('startDate'), API.SHOW_DATE_FORMAT) : 'Present')
                                }
                            }
                        ]
                    },
                    // Skills
                    {
                        xtype : 'criterion_gridview',
                        bind : {
                            store : '{skills}'
                        },

                        preventStoreLoad : true,

                        flex : 1,

                        columns : [
                            {
                                text : i18n.gettext('Skill'),
                                flex : 1,
                                minWidth : 180,
                                dataIndex : 'skill'
                            }
                        ]
                    },
                    // Awards
                    {
                        xtype : 'criterion_gridview',
                        bind : {
                            store : '{awards}'
                        },

                        preventStoreLoad : true,

                        flex : 1,

                        columns : [
                            {
                                text : i18n.gettext('Title'),
                                flex : 1,
                                minWidth : 180,
                                dataIndex : 'title'
                            },
                            {
                                xtype : 'datecolumn',
                                text : i18n.gettext('Date'),
                                flex : 1,
                                minWidth : 150,
                                dataIndex : 'awardDate',
                                format : criterion.consts.Api.DATE_FORMAT
                            }
                        ]
                    },
                    // Certification
                    {
                        xtype : 'criterion_gridview',
                        bind : {
                            store : '{certifications}'
                        },

                        preventStoreLoad : true,

                        flex : 1,

                        columns : [
                            {
                                text : i18n.gettext('Name'),
                                flex : 1,
                                minWidth : 180,
                                dataIndex : 'name'
                            },
                            {
                                xtype : 'datecolumn',
                                text : i18n.gettext('Issue Date'),
                                flex : 1,
                                minWidth : 150,
                                dataIndex : 'issueDate',
                                format : criterion.consts.Api.DATE_FORMAT
                            },
                            {
                                xtype : 'datecolumn',
                                text : i18n.gettext('Expiry Date'),
                                flex : 1,
                                minWidth : 150,
                                dataIndex : 'expiryDate',
                                format : criterion.consts.Api.DATE_FORMAT
                            }
                        ]
                    }
                ]
            }
        ]
    }
});

