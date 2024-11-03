import os
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Set up Google Drive API
SCOPES = ['https://www.googleapis.com/auth/drive.file']
SERVICE_ACCOUNT_FILE = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
creds = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES)
print(creds)
drive_service = build('drive', 'v3', credentials=creds)

# Recursively list file names
def list_files(folder_id, parent_path=''):
    results = drive_service.files().list(
        q=f"'{folder_id}' in parents",
        fields='files(id, name, mimeType)').execute()
    files = results.get('files', [])
    for file in files:
        file_id = file['id']
        file_name = file['name']
        if file['mimeType'] == 'application/vnd.google-apps.folder':
            new_folder_path = os.path.join(parent_path, file_name)
            print(f"Folder: {new_folder_path}")
            list_files(file_id, new_folder_path)
        else:
            file_path = os.path.join(parent_path, file_name)
            print(f"File: {file_path}")

if __name__ == '__main__':
    root_folder_id = '1dR20I3dbz-oK8dFvabYjUfIGnJlEyC-n'  # Replace with your root folder ID
    list_files(root_folder_id)

