from __init__ import *
from utils import Timer
    
class FireBase:
    def __init__(self, model):
        self.app = credentials.Certificate("cctv-8254e-firebase-adminsdk-iklw3-fba245baf5.json")
        self.firebase_app = firebase_admin.initialize_app(self.app,{
            'storageBucket': 'cctv-8254e.appspot.com'  # Replace with your actual bucket name
        })
        self.model = model
        self.path = os.getcwd()
        self.file_path = f"{self.path}/{self.model}/points/model.pt"
        self.dest_path = f"{self.model}/model.pt"
    
    @Timer.timer
    def upload_to_firebase(self):
        bucket = storage.bucket()
        blob = bucket.blob(self.dest_path)
        blob.upload_from_filename(self.file_path)
        print(f"File uploaded to {self.dest_path}")
        
    @Timer.timer
    def download_from_firebase(self):
        bucket = storage.bucket(app=self.firebase_app)  # Make sure to pass the initialized app
        blob = bucket.blob(self.dest_path)
        blob.download_to_filename(self.file_path)
        print(f"File downloaded to {self.file_path}")
    

if __name__ == "__main__":
    model = "VGGNet"
    fb = FireBase(model)
    fb.upload_to_firebase()
    fb.download_from_firebase()