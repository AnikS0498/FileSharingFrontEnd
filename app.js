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

 const host = "https://file-sharing-anikesh.herokuapp.com/";
 const uploadUrl = host + "api/files";

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
    if(files.length){
        fileInput.files = files;
        uploadFile();
    }
 });

 uploadButton.addEventListener("click", ()=>{
    fileInput.click();
 });


 fileInput.addEventListener("change" ,()=>{
     uploadFile();
 })

 const uploadFile = ()=>{
     progressContainer.style.display = "block";
     const file = fileInput.files[0];
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
    inputElement.parentNode.removeChild(inputElement);
 }
