
//onkeydown
export const saveContentAfterPressEnter = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        e.target.blur();
    }
}
//select all input value when click
export const selectAllInText = (e) => {
    e.target.focus();
    e.target.select();
}