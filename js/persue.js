Crafty.c("Persue", {
    // Who is being persued?
    _target: null,
    
    // How long is this entity willing to pay attention to their pursuant?
    _waitTolerance: 10,
    // How long has this entity been paying attention to their persuant?
    _waitCount: 0,
    
    // Current state 
    _persueState: null,
    PERSUE: 0,
    ALERT: 1,
    INATTENTIVE: 0,
    
    updatePersue: function () {
        // TODO: updatePersue
    },
    
    _doPersue: function () {
        // TODO: _doPersue
    },
    _doAlert: function () {
        // TODO: _doAlert
    },
    _doInattentive: function () {
        // TODO: _doInattentive
    },
    
    persue: function (target) {
        // TODO: persue
    },
    
    init: function () {
        this.requires("NoticeCheck");
    }
});

Crafty.c("NoticeCheck", {
    _noticeTargets: null,
    _noticeState: null,
    
    updateNoticeCheck: function (bonus) {
        // TODO: updateNotice
    },
    
    addNoticeTarget: function (target) {
        // TODO: addNoticeTarget
    },
    
    removeNoticeTarget: function (target) {
        // TODO: removeNoticeTarget
    }
    
    init: function () {
        
    }
});