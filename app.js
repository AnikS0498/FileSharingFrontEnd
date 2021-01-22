 const uploadArea = document.querySelector(".upload-area");
 const uploadButton = document.querySelector(".btn");
 const fileInput = document.querySelector("#fileInput");
 const progressContainer = document.querySelector(".progress-container");
 const bgProgress = document.querySelector(".bg-progress");
 const percentDiv = document.querySelector("#percent");
 const small_progress_bar = document.querySelector(".small-progress-bar");
 const downloadContainerLink = document.querySelector(".download-link-container");
 const downloadLinkGenerator = document.querySelector("#downloadLink");
 const uploadMessage = document.querySelector(".uploadMessage");
 const copyButton = document.querySelector("#copyButton"); 
 const downloadLinkInput = document.querySelector("#downloadLinkInput");
 const toast = document.querySelector("#toast");
 const downloadButton = document.querySelector("#downloadButton");

 const host = "https://file-sharing-anikesh.herokuapp.com/";
 const uploadUrl = host + "api/files";

 const maxAllowedSize = 100*1024*1024;

 uploadArea.addEventListener("dragover", (event)=>{
    event.preventDefault();
    if(!uploadArea.classList.contains("upload-area-item-dropped"))
    {
        uploadArea.classList.add("upload-area-item-dropped");
    }
});
 
 uploadArea.addEventListener("dragleave", ()=>{
    uploadArea.classList.remove("upload-area-item-dropped");
 });

 uploadArea.addEventListener("drop", (event)=>{
    uploadArea.classList.remove("upload-area-item-dropped");
    const files = event.dataTransfer.files;
    console.log(files);
    event.preventDefault();
    if(files.length===1){
        fileInput.files = files;
        uploadFile();
    }else{
      showToast("Upload 1 file at a time");
      return;
    }
 });

 uploadButton.addEventListener("click", ()=>{
    fileInput.click();
 });


 fileInput.addEventListener("change" ,()=>{
     uploadFile();
 })

 const uploadFile = ()=>{
     
     const file = fileInput.files[0];
     if(file.size > maxAllowedSize){
         fileInput.value="";
         showToast("File size exceeded 100 MB");
         return;
     }
     progressContainer.style.display = "block";
     const formData = new FormData();
     formData.append("myfile", file);

     const xhr = new XMLHttpRequest();
     xhr.onreadystatechange = ()=>{
         if(xhr.readyState===XMLHttpRequest.DONE){
             const downloadLink = JSON.parse(xhr.response).file;
            //  console.log(downloadLink);
             showLink(downloadLink);
         }
     };

     xhr.upload.onprogress = updateProgress;
     xhr.upload.onerror = ()=>{
        fileInput.value = "";
        showToast(`Error in upload: ${xhr.statusText}`);
     }

     xhr.open("POST", uploadUrl);
     xhr.send(formData);
 };

 const updateProgress = (event)=>{
    const uploadPercent = Math.round((event.loaded/event.total) * 100);
    // console.log(uploadPercent);
    bgProgress.style.width = `${uploadPercent}%`;
    percentDiv.innerHTML = uploadPercent;
    small_progress_bar.style.transform = `scaleX(${uploadPercent/100})`;
 };

 const showLink = (downloadLink)=>{
    progressContainer.style.display = "none";
    uploadMessage.style.display = "inline";
    downloadContainerLink.style.display = "inline";
    downloadLinkGenerator.href = downloadLink;
    
 }

 copyButton.addEventListener("click", ()=>{
    copyText(downloadLink);
 });

 const copyText = (downloadableLink) =>{
    
    let link = downloadableLink.href;
    console.log(link);
    let inputElement = document.createElement("input");
    inputElement.setAttribute("value", link);
    document.body.appendChild(inputElement);
    inputElement.select();
    document.execCommand("copy");
    showToast("Download link copied");
    
    inputElement.parentNode.removeChild(inputElement);
    
 }


 const showToast = (msg)=>{
   toast.innerHTML = msg;
   toast.style.transform = "translateY(0)";
   
   const toastTimer = setTimeout(()=>{
      toast.style.transform = "translateX(300%)";
   }, 2000);
   refresh();
 }

 downloadButton.addEventListener("click", ()=>{
    refresh();
 })

 const refresh = ()=>{
    setTimeout(()=>{
       location.reload();
    }, 4000);
 }
