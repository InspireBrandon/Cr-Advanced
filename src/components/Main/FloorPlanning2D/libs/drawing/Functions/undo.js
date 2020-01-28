// ////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: A common library to handle undo functionality
// Author: Brandon Lange
// Date: 2020/01/08
// ////////////////////////////////////////////////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////////////////////////////////////////////////////
// NOTES:
// - Make sure to never register more than 1 instance otherwise undo will fire twice
// ////////////////////////////////////////////////////////////////////////////////////////////////////

class UndoHelper {
    constructor(maxHistorycount) {
        let self = this;
        self.history = [];
        self.maxHistorycount = (maxHistorycount == undefined || maxHistorycount == null) ? 50 : maxHistorycount;
        
        AddListener(() => {
            if(self.history.length > 0) {
                self.history[0].undo();
                self.history.splice(0, 1);
            }
        });
    }

    addToHistory(callback) {
        let self = this;
        
        if(self.maxHistorycount != -1 && self.history.length >= self.maxHistorycount) {
            self.history.splice((self.history.length - 1), 1);
        }  

        self.history.unshift(new UndoItem(callback));
    }
}

function AddListener(callback) {
    document.onkeydown = function(e) {
        var evtobj = window.event? event : e;

        if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
            callback();
        }
    }
}

export default UndoHelper;

class UndoItem {
    constructor(callback) {
        let self = this;
        self.undo = callback;
    }
}