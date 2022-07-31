document.querySelector('#access-files-btn')?.addEventListener('mousedown', () => {
    (<HTMLElement> document.querySelector('#access-files-btn'))!.style.boxShadow = 'none';
});

document.querySelector('#access-files-btn')?.addEventListener('mouseup, mouseout', () => {
    (<HTMLElement> document.querySelector('#access-files-btn'))!.style.boxShadow = '0px 0px 30px 3px #589fd592'; 
});