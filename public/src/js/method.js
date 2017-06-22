function rowClass_Color(row, index) {
    console.log(1111)
    var num = index % 2;
    if (num == 0) {
        return 'single';
    } else if (num == 1) {
        return 'double';
    }
}