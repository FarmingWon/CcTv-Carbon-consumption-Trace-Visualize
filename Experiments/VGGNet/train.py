from data_loader import VGG_Data_Load
from model import VGGnet
from parser import args
from metrics import metrics_batch, loss_batch, loss_epoch, get_lr
from __init__ import *

lr = args.lr
epoch_no = args.epoch
model_name = args.vgg_model
device = torch.device('cuda:' + args.cuda)
step_size = args.step_size
gamma = args.gamma


## Data Load
train_dl, val_dl = VGG_Data_Load()

model = VGGnet(model_name, in_channels=3, num_classes=10, init_weights=True).to(device)
print("MODEL :", model)

# Loss & Optimizer
loss_func = nn.CrossEntropyLoss(reduction="sum")
opt = optim.Adam(model.parameters(), lr=lr)
lr_scheduler = StepLR(opt, step_size=30, gamma=0.1)

loss_history={
    "train": [],
    "val": [],
}
metric_history={
    "train": [],
    "val": [],
}


for epoch in range(epoch_no):
        # check 1 epoch start time
        start_time = time.time()

        # get current learning rate
        current_lr=get_lr(opt)
        print('Epoch {}/{}, current lr={}'.format(epoch+1, epoch_no, current_lr))

        # train model on training dataset
        model.train()
        train_loss, train_metric=loss_epoch(model,loss_func,train_dl,device,False,opt)

        # collect loss and metric for training dataset
        loss_history["train"].append(train_loss)
        metric_history["train"].append(train_metric)

        # evaluate model on validation dataset
        model.eval()
        with torch.no_grad():
            val_loss, val_metric=loss_epoch(model,loss_func,val_dl,device)

        # collect loss and metric for validation dataset
        loss_history["val"].append(val_loss)
        metric_history["val"].append(val_metric)

        # learning rate schedule
        lr_scheduler.step()

        print("train loss: %.6f, dev loss: %.6f, accuracy: %.2f, time: %.4f s" %(train_loss,val_loss,100*val_metric, time.time()-start_time))
        print("-"*10)

    ## load best model weights
save_path = os.getcwd() + "\\VGGNet\\outputs\\result"
with open(f"{save_path}.txt", 'w') as f:
    f.write("LOSS History : ")
    f.write(str(loss_history)+'\n')
    f.write("metric History : ")
    f.write(str(metric_history)+'\n')
print(loss_history)