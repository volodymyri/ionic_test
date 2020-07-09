Ext.define('ess.view.learning.CourseForEnroll', function() {

    return {
        alias : 'widget.ess_modern_learning_course_for_enroll',

        extend : 'Ext.form.Panel',

        viewModel : {},

        cls : 'ess-modern-learning-course',

        items : [
            {
                xtype : 'ess_modern_menubar',
                docked : 'top',
                title : i18n.gettext('Course Details'),
                buttons : [
                    {
                        xtype : 'button',
                        iconCls : 'md-icon-arrow-back',
                        handler : function() {
                            this.up('ess_modern_learning_course_for_enroll').fireEvent('goBack');
                        }
                    }
                ]
            },
            {
                xtype : 'component',
                bind : {
                    html : '<span class="titleEl">Course Name:</span> {record.name}'
                }
            },
            {
                xtype : 'component',
                margin : '10 0 0 0',
                bind : {
                    html : '<span class="titleEl">Description:</span> {record.description}'
                }
            },
            {
                xtype : 'component',
                margin : '10 0 0 0',
                bind : {
                    html : '<span class="titleEl">Delivery:</span> {record.courseDelivery}'
                }
            },

            {
                xtype : 'container',
                layout : 'hbox',

                margin : '20 20 10 20',
                docked : 'bottom',
                items : [
                    {
                        xtype : 'button',
                        text : i18n.gettext('Assign'),
                        ui : 'act-btn-light',
                        flex : 1,
                        margin : '0 5 0 0',
                        hidden : true,
                        bind : {
                            hidden : '{record.openSpots == 0}'
                        },
                        handler : function() {
                            var main = this.up('ess_modern_learning_course_for_enroll'),
                                vm = main.getViewModel();

                            main.fireEvent('enrollCourse', vm.get('record.id'));
                        }
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Select a Class'),
                        ui : 'act-btn-light',
                        flex : 1,
                        margin : '0 0 0 5',
                        hidden : true,
                        bind : {
                            hidden : '{record.courseDeliveryCode != "' + criterion.Consts.COURSE_DELIVERY.CLASSROOM + '"}'
                        },
                        handler : function() {
                            var main = this.up('ess_modern_learning_course_for_enroll'),
                                vm = main.getViewModel();

                            main.fireEvent('selectClass', vm.get('record.id'));
                        }
                    }
                ]
            }
        ]

    };

});
