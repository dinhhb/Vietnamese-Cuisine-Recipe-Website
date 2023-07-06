const deleteDish = (btn) => {
    const dishId = btn.parentNode.querySelector('[name=dishId]').value;
    const dishElement = btn.closest('tr');

    // Show confirmation dialog
    const confirmDelete = confirm("Bạn có chắc chắn muốn xoá món ăn này không?");
    if (!confirmDelete) {
        return; // Do nothing if the user cancels the deletion
    }

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