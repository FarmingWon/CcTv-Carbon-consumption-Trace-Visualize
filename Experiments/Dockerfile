# Use an official NVIDIA CUDA runtime with cuDNN as a parent image
FROM nvidia/cuda:12.1.0-cudnn8-runtime-ubuntu22.04

# Set the working directory in the container
WORKDIR /usr/src/app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y software-properties-common sudo gcc python3-dev python3-pip && \
    add-apt-repository ppa:graphics-drivers/ppa --yes && \
    apt-get update && \
    apt-get install -y && \
    pip3 install --upgrade pip && \
    rm -rf /var/lib/apt/lists/*

# Copy the requirements file and install Python dependencies
COPY requirements.txt .
# RUN pip3 install --no-cache-dir -r requirements.txt --verbose
RUN pip3 install --no-cache-dir --ignore-installed -r requirements.txt --verbose
# Copy the rest of the application
COPY . .

# Make port 80 available to the world outside this container
EXPOSE 80

# Set NVIDIA environment variables
ENV NVIDIA_VISIBLE_DEVICES all
ENV NVIDIA_DRIVER_CAPABILITIES compute,utility

# Run train.py when the container launches
CMD ["python3", "VGGNet/train.py"]
# CMD ["python3", "VGGNet/train.py", "--epoch", "100", "--lr", "0.001", "--batch", "8", "--vgg_model", "VGG16", "--cuda", "0", "--step_size", "30", "--gamma", "0.1", "--resumption", "0", "--ssh_server", "0", "--threshold", "250"]