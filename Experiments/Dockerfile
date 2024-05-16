# Use an official NVIDIA CUDA runtime as a parent image
# FROM nvidia/cuda:12.1.0-base-ubuntu20.04
FROM nvidia/cuda:12.1.0-cudnn8-runtime-ubuntu22.04

# Set the working directory in the container
WORKDIR /usr/src/app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y software-properties-common && \
    add-apt-repository ppa:graphics-drivers/ppa --yes && \
    apt-get update && \
    apt-get install -y sudo gcc python3-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install Python and pip
RUN apt-get update && apt-get install -y python3-pip python3 && \
    apt-get remove python3-blinker -y && \
    pip3 install --upgrade pip

# Install any needed packages specified in requirements.txt 
RUN pip install --no-cache-dir -r requirements.txt --verbose
RUN pip install aioelectricitymaps
COPY . . 
# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variable
ENV NAME World

# Use the official NVIDIA runtime as the base image
ENV NVIDIA_VISIBLE_DEVICES all
ENV NVIDIA_DRIVER_CAPABILITIES compute,utility

# Run train.py when the container launches
CMD ["python", "VGGNet/train.py", "--epoch", "100", "--lr", "0.001", "--batch", "8", "--vgg_model", "VGG16", "--cuda", "0", "--step_size", "30", "--gamma", "0.1", "--resumption", "0", "--ssh_server", "0", "--threshold", "250"]
# docker run -it --gpus all  python carbon_test VGGNet/train.py --epoch 100 --lr 0.001 --batch 8 --vgg_model VGG16 --cuda 0 --step_size 30 --gamma 0.1 --resumption 0 --ssh_server 0 --threshold 250