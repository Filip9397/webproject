document.addEventListener('DOMContentLoaded', function () {
    const image_uploadForm = document.getElementById('image_upload');
  
    image_uploadForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const fileInput = document.getElementById('image');
        const formData = new FormData();

        formData.append('image', fileInput.files[0]);


        await fetch('/upload', {
            method: 'POST',
            headers: {
               // 'Content-Type': 'application/json', 
            },
            body: formData,
        });

        setTimeout(function(){window.location.href="/preuzmi_postavi.html";},2000);
        //location.reload();
        //window.location.href="/preuzmi_postavi.html";
    });
  });