FROM node:9

ENV APP_ROOT /app

RUN mkdir $APP_ROOT
WORKDIR $APP_ROOT

RUN npm i -g @angular/cli \
    && npm i -g typescript
	
EXPOSE 4200

CMD ["bash", "init.sh"]
