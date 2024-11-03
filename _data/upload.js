const CLIENT_ID = '252050314172-d04jkuam572vk52k9m53m3m3vapp50vq.apps.googleusercontent.com';
const API_KEY = process.env.API_KEY;
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
    const form