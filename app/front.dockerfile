FROM node:lts
RUN mkdir /nodulfront
COPY . /nodulfront
WORKDIR /nodulfront
CMD ["node", "src/front.js"]
