FROM ubuntu:18.04

RUN apt-get update && apt-get install -y --no-install-recommends \
    emacs \
    git \
    wget \
    ca-certificates \
    curl \
    nmap \
    less \
    gcc \
    g++ \
    libmysqlclient-dev \
    python3.6 \
    python3.6-dev \
    python3-distutils \
    python3-mysqldb
RUN cd /tmp/ && wget https://bootstrap.pypa.io/get-pip.py && python3 get-pip.py

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - && apt-get install -y nodejs

RUN apt-get install -y gnupg2
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install -y yarn

RUN apt-get install -y sudo lsof make
RUN pip3 install arrow

RUN apt-get install -y libudev-dev
RUN apt-get install -y libusb-1.0-0-dev

WORKDIR /code/
ADD package.json /code/
RUN yarn

ADD truffle-config.js .solhint.json /code/
ADD test/ /code/test/
ADD contracts/ /code/contracts/

RUN yarn compile
RUN yarn lint
RUN yarn test

CMD echo
