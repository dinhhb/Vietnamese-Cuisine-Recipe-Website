const deleteDish = (btn) => {
    const dishId = btn.parentNode.querySelector('[name=dishId]').value;
    const dishElement = btn.closest('tr');

    fetch('/admin/dish/' + dishId, {
        method: 'DELETE'
    }).then(result => {
        return result.json();
    }).then(data => {
        console.log(data);
        dishElement.parentNode.removeChild(dishElement);
    }).catch(err => {
        console.log(err);
    });
}