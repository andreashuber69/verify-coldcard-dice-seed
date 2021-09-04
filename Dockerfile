FROM alpine
RUN apk add --update npm
RUN npm install -g verify-coldcard-dice-seed
CMD ["verify-coldcard-dice-seed"]