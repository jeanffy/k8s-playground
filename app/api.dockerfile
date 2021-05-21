FROM node:lts
RUN mkdir /nodulapi
COPY . /nodulapi
WORKDIR /nodulapi
CMD ["node", "src/api.js"]
