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
        self.file_path = f"{self.path}/{self.model}/file/model.pt"
        self.dest_path = f"{self.model}/model.pt"
        self.resource_path = f"{self.model}/resource.json"
        self.resource_file_path = f"{self.path}/{self.model}/file/resource.json" 
        
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
    
    @Timer.timer
    def upload_current_resource(self, used_cpu, used_memory, total_memory, used_gpu, total_gpu, epoch, clock, max_clock, learning_time, carbon_emission, carbons):
        bucket = storage.bucket()
        blob = bucket.blob(self.resource_path)
        try:
            resources = json.dumps({'cpu' : used_cpu,
                            'memory' : used_memory,
                            'total_memory' : total_memory,
                            'gpu' : used_gpu,
                            'total_gpu' : total_gpu,
                            'epoch' : epoch,
                            'clock' : clock,
                            'max_clock' : max_clock,
                            'learning_time' : learning_time,
                            'carbon_emission' : carbon_emission,
                            'CI' : carbons})
            
            blob.upload_from_string(resources, content_type='application/json')
            # print(f"File uploaded to {self.resource_path}")
        except:
            resources = json.dumps({'cpu' : 0,
                            'memory' : 0,
                            'total_memory' : 0,
                            'gpu' : 0,
                            'total_gpu' : 0,
                            'epoch' : 0,
                            'clock' : 0,
                            'max_clock' : 0,
                            'learning_time' : 0,
                            'carbon_emission' : 0,
                            'CI' : 0})
            
            blob.upload_from_string(resources, content_type='application/json')
            print(f"File uploaded to {self.resource_path} Failed")
        
    @Timer.timer
    def download_current_resource(self):
        bucket = storage.bucket(app=self.firebase_app)  # Make sure to pass the initialized app
        blob = bucket.blob(self.resource_path)
        blob.download_to_filename(self.resource_file_path)
        print(f"File downloaded to {self.resource_file_path}")
    

if __name__ == "__main__":
    model = "VGGNet"
    fb = FireBase(model)
    # fb.upload_to_firebase()
    # fb.download_from_firebase()
    # fb.upload_current_resource(1,2,3,4,5,6,7)
