from data_loader import VGG_Data_Load
from model import VGGnet
from parser import args
from metrics import metrics_batch, loss_batch, loss_epoch, get_lr, save_loss
from __init__ import *
sys.path.append("./")
from gpu_utils import GPUs


def vgg_train():
    lr = args.lr
    epoch_no = args.epoch
    model_name = args.vgg_model
    device = torch.device('cuda:' + args.cuda)
    step_size = args.step_size
    gamma = args.gamma
    batch_size = args.batch
    resumption = args.resumption
    check_PATH = os.getcwd() + "/VGGNet/points/model.pt"
    save_path = os.getcwd() + "\\VGGNet\\outputs\\"
    ## Data Load
    train_dl, val_dl = VGG_Data_Load(batch_size)
    
    gpus = GPUs(args.cuda)
    model = VGGnet(model_name, in_channels=3, num_classes=10, init_weights=True).to(device)
    print(f"Learning Rate : {lr}, Epoch : {epoch_no}, Model Name : {model_name}, Batch Size : {batch_size}, CUDA : {args.cuda}, Step_size : {step_size}, Gamma : {gamma}")
    if resumption == 0:
        opt = optim.Adam(model.parameters(), lr=lr)
        loss_func = nn.CrossEntropyLoss(reduction="sum")
        lr_scheduler = StepLR(opt, step_size=step_size, gamma=gamma)

        print("---train---")
        for epoch in tqdm(range(epoch_no),
                        desc="VGGNet",
                        ncols=70,
                        ascii=' *', 
                        mininterval=0.01,
                        leave=True):
            # check 1 epoch start time
            start_time = time.time()

            # get current learning rate
            current_lr=get_lr(opt)
            print('\nEpoch {}/{}, current lr={}'.format(epoch+1, epoch_no, current_lr))

            # train model on training dataset
            model.train()
            train_loss, train_metric=loss_epoch(model,loss_func,train_dl,device,False,opt)

            # evaluate model on validation dataset
            model.eval()
            with torch.no_grad():
                val_loss, val_metric=loss_epoch(model,loss_func,val_dl,device)

            # learning rate schedule
            lr_scheduler.step()
            
            print("train loss: %.6f, dev loss: %.6f, accuracy: %.2f, time: %.4f s" %(train_loss,val_loss,100*val_metric, time.time()-start_time))
            print("-"*10)
            torch.save({
                'epoch' : epoch+1,
                'model_state_dict' : model.state_dict(),
                'optimizer_state_dict' : opt.state_dict(),
                'current_lr' : current_lr,
            }, check_PATH)
            save_loss(save_path, epoch+1, train_loss, train_metric,val_loss, val_metric)
            print("Check Point Save Success")
            gpu_electric = gpus.get_gpu_usage()
            print(f"전력 소비량 : {gpu_electric}W")


    else:
        print("\n--- Migration Success ---")
        checkPoint = torch.load(check_PATH)
        model.load_state_dict(checkPoint['model_state_dict'])
        opt = optim.Adam(model.parameters(), lr=lr)
        # opt = optim.Adam(model.parameters(), lr=checkPoint['current_lr'])
        opt.load_state_dict(checkPoint['optimizer_state_dict'])
        loss_func = nn.CrossEntropyLoss(reduction="sum")
        lr_scheduler = StepLR(opt, step_size=step_size, gamma=gamma)
        for epoch in tqdm(range(checkPoint['epoch'],epoch_no),
                        desc="VGGNet",
                        ncols=70,
                        ascii=' *', 
                        mininterval=0.01,
                        leave=True):
            start_time = time.time()

            # get current learning rate
            current_lr=get_lr(opt)
            print('\nEpoch {}/{}, current lr={}'.format(epoch+1, epoch_no, current_lr))

            # train model on training dataset
            model.train()
            train_loss, train_metric=loss_epoch(model,loss_func,train_dl,device,False,opt)

            model.eval()
            with torch.no_grad():
                val_loss, val_metric=loss_epoch(model,loss_func,val_dl,device)

            # learning rate schedule
            lr_scheduler.step()
            
            print("train loss: %.6f, dev loss: %.6f, accuracy: %.2f, time: %.4f s" %(train_loss,val_loss,100*val_metric, time.time()-start_time))
            print("-"*10)
            torch.save({
                'epoch' : epoch+1,
                'model_state_dict' : model.state_dict(),
                'optimizer_state_dict' : opt.state_dict(),
                'current_lr' : current_lr,
            }, check_PATH)
            save_loss(save_path, epoch+1, train_loss, train_metric,val_loss, val_metric)
            print("Check Point Save Success")
            gpu_electric = gpus.get_gpu_usage()
            print(f"전력 소비량 : {gpu_electric}")
    
    
if __name__ == "__main__":
    vgg_train()