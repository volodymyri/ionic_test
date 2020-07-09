!function() {
    const COOKIE = {
        AUTHORIZATION : 'Authorization',
        EMPLOYER_ID : 'EmployerId',
        EMPLOYEE_ID : 'employeeId',
        QUEUE_ID : 'queueId',
        BASE_URL : 'baseUrl'
    };

    var approve = $('.approve'),
        reject = $('.reject'),
        employee = $('.employee'),
        comment = $('.comment'),
        requestType = $('.request-type'),
        decision = $('.decision'),
        searchParams = new URLSearchParams(window.location.search),
        approved = searchParams && searchParams.has('approved') && (searchParams.get('approved') === 'true'),
        isRecall = searchParams && searchParams.has('recall') && (searchParams.get('recall') === 'true'),
        employeeName = searchParams && searchParams.has('employee') && searchParams.get('employee'),
        tenantId = searchParams && searchParams.has('tenantId') && searchParams.get('tenantId') || '0',
        logoUrl = 'url("/tenant/logo/' + tenantId + '")';

    $('.logo').css('background-image', logoUrl);

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function enableApproved() {
        approve.addClass('active');
        approve.html('Approved');
        approved = true;

        reject.removeClass('active');
        reject.html('Reject');
    }

    function enableRejected() {
        reject.addClass('active');
        reject.html('Rejected');
        approved = false;

        approve.removeClass('active');
        approve.html('Approve');
    }

    if (approved) {
        enableApproved();
    } else {
        enableRejected();
    }

    if (employeeName) {
        employee.html(employeeName);
    } else {
        employee.removeClass('employee');
    }

    if (isRecall) {
        requestType.html('Recall Request');
    } else {
        requestType.html('Request');
    }

    approve.on('click', function() {
        enableApproved();
    });

    reject.on('click', function() {
        enableRejected();
    });

    $('.submit').on('click', function() {
        var completeUrl = getCookie(COOKIE.BASE_URL) + (approved ? 'approve' : 'reject') + '/' + getCookie(COOKIE.QUEUE_ID),
            commentValue = comment.val().trim();

        $.ajax({
            url : completeUrl,
            headers : {
                'Authorization' : getCookie(COOKIE.AUTHORIZATION),
                'EmployerId' : getCookie(COOKIE.EMPLOYER_ID),
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            type : 'PUT',
            dataType : 'json',
            data : JSON.stringify({
                'employeeId' : getCookie(COOKIE.EMPLOYEE_ID),
                'comment' : commentValue.length ? commentValue : (approved ? "Approved by email action" : "Rejected by email action")
            }),
            success : function() {
                decision.html((approved ? 'approved' : 'rejected'));
                $('.content').fadeOut(function() {
                    $('.final').fadeIn();
                });
            },
            error : function(jqXHR, textStatus, errorThrown) {
                $('.final').addClass('error').html(errorThrown);
                $('.content').fadeOut(function() {
                    $('.final').fadeIn();
                });
                setTimeout(function() {
                    $('.final').removeClass('error').html(errorThrown);
                    $('.final').fadeOut(function() {
                        $('.content').fadeIn();
                    });
                }, 5000);
            }
        });
    });

    $('.cancel').on('click', function() {
        window.location.href = '/';
    });
}();