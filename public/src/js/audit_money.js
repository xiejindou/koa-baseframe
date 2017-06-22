/*原生*/
var ip = document.body.querySelectorAll("input[type='checkbox']");
var target_type = ["in_hand", "ok", "fail"];
for (var i = 0; i < ip.length; i++) {
    ip[i].addEventListener("click", function() {
        if (target_type.indexOf(this.value) > -1) {
            if (this.checked) {
                audit_type.push(this.value);
            } else {
                removeByValue(audit_type, this.value);
            }
            console.log(audit_type);
        }
    });
}

var bt = document.querySelectorAll(".ivu-table-filter-footer button span");
//console.log(bt);
for (var i = 0; i < bt.length; i++) {
    bt[i].addEventListener("click", function() {
        if (this.innerHTML == "筛选") {
            //console.log(audit_type);
            myvm.options.methods.getPage(0);
        } else if (this.innerHTML == "重置") {
            audit_type = [];
        }
    });
}
//删除数组指定元素
function removeByValue(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}