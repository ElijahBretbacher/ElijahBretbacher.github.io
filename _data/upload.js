const CLIENT_ID = 'YOUR_CLIENT_ID';
const API_KEY = 'YOUR_API_KEY';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
        scope: SCOPES
    }).then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        document.getElementById('upload-form').style.display = 'block';
        document.getElementById('signin-button').style.display = 'none';
    } else {
        document.getElementById('signin-button').style.display = 'block';
        document.getElementById('upload-form').style.display = 'none';
    }
}

function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

async function uploadFile(file, tags) {
    const metadata = {
        name: file.name,
        mimeType: file.type,
        description: tags.join(', ')
    };
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    const response = await fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`, {
        method: 'POST',
        headers: new Headers({ 'Authorization': 'Bearer ' + gapi.auth.getToken().access_token }),
        body: form
    });
    const result = await response.json();
    console.log('File uploaded:', result);
    alert('File uploaded successfully!');
}

document.getElementById('upload-form').addEventListener('submit', event => {
    event.preventDefault();
    const file = document.getElementById('file').files[0];
    const tags = document.getElementById('tags').value.split(',');
    uploadFile(file, tags);
});

window.addEventListener('load', handleClientLoad);
