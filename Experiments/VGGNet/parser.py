import argparse

def parse_args():
    parser = argparse.ArgumentParser(description='Model Params')
    parser.add_argument('--epoch', default=100, type=int, help='number of epochs')
    parser.add_argument('--lr', default=1e-3, type=float, help='learning rate')
    parser.add_argument('--vgg_model', default='VGG16', type=str, help='select vgg_net model')
    parser.add_argument('--cuda', default='0', type=str, help='the gpu to use')
    parser.add_argument('--step_size', default=30, type=int, help='Optimizer step size')
    parser.add_argument('--gamma', default=0.1, type=float, help='Optimizer gamma')
    
    # parser.add_argument('--note', default=None, type=str, help='note')
    # parser.add_argument('--lambda1', default=0.1, type=float, help='weight of cl loss')
    
    # parser.add_argument('--d', default=64, type=int, help='embedding size')
    # parser.add_argument('--q', default=3, type=int, help='rank')
    # parser.add_argument('--gnn_layer', default=1, type=int, help='number of gnn layers')
    # parser.add_argument('--data', default='jobs', type=str, help='name of dataset')
    # parser.add_argument('--dropout', default=0.25, type=float, help='rate for edge dropout')
    # parser.add_argument('--temp', default=0.1, type=float, help='temperature in cl loss')
    # parser.add_argument('--lambda2', default=1e-6, type=float, help='l2 reg weight')
    return parser.parse_args()
args = parse_args()
