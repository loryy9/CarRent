setTimeout(() => {
    const toast = document.querySelector('.toast-notification');
    if (toast){
        toast.style.animation = 'fadeOut 0.5s forwards';
        setTimeout(() => {
            toast.remove();
        }, 500);
    }
}, 5000);